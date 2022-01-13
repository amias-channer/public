import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import getProductInfo from 'frontend-core/dist/services/products/product/get-product-info';
import * as React from 'react';
import {Redirect, Route, RouteComponentProps, Switch, useHistory, useParams, useRouteMatch} from 'react-router-dom';
import useAsync from 'frontend-core/dist/hooks/use-async';
import useColumnsLayout, {ColumnsList} from '../../hooks/use-columns-layout';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import {StatementTypes} from '../../models/financial-statement';
import {OwnershipSubTabs} from '../../models/ownership';
import {ProductSubLinks} from '../../navigation';
import {AppApiContext, ConfigContext, CurrentClientContext} from '../app-component/app-context';
import getAppTopScrollableElement from '../app-component/get-app-top-scrollable-element';
import HeaderNavigationButton from '../header/compact-header/header-navigation-button';
import Alerts from '../inbox/alerts/index';
import Page from '../page';
import PageWrapper from '../page/page-wrapper';
import OpenedTasksAlert from '../profile/online-forms/opened-tasks-alert/index';
import Spinner from '../progress-bar/spinner';
import Navigation from './navigation';
import ProductDetailsHeaderLayout from './product-details-header/product-details-header-layout';
import ProductDetailsHeader from './product-details-header/index';
import {compactLayout, fullLayout, page, pageWithoutTopGap} from './product-details.css';
import ProductDocumentTitle from './product-document-title';

const ProductCompanyProfile = createLazyComponent(
    () => import(/* webpackChunkName: "product-company-profile" */ './product-company-profile')
);
const ProductDocuments = createLazyComponent(
    () => import(/* webpackChunkName: "product-documents" */ './product-documents')
);
const ProductLeverageds = createLazyComponent(
    () => import(/* webpackChunkName: "product-leverageds" */ './product-leverageds')
);
const ProductOptions = createLazyComponent(() => import(/* webpackChunkName: "product-options" */ './product-options'));
const ProductOverview = createLazyComponent(
    () => import(/* webpackChunkName: "product-overview" */ './product-overview')
);
const NewsArticleCard = createLazyComponent(
    () => import(/* webpackChunkName: "markets-news-article-card" */ '../markets/news/news-article-card')
);
const ProductRatios = createLazyComponent(() => import(/* webpackChunkName: "product-ratios" */ './product-ratios'));
const ProductFinancials = createLazyComponent(
    () => import(/* webpackChunkName: "product-financials" */ './product-financials')
);
const ProductOwnership = createLazyComponent(
    () => import(/* webpackChunkName: "product-ownership" */ './product-ownership')
);
const ProductCompanyEsgRatings = createLazyComponent(
    () => import(/* webpackChunkName: "product-company-esg-ratings" */ './product-company-esg-ratings')
);
const ProductAnalystViews = createLazyComponent(
    () => import(/* webpackChunkName: "product-analyst-views" */ './product-analyst-views')
);

export type LayoutColumnsCount = 1 | 2 | 3;

