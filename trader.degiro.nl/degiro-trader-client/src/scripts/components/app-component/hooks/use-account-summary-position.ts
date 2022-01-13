import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AccountSummaryPositions, AppSettingsGroup} from 'frontend-core/dist/models/app-settings';
import getAppSettingsGroup from 'frontend-core/dist/services/app-settings/get-app-settings-group';
import setAppSettingsGroup from 'frontend-core/dist/services/app-settings/set-app-settings-group';
import {useContext, useEffect, useMemo, useReducer} from 'react';
import useGlobalFullLayoutFlag from '../../../hooks/use-global-full-layout-flag';
import {ConfigContext, EventBrokerContext, MainClientContext} from '../app-context';
import {AccountSummaryEvents} from '../../../event-broker/event-types';

let accountSummarySettings: Pick<AppSettingsGroup, 'accountSummaryPosition'> = {};

// For test only
export const clearAccountSummarySettings = () => {
    accountSummarySettings = {};
};

export default function useAccountSummaryPosition(): [
    AccountSummaryPositions,
    (accountSummaryPosition: AccountSummaryPositions) => void
] {
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const eventBroker = useContext(EventBrokerContext);
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const [updates, forceUpdate] = useReducer((x) => x + 1, 0);
    // do not switch position in compact mode
    const accountSummaryPosition = useMemo<AccountSummaryPositions>(
        () => (hasGlobalFullLayout && accountSummarySettings.accountSummaryPosition) || AccountSummaryPositions.TOP,
        [hasGlobalFullLayout, updates]
    );

    useEffect(() => {
        accountSummarySettings = getAppSettingsGroup(mainClient);
        eventBroker.emit(AccountSummaryEvents.CHANGE_POSITION);
    }, [mainClient?.id]);

    useEffect(() => eventBroker.on(AccountSummaryEvents.CHANGE_POSITION, forceUpdate), []);

    return useMemo(
        () => [
            accountSummaryPosition,
            (accountSummaryPosition: AccountSummaryPositions) => {
                accountSummarySettings = {
                    ...accountSummarySettings,
                    accountSummaryPosition
                };

                setAppSettingsGroup(config, mainClient, {accountSummaryPosition}).catch(logErrorLocally);
                eventBroker.emit(AccountSummaryEvents.CHANGE_POSITION);
            }
        ],
        [accountSummaryPosition, config, mainClient?.id]
    );
}
