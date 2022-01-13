import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {layout, main as mainStyle} from 'frontend-core/dist/components/ui-onboarding/index.css';
import Modal, {ModalApi, ModalErrorHandler, ModalProps} from 'frontend-core/dist/components/ui-trader3/modal';
import Spinner from 'frontend-core/dist/components/ui-trader3/spinner';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError} from 'frontend-core/dist/models/app-error';
import {I18n, I18nModules} from 'frontend-core/dist/models/i18n';
import getDeviceInfo, {DeviceInfo} from 'frontend-core/dist/platform/get-device-info';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import getI18n from 'frontend-core/dist/services/i18n/get-i18n';
import hasTranslation from 'frontend-core/dist/services/i18n/has-translation';
import localize from 'frontend-core/dist/services/i18n/localize';
import createUUID from 'frontend-core/dist/utils/create-uuid';
import parseUrl from 'frontend-core/dist/utils/url/parse-url';
import * as React from 'react';
import {Redirect, Route, RouteComponentProps, Switch} from 'react-router-dom';
import '../../../styles/index.css';
import {AppParams, RedirectReasons} from '../../models/app-params';
import {Config, initialConfig} from '../../models/config';
import {IexParams} from '../../models/iex';
import {LocalData} from '../../models/local-data';
import {User} from '../../models/user';
import {resetUserUrlEntry, Routes} from '../../navigation';
import getRegistrationUrl from '../../services/config/get-registration-url';
import registerDevice from '../../services/device-info/register-device';
import validateIexParams from '../../services/iex/validate-iex-params';
import getLocalData from '../../services/local-data/get-local-data';
import setLocalData from '../../services/local-data/set-local-data';
import getUrlParams from '../../services/location/get-url-params';
import matchUserNames from '../../services/user/match-usernames';
import Header from '../header';
import Icon from '../icon';
import {showIexConfirmationModal} from '../iex/confirmation';
import Onboarding from '../onboarding';
import PageNotification, {PageNotificationTypes} from '../page-notification';
import PassCodeLogin from '../passcode/passcode-login';
import PassCodeReset from '../passcode/passcode-reset';
import PasswordLogin from '../password-login';
import PasswordReset from '../password-reset';
import PasswordResetConfirmation from '../password-reset/password-reset-confirmation';
import UserActivationResult from '../user-activation-result';
import Users from '../users';
import {
    AppApiContext,
    AppParamsContext,
    ConfigContext,
    DeviceInfoContext,
    I18nContext,
    UserContext,
    UsersContext
} from './app-context';
import updatePageHelmet from './update-page-helmet';

export const defaultUrl: string = Routes.PASSWORD_LOGIN;

type RouteProps = RouteComponentProps<any>;

export type ModalOpenHandler = (props: ModalProps) => void;
export type ModalCloseHandler = () => void;

type AppProps = RouteProps;

interface AppState {
    i18n: I18n;
    config: Config;
    user: User;
    users: User[];
    appParams: AppParams;
    deviceInfo: Partial<DeviceInfo>;
    isI18nLoaded: boolean;
    isOnboardingScreenStep: boolean;
    isUserActivationResultStep: boolean;
    isPassCodeAuthAvailable: boolean;
    isLoading: boolean;
    pageNotificationContent?: React.ReactNode | React.ReactNode[];
}

interface UserRemovalOptions {
    selectNextUser: boolean;
}

export interface AppComponentApi {
    openModal: ModalOpenHandler;
    closeModal: ModalCloseHandler;
    openErrorModal: ModalErrorHandler;
    goToPasswordLogin(): void;
    goToUserResetLogin(): void;
    addUser(): void;
    updateCurrentUser(user: User, onUpdate?: () => void): void;
    removeUser(user: User, options?: UserRemovalOptions): void;
}

export default class AppComponent extends React.PureComponent<AppProps, AppState> {
    private readonly appApi: AppComponentApi;
    private modalApi?: ModalApi;

    constructor(props: AppProps) {
        super(props);
        this.state = {
            isLoading: true,
            isI18nLoaded: false,
            isOnboardingScreenStep: false,
            isUserActivationResultStep: false,
            isPassCodeAuthAvailable: isWebViewApp(),
            i18n: {},
            user: {},
            users: [],
            deviceInfo: {},
            config: initialConfig,
            appParams: parseUrl(window.location.href).query
        };
        this.appApi = {
            openModal: (props: ModalProps) => this.modalApi?.open(props),
            closeModal: () => this.modalApi?.close(),
            openErrorModal: (error: Error, props?: ModalProps) => {
                return this.modalApi?.openErrorModal(error, {
                    icon: <Icon type="exclamation_solid" scale={2} />,
                    ...props
                });
            },
            goToUserResetLogin: () => this.redirectTo(`${Routes.PASSWORD_LOGIN}?${resetUserUrlEntry}`),
            goToPasswordLogin: () => this.redirectTo(Routes.PASSWORD_LOGIN),
            addUser: this.addUser.bind(this),
            updateCurrentUser: this.updateCurrentUser.bind(this),
            removeUser: this.removeUser.bind(this)
        };
    }

