import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Routes} from '../../../navigation';
import isFavouriteProductsLinkActive from '../../../services/router/is-favourite-products-link-active';
import {I18nContext} from '../../app-component/app-context';
import {activeNavigationItem, navigationItem, navigationItemIcon, navigationItemTitle} from './side-navigation.css';

const {useContext} = React;
const FavouriteProductsNavigationItem: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const isActive: boolean = isFavouriteProductsLinkActive(location);

    return (
        <Link
            to={Routes.FAVOURITE_PRODUCTS}
            data-name="favouriteProductsMenuItem"
            data-active={isActive}
            className={`${navigationItem} ${isActive ? activeNavigationItem : ''}`}>
            <Icon className={navigationItemIcon} type={isActive ? 'star' : 'star_outline'} />
            <span className={navigationItemTitle}>{localize(i18n, 'trader.navigation.favourites')}</span>
        </Link>
    );
};

export default React.memo(FavouriteProductsNavigationItem);