const columns: ColumnsList<LayoutColumnsCount> = [
    [1, {maxWidth: 735}],
    [2, {maxWidth: 1160}],
    [3, {maxWidth: Infinity}]
];
const {useEffect, useLayoutEffect, useRef, useContext, memo} = React;
const ProductDetails = memo(() => {
    const {openModal} = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const {path, url} = useRouteMatch();
    const {productId: productIdFromUrl} = useParams<{productId: string}>();
    const history = useHistory();
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const {isLoading: isProductInfoLoading, value: productInfo, error: productInfoError} = useAsync(
        () => getProductInfo(config, currentClient, {id: productIdFromUrl}),
        [productIdFromUrl, config, currentClient]
    );
    const productDetailsContentRef = useRef<HTMLDivElement | null>(null);
    const layoutColumnsCount: LayoutColumnsCount =
        useColumnsLayout<LayoutColumnsCount>(productDetailsContentRef, columns) || 1;

    useLayoutEffect(() => {
        getAppTopScrollableElement().scrollTop = 0;
    }, [history.location.pathname]);

    useEffect(() => {
        const error = productInfoError;

        if (error) {
            return openModal({error});
        }
    }, [productInfoError, openModal]);

    if (!productInfo || isProductInfoLoading) {
        return (
            <div data-name="productDetails" ref={productDetailsContentRef}>
                <HeaderNavigationButton onClick={history.goBack} />
                <Spinner />
            </div>
        );
    }

    return (
        <PageWrapper data-name="productDetails">
            <HeaderNavigationButton onClick={history.goBack} />
            <ProductDocumentTitle productInfo={productInfo} />
            <OpenedTasksAlert />
            <Alerts />
            <Switch>
                <Route path={`${path}/${ProductSubLinks.NEWS}/:id`} key="productNews">
                    <NewsArticleCard />
                </Route>
                <Route>
                    <div className={hasGlobalFullLayout ? fullLayout : compactLayout} ref={productDetailsContentRef}>
                        <ProductDetailsHeaderLayout
                            header={
                                <ProductDetailsHeader productInfo={productInfo} hasCompactView={false}>
                                    <Navigation productInfo={productInfo} />
                                </ProductDetailsHeader>
                            }
                            stickyHeader={
                                <ProductDetailsHeader productInfo={productInfo} hasCompactView={true}>
                                    <Navigation productInfo={productInfo} />
                                </ProductDetailsHeader>
                            }
                            dockable={hasGlobalFullLayout}
                        />
                        <Page className={`${page} ${hasGlobalFullLayout ? '' : pageWithoutTopGap}`}>
                            <Switch>
                                <Route key="productOverview" path={`${path}/${ProductSubLinks.OVERVIEW}`}>
                                    <ProductOverview
                                        productInfo={productInfo}
                                        layoutColumnsCount={layoutColumnsCount}
                                    />
                                </Route>
                                <Route key="productCompanyProfile" path={`${path}/${ProductSubLinks.COMPANY_PROFILE}`}>
                                    <ProductCompanyProfile
                                        productInfo={productInfo}
                                        layoutColumnsCount={layoutColumnsCount}
                                    />
                                </Route>
                                <Route key="productRatios" path={`${path}/${ProductSubLinks.RATIOS}`}>
                                    <ProductRatios productInfo={productInfo} layoutColumnsCount={layoutColumnsCount} />
                                </Route>
                                <Route
                                    key="productCompanyOwnership"
                                    path={`${path}/${ProductSubLinks.OWNERSHIP}/:ownershipSubTabId?`}>
                                    {({match}: RouteComponentProps<{ownershipSubTabId: OwnershipSubTabs}>) => {
                                        const {ownershipSubTabId = OwnershipSubTabs.TOP_SHAREHOLDERS} = match.params;

                                        return (
                                            <ProductOwnership
                                                ownershipSubTabId={ownershipSubTabId}
                                                productInfo={productInfo}
                                                layoutColumnsCount={layoutColumnsCount}
                                            />
                                        );
                                    }}
                                </Route>
                                <Route
                                    path={`${path}/${ProductSubLinks.FINANCIALS}/:statementsTypeId?`}
                                    key="productFinancials">
                                    {({match}: RouteComponentProps<{statementsTypeId: StatementTypes}>) => {
                                        const {statementsTypeId = StatementTypes.INCOME} = match.params;

                                        return (
                                            <ProductFinancials
                                                statementTypeId={statementsTypeId}
                                                productInfo={productInfo}
                                                layoutColumnsCount={layoutColumnsCount}
                                            />
                                        );
                                    }}
                                </Route>
                                <Route key="productCompanyEsgRatings" path={`${path}/${ProductSubLinks.ESG_RATINGS}`}>
                                    <ProductCompanyEsgRatings
                                        layoutColumnsCount={layoutColumnsCount}
                                        productInfo={productInfo}
                                    />
                                </Route>
                                <Route key="productAnalystViews" path={`${path}/${ProductSubLinks.ANALYST_VIEWS}`}>
                                    <ProductAnalystViews
                                        productInfo={productInfo}
                                        layoutColumnsCount={layoutColumnsCount}
                                    />
                                </Route>
                                <Route key="productDocuments" path={`${path}/${ProductSubLinks.DOCUMENTS}`}>
                                    <ProductDocuments productInfo={productInfo} />
                                </Route>
                                <Route key="productOptions" path={`${path}/${ProductSubLinks.OPTIONS}`}>
                                    <ProductOptions underlyingProduct={productInfo} />
                                </Route>
                                <Route key="productLeverageds" path={`${path}/${ProductSubLinks.LEVERAGED_PRODUCTS}`}>
                                    <ProductLeverageds underlyingProduct={productInfo} />
                                </Route>
                                <Redirect from="*" to={`${url}/${ProductSubLinks.OVERVIEW}`} />
                            </Switch>
                        </Page>
                    </div>
                </Route>
            </Switch>
        </PageWrapper>
    );
});

ProductDetails.displayName = 'ProductDetails';
export default ProductDetails;