    private onModalApi = (modalApi: ModalApi) => (this.modalApi = modalApi);

    private redirectToNextAuthStepOrApp = () => {
        const {pathname} = this.props.location;
        const {i18n, config, user, appParams, isPassCodeAuthAvailable} = this.state;
        const {passCode, isPassCodeEnabled, redirectUrl, username} = user;

        // [TRADER-833]: we should not automatically redirect user anywhere from the next pages:
        //  – password reset
        //  – password reset confirmation
        if (pathname === Routes.PASSWORD_RESET || pathname === Routes.PASSWORD_RESET_CONFIRMATION) {
            return;
        }

        // We should go to the password login page if the user hasn't entered username yet or
        // user's data wasn't saved to the locale storage correctly
        if (!username) {
            return this.redirectTo(Routes.PASSWORD_LOGIN);
        }

        if (isPassCodeAuthAvailable && isPassCodeEnabled && !passCode) {
            return this.redirectTo(Routes.PASSCODE_LOGIN);
        }

        // we can reset passcode only if user got a redirectURL via username/password login
        if (!redirectUrl) {
            return;
        }

        if (isPassCodeAuthAvailable && !passCode) {
            return this.redirectTo(Routes.PASSCODE_RESET);
        }

        const iexParamsError: AppError | undefined = validateIexParams(appParams as IexParams);

        this.setState({isLoading: true});

        if (!iexParamsError) {
            // confirm IEX auth and redirect to IEX page
            return showIexConfirmationModal({
                i18n,
                config,
                appParams,
                user,
                openModal: this.appApi.openModal,
                showAppLoader: () => this.setState({isLoading: true}),
                hideAppLoader: () => this.setState({isLoading: false})
            });
        }

        return window.location.replace(redirectUrl);
    };

    private redirectTo = (path: string): void => this.props.history.replace(path);

    private updateUserInList(user: User) {
        this.setState((state) => {
            const {username: currentUserName} = user;
            // remove user's old data
            const otherUsers: User[] = state.users.filter(({username}: User) => {
                return username && !matchUserNames(username, currentUserName);
            });

            return {
                // add user to the list
                users: [user, ...otherUsers]
            };
        });
    }

    private addUser() {
        const userWithEmptyData: User = this.state.users.find(({username}: User) => !username) || {};

        this.updateCurrentUser(userWithEmptyData);
    }

    private updateCurrentUser(updatedUser: User, onUpdate?: () => void) {
        this.setState(({deviceInfo, isPassCodeAuthAvailable}) => {
            // rewrite the previous user data with a new one
            const user: User = {
                deviceId: deviceInfo.uuid,
                ...updatedUser
            };

            // property is not set
            if (user.isPassCodeEnabled === undefined) {
                user.isPassCodeEnabled = Boolean(isPassCodeAuthAvailable && user.username);
            }

            return {user};
        }, onUpdate);
    }

    private removeUser({username}: User, options?: UserRemovalOptions) {
        this.setState(
            (state) => ({
                users: state.users.filter((user: User) => !matchUserNames(user.username, username))
            }),
            options?.selectNextUser
                ? () => {
                      const {users, user} = this.state;

                      if (matchUserNames(user.username, username)) {
                          this.updateCurrentUser(users[0]);
                      }
                  }
                : undefined
        );
    }

    private closeNotification = () => this.setState({pageNotificationContent: undefined});

    private openNotification = (content: React.ReactNode | React.ReactNode[]) => {
        this.setState({pageNotificationContent: content});
    };

    private onOnboardingRegistrationStart = () => {
        window.location.replace(getRegistrationUrl(this.state.config, this.state.i18n));
    };

    private onUserActivationResultLoginStart = () => this.setState({isUserActivationResultStep: false});

    private onOnboardingLoginStart = () => this.setState({isOnboardingScreenStep: false});

