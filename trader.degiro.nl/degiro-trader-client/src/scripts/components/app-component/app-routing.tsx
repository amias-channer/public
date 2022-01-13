import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import Activity from '../activity';

const Clients = createLazyComponent(() => import(/* webpackChunkName: "clients" */ '../clients'));
const Favourites = createLazyComponent(() => import(/* webpackChunkName: "favourites" */ '../favourites'));
const Inbox = createLazyComponent(() => import(/* webpackChunkName: "inbox" */ '../inbox'));
const Markets = createLazyComponent(() => import(/* webpackChunkName: "markets" */ '../markets'));
const Profile = createLazyComponent(() => import(/* webpackChunkName: "profile" */ '../profile'));
const Portfolio = createLazyComponent(() => import(/* webpackChunkName: "portfolio" */ '../portfolio'));
const ProductDetails = createLazyComponent(
    () => import(/* webpackChunkName: "product-details" */ '../product-details')
);
const Products = createLazyComponent(() => import(/* webpackChunkName: "products" */ '../products'));
const Settings = createLazyComponent(() => import(/* webpackChunkName: "settings" */ '../settings'));
const QuickSearchPage = createLazyComponent(
    () => import(/* webpackChunkName: "quick-search-page" */ '../quick-search/page')
);
const HelpNavigationPage = createLazyComponent(
    () => import(/* webpackChunkName: "help-navigation-page" */ '../helpcenter/help-navigation-page')
);
const AppRouting: React.FunctionComponent = () => {
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();

    return (
        <Switch>
            <Route key="markets" path={Routes.MARKETS} component={Markets} />
            <Route key="products" path={Routes.PRODUCTS} exact={true} component={Products} />
            <Route key="productDetails" path={`${Routes.PRODUCTS}/:productId`} component={ProductDetails} />
            <Route key="favouriteProducts" path={`${Routes.FAVOURITE_PRODUCTS}/:listId?`} component={Favourites} />
            <Route key="clients" path={Routes.CLIENTS} component={Clients} />
            <Route key="profile" path={Routes.PROFILE} component={Profile} />
            <Route key="settings" path={Routes.SETTINGS} component={Settings} />
            <Route key="portfolio" path={`${Routes.PORTFOLIO}/:type?`} component={Portfolio} />
            <Route key="inbox" path={`${Routes.INBOX}/:messageId?`} component={Inbox} />
            <Route
                path={[
                    Routes.TRANSACTIONS,
                    Routes.OPEN_ORDERS,
                    Routes.ORDERS_HISTORY,
                    Routes.ACCOUNT_OVERVIEW,
                    Routes.REPORTS,
                    Routes.PORTFOLIO_DEPRECIATION
                ]}
                component={Activity}
            />
            {!hasGlobalFullLayout && <Route key="quickSearch" path={Routes.QUICK_SEARCH} component={QuickSearchPage} />}
            {!hasGlobalFullLayout && <Route key="help" path={Routes.HELP} component={HelpNavigationPage} />}
            <Redirect from="*" to={Routes.DEFAULT} />
        </Switch>
    );
};

export default React.memo(AppRouting);
