import * as React from 'react';
import {Link} from 'react-router-dom';
import appLogoPath from '../../../../images/svg/app-icon.svg';
import {Routes} from '../../../navigation';
import {CurrentClientContext, MainClientContext} from '../../app-component/app-context';
import AccountActivityNavigationItem from './account-activity-navigation-item';
import ClientsNavigationItem from './clients-navigation-item';
import FavouriteProductsNavigationItem from './favourite-products-navigation-item';
import InboxNavigationItem from './inbox-navigation-item';
import LogoutNavigationItem from './logout-navigation-item';
import MarketsNavigationItem from './markets-navigation-item';
import PortfolioNavigationItem from './portfolio-navigation-item';
import ProductsNavigationItem from './products-navigation-item';
import ProfileMenu from './profile-menu';
import SettingsMenu from './settings-menu';
import {appLogoLayout, navigation, secondaryNavigationItemsList} from './side-navigation.css';

const {useContext, memo} = React;
const SideNavigation = memo(() => {
    const currentClient = useContext(CurrentClientContext);
    const mainClient = useContext(MainClientContext);

    return (
        <aside data-name="sideNavigation" className={navigation}>
            <Link to={Routes.DEFAULT} tabIndex={-1} className={appLogoLayout}>
                <img src={appLogoPath} width={32} height={20} alt={appName.toUpperCase()} />
            </Link>
            <nav aria-label="primary">
                <MarketsNavigationItem />
                <FavouriteProductsNavigationItem />
                <PortfolioNavigationItem />
                <AccountActivityNavigationItem />
                {currentClient.canViewPricesPage && <ProductsNavigationItem />}
                {mainClient.isAssetManager && <ClientsNavigationItem />}
            </nav>
            <nav className={secondaryNavigationItemsList} aria-label="secondary">
                <ProfileMenu />
                <InboxNavigationItem />
                <SettingsMenu />
                <LogoutNavigationItem />
            </nav>
        </aside>
    );
});

SideNavigation.displayName = 'SideNavigation';
export default SideNavigation;
