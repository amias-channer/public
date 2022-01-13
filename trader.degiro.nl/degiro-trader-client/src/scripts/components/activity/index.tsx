import * as React from 'react';
import {Route} from 'react-router-dom';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {Switch} from 'react-router';
import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import AccountActivityNavigation from '../account-activity-navigation';
import PageWrapper from '../page/page-wrapper';
import Page from '../page';

const Reports = createLazyComponent(() => import(/* webpackChunkName: "reports" */ '../reports'));
const Transactions = createLazyComponent(() => import(/* webpackChunkName: "transactions" */ '../transactions'));
const OpenOrders = createLazyComponent(() => import(/* webpackChunkName: "open-orders" */ '../orders/open-orders'));
const OrdersHistory = createLazyComponent(
    () => import(/* webpackChunkName: "orders-history" */ '../orders/orders-history')
);
const AccountOverview = createLazyComponent(
    () => import(/* webpackChunkName: "account-overview" */ '../account-overview')
);
const PortfolioDepreciation = createLazyComponent(
    () => import(/* webpackChunkName: "portfolio-depreciation" */ '../portfolio-depreciation')
);
const {memo} = React;
const Activity = memo(() => (
    <PageWrapper>
        <AccountActivityNavigation />
        <Page>
            <Switch>
                <Route key="transactions" path={Routes.TRANSACTIONS} component={Transactions} />
                <Route key="openOrders" path={Routes.OPEN_ORDERS} component={OpenOrders} />
                <Route key="ordersHistory" path={Routes.ORDERS_HISTORY} component={OrdersHistory} />
                <Route key="reports" path={Routes.REPORTS} component={Reports} />
                <Route key="accountOverview" path={Routes.ACCOUNT_OVERVIEW} component={AccountOverview} />
                <Route
                    key="portfolioDepreciation"
                    path={Routes.PORTFOLIO_DEPRECIATION}
                    component={PortfolioDepreciation}
                />
            </Switch>
        </Page>
    </PageWrapper>
));

Activity.displayName = 'Activity';
export default Activity;
