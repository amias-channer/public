import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import isUserInEarlyAdoptersProgram from 'frontend-core/dist/services/app-version-settings/is-user-in-early-adopters-program';
import setAppVersionSettings from 'frontend-core/dist/services/app-version-settings/set-app-version-settings';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppApiContext, ConfigContext, I18nContext, MainClientContext} from '../app-component/app-context';
import Checkbox from '../checkbox';
import {ModalSizes} from '../modal';
import {AppVersionToggleProps, AppVersionSettingsItem} from './index';
import goToOldVersionIconUrl from '../../../images/svg/go-to-old-version.svg';
import {confirmationDescription} from './app-version-toggle.css';

const {useState, useContext, useMemo} = React;
const SwitchToLatestAppVersion: React.FunctionComponent<AppVersionToggleProps> = ({children, className}) => {
    const app = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const i18n = useContext(I18nContext);
    const [isUnsubscribeProcessing, setUnsubscribeProcessing] = useState<boolean>(false);
    const redirectToLatestAppVersion = () => {
        const {appLatestVersionPath} = config;

        if (appLatestVersionPath) {
            location.replace(appLatestVersionPath);
        }
    };
    const unsubscribeFromEarlyAdoptersProgramPrompt = () => {
        if (isUnsubscribeProcessing) {
            return;
        }

        let isUserInEarlyAdoptersProgram: boolean = true;
        const onConfirm = () => {
            setUnsubscribeProcessing(true);

            setAppVersionSettings(config, {
                isUserInEarlyAdoptersProgram,
                isUserOnAppNextVersion: !isUserInEarlyAdoptersProgram
            })
                .then(redirectToLatestAppVersion)
                .catch((error: Error) => {
                    setUnsubscribeProcessing(false);
                    logErrorLocally(error);
                });
        };
        const toggleEarlyAdoptersProgram = () => (isUserInEarlyAdoptersProgram = !isUserInEarlyAdoptersProgram);

        app.openModal({
            size: ModalSizes.MEDIUM,
            title: localize(i18n, 'trader.appVersionSettings.unsubscribeFromEarlyAdoptersProgram.prompt.title'),
            content: (
                <>
                    <InnerHtml className={confirmationDescription}>
                        {localize(
                            i18n,
                            'trader.appVersionSettings.unsubscribeFromEarlyAdoptersProgram.prompt.description'
                        )}
                    </InnerHtml>
                    <Checkbox
                        checked={isUserInEarlyAdoptersProgram}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={toggleEarlyAdoptersProgram}
                        label={localize(
                            i18n,
                            'trader.appVersionSettings.unsubscribeFromEarlyAdoptersProgram.prompt.keepSubscription'
                        )}
                    />
                </>
            ),
            onConfirm
        });
    };
    const handleSwitchToLatest = () => {
        if (isUserInEarlyAdoptersProgram(mainClient)) {
            unsubscribeFromEarlyAdoptersProgramPrompt();
        } else {
            redirectToLatestAppVersion();
        }
    };
    const appVersionSettingsItem: AppVersionSettingsItem = useMemo(
        () => ({
            label: localize(i18n, 'trader.appVersionSettings.switchToLatest.actionTitle'),
            iconUrl: goToOldVersionIconUrl,
            description: localize(i18n, 'trader.appVersionSettings.switchToLatest.actionDescription')
        }),
        [i18n]
    );
    const {label} = appVersionSettingsItem;

    return (
        <button
            type="button"
            data-name="switchToLatestAppVersion"
            onClick={handleSwitchToLatest}
            title={label}
            className={className}>
            {children?.(appVersionSettingsItem) ?? label}
        </button>
    );
};

export default React.memo(SwitchToLatestAppVersion);
