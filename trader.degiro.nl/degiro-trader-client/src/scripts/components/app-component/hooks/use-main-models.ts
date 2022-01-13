import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {logErrorLocally, logMessageLocally} from 'frontend-core/dist/loggers/local-logger';
import {logErrorRemotely, setRemoteLoggerUser} from 'frontend-core/dist/loggers/remote-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Config} from 'frontend-core/dist/models/config';
import {User} from 'frontend-core/dist/models/user';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import isHttpAuthError from 'frontend-core/dist/services/app-error/is-http-auth-error';
import isTaskManagerDeadlineError from 'frontend-core/dist/services/app-error/is-task-manager-deadline-error';
import isUsPersonError from 'frontend-core/dist/services/app-error/is-us-person-error';
import getConfig from 'frontend-core/dist/services/config/get-config';
import setConfigFromUser from 'frontend-core/dist/services/config/set-config-from-user';
import getMainClient from 'frontend-core/dist/services/user/get-main-client';
import logout from 'frontend-core/dist/services/user/logout';
import redirectToLoginPage from 'frontend-core/dist/services/user/redirect-to-login-page';
import redirectToTaskManager from 'frontend-core/dist/services/user/redirect-to-task-manager';
import reloadClientAfterAccountUpgrade from 'frontend-core/dist/services/user/reload-client-after-account-upgrade';
import switchCurrentClient from 'frontend-core/dist/services/user/switch-current-client';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {createEventBroker as createEventBrokerInstance, EventBroker} from '../../../event-broker';
import {ClientAccountEvents, LanguageSettingsEvents, ServiceEvents} from '../../../event-broker/event-types';
import {SubscriptionEvent} from '../../../event-broker/subscription';
import {errorLoggerOptions, initialConfig} from '../../../models/config';

interface Result {
    isLoading: boolean;
    eventBroker: EventBroker;
    config: Config | undefined;
    mainClient: User | undefined;
    currentClient: User | undefined;
    displayLanguage: User['displayLanguage'] | undefined;
}

const createEventBroker = (): EventBroker => {
    const pageScripts: HTMLScriptElement[] = [].slice.call(document.scripts || [], 0);

    return createEventBrokerInstance({
        workerFile: (document.querySelector('link[href*="event-broker-worker"]') as HTMLLinkElement).href,
        requires: pageScripts
            .filter(
                ({src}: HTMLScriptElement) =>
                    src.includes('scripts/runtime.') ||
                    src.includes('scripts/vendor.') ||
                    src.includes('scripts/frontend-core.')
            )
            .map((script: HTMLScriptElement) => script.src),

        // 20 minutes on touch devices and 60 minutes on the rest
        idleTime: isTouchDevice() ? 20 : 60
    });
};