    private checkRedirectReason = () => {
        const {appParams, i18n} = this.state;
        const {reason, ...restAppParams} = appParams;

        if (reason === RedirectReasons.USER_ACTIVATED) {
            trackAnalytics(TrackerEventTypes.USER_ACTIVATED, {});

            this.setState({
                // onboarding screen should not be shown even if it's a first app visit
                isOnboardingScreenStep: false,
                isUserActivationResultStep: true
            });
            return;
        }

        if (reason === RedirectReasons.US_PERSON) {
            this.appApi.openModal({
                warning: true,
                icon: <Icon type="exclamation_solid" scale={2} />,
                content: <InnerHtml>{localize(i18n, 'warnings.clientResidence.usPerson')}</InnerHtml>,
                actions: [
                    {
                        component: 'button',
                        content: localize(i18n, 'modals.closeTitle')
                    }
                ]
            });
            return;
        }

        if (reason === RedirectReasons.SESSION_EXPIRED) {
            const expiredSessionMessage: string = localize(i18n, 'errors.login.sessionExpired');

            this.setState({appParams: restAppParams});

            if (isWebViewApp() || isTouchDevice()) {
                this.openNotification(expiredSessionMessage);
            } else {
                this.appApi.openModal({
                    warning: true,
                    icon: <Icon type="exclamation_solid" scale={2} />,
                    content: expiredSessionMessage,
                    actions: [
                        {
                            component: 'button',
                            content: localize(i18n, 'modals.closeTitle')
                        }
                    ]
                });
            }
        }
    };

    private async updateCurrentLocale(locale: string | undefined): Promise<void> {
        const {config} = this.state;
        const [language, country] = locale?.split('_') || [];
        const i18n: I18n = await getI18n(config, {
            language,
            country,
            modules: [I18nModules.COMMON, I18nModules.LOGIN]
        });
        const user = {...config, locale};

        trackAnalytics.init(user, user);
        updatePageHelmet(i18n);
        document.documentElement.lang = language || '';

        this.setState(({config, user}) => ({
            isLoading: false,
            i18n,
            // do not trigger unnecessary re-renders and update checks (see didUpdate) if locale didn't change
            config: config.locale === locale ? config : {...config, locale},
            user: user.locale === locale ? user : {...user, locale}
        }));
    }

    componentDidMount() {
        this.setState({isLoading: true});

        const isApp: boolean = isWebViewApp();
        const noop = () => undefined;

        Promise.all<DeviceInfo | void, LocalData | void>([
            // [DEG-3051] Log Native APIs errors only in web-view app
            getDeviceInfo().catch(isApp ? logErrorRemotely : noop),
            getLocalData().catch(isApp ? logErrorRemotely : noop)
        ])
            .then(([originDeviceInfo, localData = {}]) => {
                const {config} = this.state;
                const user: User = localData.user || this.state.user;
                const users: User[] = localData.users || this.state.users;
                const deviceInfo: Partial<DeviceInfo> = {...localData.deviceInfo, ...originDeviceInfo};
                const {amCode, locale: localeParam} = getUrlParams(window.location);
                // nl_NL, en_IE, etc.
                const validLocalePattern: RegExp = /^[a-z]{2}_[a-z]{2}$/i;
                let locale: string | undefined = user.locale || deviceInfo.locale || localeParam;

                // do not use empty string, invalid locale from `localeParam` or locale = 'en' (e.g. from deviceInfo)
                // e.g. request of locale='en' will redirect us to https://www.degiro.nl/404.html
                if (!locale || !validLocalePattern.test(locale)) {
                    locale = undefined;
                }

                // [WF-663]
                // if it's not an app do not send deviceId (uuid) in requests and do not store it in a local data
                // see registerDevice() call in this component
                deviceInfo.uuid = isApp ? user.deviceId || deviceInfo.uuid || createUUID() : undefined;

                this.setState(
                    {
                        deviceInfo,
                        users,
                        config: {...config, locale, amCode},
                        // show onboarding screen on first login only for main page and e.g. not for password reset one
                        // see [TRADER-833]
                        isOnboardingScreenStep:
                            isApp && !user.username && this.props.location.pathname === Routes.PASSWORD_LOGIN
                    },
                    () => this.updateCurrentUser(user)
                );

                return this.updateCurrentLocale(locale);
            })
            .then(this.checkRedirectReason)
            .catch((error: Error) => {
                logErrorLocally(error);
                logErrorRemotely(error);
            });
    }

