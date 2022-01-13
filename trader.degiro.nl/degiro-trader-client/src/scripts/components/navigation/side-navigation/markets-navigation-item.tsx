import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Routes} from '../../../navigation';
import isMarketsLinkActive from '../../../services/router/is-markets-link-active';
import {I18nContext} from '../../app-component/app-context';
import {activeNavigationItem, navigationItem, navigationItemIcon, navigationItemTitle} from './side-navigation.css';

const {useContext} = React;
const MarketsNavigationItem: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const isActive: boolean = isMarketsLinkActive(location);

    return (
        <Link
            to={Routes.MARKETS}
            data-name="marketsMenuItem"
            data-active={isActive}
            className={`${navigationItem} ${isActive ? activeNavigationItem : ''}`}>
            <Icon className={navigationItemIcon} type={isActive ? 'show_chart' : 'show_chart_outline'} />
            <span className={navigationItemTitle}>{localize(i18n, 'trader.navigation.markets')}</span>
        </Link>
    );
};

export default React.memo(MarketsNavigationItem);