export default function useMainModels(): Result {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const eventBroker = useMemo<EventBroker>(createEventBroker, []);
    const [config, setConfig] = useState<Config | undefined>();
    const [mainClient, setMainClient] = useState<User | undefined>();
    const [currentClient, setCurrentClient] = useState<User | undefined>();
    const [displayLanguage, setDisplayLanguage] = useStateFromProp<User['displayLanguage'] | undefined>(
        mainClient?.displayLanguage
    );
    const [error, setError] = useState<Error | AppError | undefined>();
    // Update config and client in one cycle instead of using useEffect with dependencies to prevent
    // additional re-rendering and additional re-matching of `config` object in all child components
    const update = (config: Config, mainClient: User, currentClient: User) => {
        const newConfig = setConfigFromUser(config, currentClient);

        setConfig(newConfig);
        setMainClient(mainClient);
        setCurrentClient(currentClient);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        restartEventBroker(newConfig, mainClient, currentClient);
    };
    const restartEventBroker = (config: Config, mainClient: User, currentClient: User) => {
        // [WF-2774] remove active subscriptions
        eventBroker.stop();

        const onLogout = (event: SubscriptionEvent) => {
            eventBroker.stop();
            setIsLoading(true);

            if (event.name === ServiceEvents.EXPIRED_SESSION) {
                logMessageLocally(event);
                return redirectToLoginPage(config, {params: {reason: 'session_expired'}});
            }

            return (
                logout(config)
                    .catch(logErrorLocally)
                    // redirect to login even if we got an error
                    .then(() => redirectToLoginPage(config))
            );
        };
        const onSwitchAccount = (_event: SubscriptionEvent, {client}: {client: User}) => {
            const {intAccount} = client;

            if (intAccount == null) {
                logErrorLocally('Impossible to switch on account', client);
                return;
            }

            setIsLoading(true);
            setError(undefined);

            switchCurrentClient(config, mainClient, {intAccount})
                .then((currentClient: User) => {
                    update(config, mainClient, currentClient);
                    // [WF-1777]
                    history.push(Routes.PORTFOLIO);

                    // we should unset a loader ONLY AFTER EventBroker starts,
                    // because children components subscribe on its events on didMount stage
                    setIsLoading(false);
                })
                .catch((error: Error | AppError) => {
                    logErrorLocally(error);
                    setIsLoading(false);
                });
        };
        const onChangeTradingProfile = () => {
            setIsLoading(true);

            reloadClientAfterAccountUpgrade(config, mainClient, currentClient)
                .then((response: {mainClient: User; currentClient: User}) => {
                    update(config, response.mainClient, response.currentClient);
                    setIsLoading(false);
                })
                .catch((error: Error | AppError) => {
                    logErrorLocally(error);
                    setIsLoading(false);
                });
        };

        eventBroker.on(ServiceEvents.EXPIRED_SESSION, onLogout);
        eventBroker.on(ServiceEvents.MAX_FAILED_UPDATE_REQUESTS, onLogout);
        eventBroker.on(ClientAccountEvents.LOGOUT, onLogout);
        eventBroker.on(ClientAccountEvents.SWITCH_ACCOUNT, onSwitchAccount);
        eventBroker.on(ClientAccountEvents.CHANGE_TRADING_PROFILE, onChangeTradingProfile);
        eventBroker.on(LanguageSettingsEvents.CHANGE_DISPLAY_LANGUAGE, (_, language) => setDisplayLanguage(language));
        eventBroker.start({
            referrer: vwdReferrer,
            userAgent: window.navigator.userAgent,
            currentClient,
            mainClient,
            appConfig: config,
            errorLogger: errorLoggerOptions,
            maxSnapshotRequestErrorsCount: 10,
            dedicatedVwdStreamer: true
        });
    };

    useEffect(() => {
        if (error) {
            logErrorLocally(error);

            // 'debugger;' statement is used to allow to set a breakpoint before the redirect
            // eslint-disable-next-line no-debugger
            debugger;
            logErrorRemotely(error);

            if (config && isTaskManagerDeadlineError(error)) {
                redirectToTaskManager(config);
            } else if (config && !isUsPersonError(error) && !isHttpAuthError(error)) {
                // user will be redirected directly from requestToApi() method on auth and UsPerson errors
                redirectToLoginPage(config);
            }
        }
    }, [config, error]);

    useLayoutEffect(() => {
        setIsLoading(true);

        const unsubscribeFromEventBroker = () => eventBroker.off();
        const loadRequest = createCancellablePromise<[Config, User]>(
            getConfig(initialConfig).then((config: Config) => {
                // save config here, because it will be used in the error handling for this promise
                setConfig(config);
                return getMainClient(config).then((mainClient: User) => [config, mainClient]);
            })
        );

        loadRequest.promise
            .then(([config, mainClient]) => {
                update(config, mainClient, mainClient);
                setIsLoading(false);
            })
            .catch(setError);

        // unsubscribe from closed port (tab/window)
        window.addEventListener('beforeunload', unsubscribeFromEventBroker);

        return () => {
            loadRequest.cancel();
            window.removeEventListener('beforeunload', unsubscribeFromEventBroker);
        };
    }, []);

    useEffect(() => {
        if (config && mainClient) {
            // [WF-1198]
            if (mainClient.intAccount == null) {
                return redirectToTaskManager(config);
            }
            setRemoteLoggerUser({id: mainClient.id});
        }
    }, [mainClient?.id]);

    return {
        isLoading,
        eventBroker,
        config,
        mainClient,
        currentClient,
        displayLanguage
    };
}