    componentDidUpdate(_previousProps: Readonly<AppProps>, previousState: Readonly<AppState>): void {
        const {user: currentUser, users, config, deviceInfo, i18n} = this.state;
        const {user: previousUser} = previousState;
        const {locale: currentUserLocale, sessionId} = currentUser;
        const {locale: previousUserLocale} = previousUser;
        const isUserChanged: boolean = currentUser !== previousUser;
        const isUsersListChanged: boolean = users !== previousState.users;
        const isDeviceInfoChanged: boolean = deviceInfo !== previousState.deviceInfo;

        if (i18n !== previousState.i18n) {
            this.setState({
                isI18nLoaded: Object.keys(i18n).length > 0
            });
        }

        if (isUserChanged || isUsersListChanged || isDeviceInfoChanged) {
            setLocalData(currentUser, users, deviceInfo).catch(logErrorLocally);
        }

        if (isUserChanged) {
            this.updateUserInList(currentUser);
        }

        if (currentUserLocale && currentUserLocale !== previousUserLocale && currentUserLocale !== config.locale) {
            this.updateCurrentLocale(currentUserLocale).catch(logErrorLocally);
        }

        if (sessionId && sessionId !== previousUser.sessionId && deviceInfo.uuid) {
            registerDevice(config, currentUser, deviceInfo).catch(logErrorLocally);
        }

        if (isUserChanged) {
            // this handler should be the last in componentDidUpdate, because it can redirect to new browser's page
            this.redirectToNextAuthStepOrApp();
        }
    }

    render() {
        const {location} = this.props;
        const {
            i18n,
            appParams,
            config,
            deviceInfo,
            user,
            users,
            pageNotificationContent,
            isLoading,
            isI18nLoaded,
            isOnboardingScreenStep,
            isUserActivationResultStep,
            isPassCodeAuthAvailable
        } = this.state;
        const limitedServiceWarningI18nKey: string = 'login.warnings.limitedService';

        return (
            <AppApiContext.Provider value={this.appApi}>
                <I18nContext.Provider value={i18n}>
                    <ConfigContext.Provider value={config}>
                        <AppParamsContext.Provider value={appParams}>
                            <DeviceInfoContext.Provider value={deviceInfo}>
                                <UsersContext.Provider value={users}>
                                    <UserContext.Provider value={user}>
                                        <div className={layout}>
                                            {pageNotificationContent && (
                                                <PageNotification
                                                    type={PageNotificationTypes.INFO}
                                                    fadeIn={true}
                                                    content={pageNotificationContent}
                                                    onClose={this.closeNotification}
                                                />
                                            )}
                                            {!isOnboardingScreenStep && (
                                                <Header
                                                    showRegistrationLink={
                                                        isI18nLoaded &&
                                                        location.pathname.indexOf(Routes.PASSWORD_LOGIN) === 0
                                                    }
                                                />
                                            )}
                                            <main className={mainStyle}>
                                                {!isOnboardingScreenStep &&
                                                    hasTranslation(i18n, limitedServiceWarningI18nKey) && (
                                                        <PageNotification
                                                            type={PageNotificationTypes.WARNING}
                                                            content={
                                                                <InnerHtml>
                                                                    {localize(i18n, limitedServiceWarningI18nKey)}
                                                                </InnerHtml>
                                                            }
                                                        />
                                                    )}
                                                {isLoading ? (
                                                    <Spinner local={true} />
                                                ) : (
                                                    isI18nLoaded &&
                                                    (isUserActivationResultStep ? (
                                                        <UserActivationResult
                                                            onLogin={this.onUserActivationResultLoginStart}
                                                        />
                                                    ) : isOnboardingScreenStep ? (
                                                        <Onboarding
                                                            onRegistrationStart={this.onOnboardingRegistrationStart}
                                                            onLoginStart={this.onOnboardingLoginStart}
                                                        />
                                                    ) : (
                                                        <Switch>
                                                            <Route path={Routes.PASSWORD_LOGIN}>
                                                                <PasswordLogin />
                                                            </Route>
                                                            <Route path={Routes.PASSWORD_RESET}>
                                                                <PasswordReset />
                                                            </Route>
                                                            <Route path={Routes.PASSWORD_RESET_CONFIRMATION}>
                                                                <PasswordResetConfirmation />
                                                            </Route>
                                                            {isPassCodeAuthAvailable && (
                                                                <Route path={Routes.PASSCODE_LOGIN}>
                                                                    <PassCodeLogin />
                                                                </Route>
                                                            )}
                                                            {isPassCodeAuthAvailable && (
                                                                <Route path={Routes.PASSCODE_RESET}>
                                                                    <PassCodeReset />
                                                                </Route>
                                                            )}
                                                            {isPassCodeAuthAvailable && (
                                                                <Route path={Routes.USERS}>
                                                                    <Users />
                                                                </Route>
                                                            )}
                                                            <Redirect from="*" to={defaultUrl} />
                                                        </Switch>
                                                    ))
                                                )}
                                                {/* isI18nLoaded && !isOnboardingScreenStep && <Footer /> */}
                                            </main>
                                            <Modal i18n={i18n} onApi={this.onModalApi} />
                                        </div>
                                    </UserContext.Provider>
                                </UsersContext.Provider>
                            </DeviceInfoContext.Provider>
                        </AppParamsContext.Provider>
                    </ConfigContext.Provider>
                </I18nContext.Provider>
            </AppApiContext.Provider>
        );
    }
}
