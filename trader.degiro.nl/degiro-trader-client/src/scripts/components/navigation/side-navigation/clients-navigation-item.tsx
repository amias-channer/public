import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Routes} from '../../../navigation';
import isClientsLinkActive from '../../../services/router/is-clients-link-active';
import {I18nContext} from '../../app-component/app-context';
import {activeNavigationItem, navigationItem, navigationItemIcon, navigationItemTitle} from './side-navigation.css';

const {useContext} = React;
const ClientsNavigationItem: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const isActive: boolean = isClientsLinkActive(location);

    return (
        <Link
            to={Routes.CLIENTS}
            data-name="clientsMenuItem"
            data-active={isActive}
            className={`${navigationItem} ${isActive ? activeNavigationItem : ''}`}>
            <Icon className={navigationItemIcon} type={isActive ? 'clients' : 'clients_outline'} />
            <span className={navigationItemTitle}>{localize(i18n, 'trader.navigation.clients')}</span>
        </Link>
    );
};

export default React.memo(ClientsNavigationItem);
