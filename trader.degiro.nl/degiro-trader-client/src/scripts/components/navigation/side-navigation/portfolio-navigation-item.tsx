import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Routes} from '../../../navigation';
import isPortfolioLinkActive from '../../../services/router/is-portfolio-link-active';
import {I18nContext} from '../../app-component/app-context';
import {activeNavigationItem, navigationItem, navigationItemIcon, navigationItemTitle} from './side-navigation.css';

const {useContext} = React;
const PortfolioNavigationItem: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const isActive: boolean = isPortfolioLinkActive(location);

    return (
        <Link
            to={Routes.PORTFOLIO}
            data-name="portfolioMenuItem"
            data-active={isActive}
            className={`${navigationItem} ${isActive ? activeNavigationItem : ''}`}>
            <Icon
                className={navigationItemIcon}
                type={isActive ? 'account_balance_wallet' : 'account_balance_wallet_outline'}
            />
            <span className={navigationItemTitle}>{localize(i18n, 'trader.navigation.portfolio')}</span>
        </Link>
    );
};

export default React.memo(PortfolioNavigationItem);
