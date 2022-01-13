import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {ConfigContext, I18nContext} from '../app-component/app-context';
import {AppVersionToggleProps, AppVersionSettingsItem} from './index';
import goToNewVersionIconUrl from '../../../images/svg/go-to-new-version.svg';

const {useCallback, useContext, useMemo} = React;
const SwitchToNextAppVersion: React.FunctionComponent<AppVersionToggleProps> = ({children, className}) => {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const redirectToNextAppVersion = useCallback(() => {
        const {appNextVersionPath} = config;

        if (appNextVersionPath) {
            location.replace(appNextVersionPath);
        }
    }, [config.appNextVersionPath]);
    const appVersionSettingsItem: AppVersionSettingsItem = useMemo(
        () => ({
            label: localize(i18n, 'trader.appVersionSettings.switchToNext.actionTitle'),
            iconUrl: goToNewVersionIconUrl,
            description: localize(i18n, 'trader.appVersionSettings.switchToNext.actionDescription')
        }),
        [i18n]
    );
    const {label} = appVersionSettingsItem;

    return (
        <button
            type="button"
            data-name="switchToNextAppVersion"
            onClick={redirectToNextAppVersion}
            title={label}
            className={className}>
            {children?.(appVersionSettingsItem) ?? label}
        </button>
    );
};

export default React.memo(SwitchToNextAppVersion);
