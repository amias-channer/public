import * as React from 'react';
import {useRouteMatch} from 'react-router-dom';
import {AccountSummaryPositions} from 'frontend-core/dist/models/app-settings';
import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {cardsBackground, layout, mainContent, mainContentWrapper, workspace} from './app-component.css';
import {ProductSubLinks, Routes} from '../../navigation';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import {appWorkspaceElementId} from './get-app-workspace';
import {appTopScrollableElementId} from './get-app-top-scrollable-element';
import useAccountSummaryPosition from './hooks/use-account-summary-position';

const AccountSummary = createLazyComponent(
    () => import(/* webpackChunkName: "account-summary" */ '../account-summary/index')
);

type Props = React.PropsWithChildren<{
    miscellaneous: React.ReactNode;
    navigation: React.ReactNode;
    bottomNavigation: React.ReactNode;
    header: React.ReactNode;

    sidebarPanel: React.ReactNode;
    modal: React.ReactNode;
}>;

const {memo} = React;
const AppLayout = memo<Props>(
    ({children, navigation, header, bottomNavigation, sidebarPanel, miscellaneous, modal}) => {
        const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
        const profileRouteMatch = useRouteMatch(Routes.PROFILE);
        // [TRADER-1771] TODO: remove after design are ready for the next pages
        const hasCardsBackground: boolean = [
            hasGlobalFullLayout ? profileRouteMatch : null,
            useRouteMatch(Routes.MARKETS),
            useRouteMatch(Routes.MARKETS_NEWS),
            useRouteMatch(Routes.PRODUCT_GOVERNANCE_SETTINGS),
            useRouteMatch(`${Routes.PRODUCTS}/:productId/${ProductSubLinks.OVERVIEW}`),
            useRouteMatch(`${Routes.PRODUCTS}/:productId/${ProductSubLinks.ANALYST_VIEWS}`),
            useRouteMatch(`${Routes.PRODUCTS}/:productId/${ProductSubLinks.COMPANY_PROFILE}`),
            useRouteMatch(`${Routes.PRODUCTS}/:productId/${ProductSubLinks.FINANCIALS}/:statementsTypeId?`),
            useRouteMatch(`${Routes.PRODUCTS}/:productId/${ProductSubLinks.RATIOS}`),
            useRouteMatch(`${Routes.PRODUCTS}/:productId/${ProductSubLinks.ESG_RATINGS}`),
            useRouteMatch(`${Routes.PRODUCTS}/:productId/${ProductSubLinks.OWNERSHIP}/:ownershipSubTabId?`),
            useRouteMatch(`${Routes.PRODUCTS}/:productId/${ProductSubLinks.DOCUMENTS}`),
            useRouteMatch(`${Routes.MARKETS_NEWS}/:subCategoryId?/:id?`)
        ].some((match) => match?.isExact);
        const [accountSummaryPosition] = useAccountSummaryPosition();

        return (
            <div className={`${layout} ${hasCardsBackground ? cardsBackground : ''}`}>
                {navigation}
                <div className={workspace} id={appWorkspaceElementId}>
                    {header}
                    <div className={mainContentWrapper}>
                        {accountSummaryPosition === AccountSummaryPositions.TOP && !hasGlobalFullLayout && (
                            <AccountSummary />
                        )}
                        {sidebarPanel}
                        <main className={mainContent} id={appTopScrollableElementId}>
                            {accountSummaryPosition === AccountSummaryPositions.TOP && hasGlobalFullLayout && (
                                <AccountSummary />
                            )}
                            {children}
                        </main>
                        {accountSummaryPosition === AccountSummaryPositions.BOTTOM && <AccountSummary />}
                        {bottomNavigation}
                    </div>
                </div>
                {modal}
                {miscellaneous}
            </div>
        );
    }
);

AppLayout.displayName = 'AppLayout';
export default AppLayout;
