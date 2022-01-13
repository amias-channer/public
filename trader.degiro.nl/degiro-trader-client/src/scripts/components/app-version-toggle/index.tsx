import isUserOnNextAppVersion from 'frontend-core/dist/services/app-version-settings/is-user-on-next-app-version';
import * as React from 'react';
import {ConfigContext} from '../app-component/app-context';
import SwitchToLatestAppVersion from './switch-to-latest-app-version';
import SwitchToNextAppVersion from './switch-to-next-app-version';

export interface AppVersionSettingsItem {
    description: string;
    iconUrl: string;
    label: string;
}

export interface AppVersionToggleProps {
    children?: (appVersionSettingsItem: AppVersionSettingsItem) => React.ReactNode;
    className?: string;
}

const {useContext} = React;
const AppVersionToggle: React.FunctionComponent<AppVersionToggleProps> = (props) => {
    const config = useContext(ConfigContext);

    return isUserOnNextAppVersion(config) ? (
        <SwitchToLatestAppVersion {...props} />
    ) : (
        <SwitchToNextAppVersion {...props} />
    );
};

export default React.memo(AppVersionToggle);
