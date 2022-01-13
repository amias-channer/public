import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {ClientAccountEvents} from '../../../event-broker/event-types';
import {EventBrokerContext, I18nContext} from '../../app-component/app-context';
import NavigationItemWithTooltip from './navigation-item-with-tooltip';
import {navigationItem, navigationItemIcon} from './side-navigation.css';

const {useCallback, useContext} = React;
const LogoutNavigationItem: React.FunctionComponent = () => {
    const eventBroker = useContext(EventBrokerContext);
    const i18n = useContext(I18nContext);
    const renderTooltip = useCallback(() => localize(i18n, 'trader.navigation.logOut'), [i18n]);

    return (
        <NavigationItemWithTooltip renderTooltip={renderTooltip}>
            <button
                type="button"
                onClick={() => eventBroker.emit(ClientAccountEvents.LOGOUT)}
                aria-label={localize(i18n, 'trader.navigation.logOut')}
                className={navigationItem}>
                <Icon className={navigationItemIcon} type="exit_to_app" />
            </button>
        </NavigationItemWithTooltip>
    );
};

export default React.memo(LogoutNavigationItem);
