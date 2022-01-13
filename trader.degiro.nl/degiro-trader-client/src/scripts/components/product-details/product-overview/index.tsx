import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {OrderBook} from 'frontend-core/dist/models/order-book';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import useProductOrderBook from '../../../hooks/use-product-order-book';
import {UnifiedStatements} from '../../../models/financial-statement';
import {PricingData, RefinitivCompanyProfile, RefinitivCompanyRatios} from '../../../models/refinitiv-company-profile';
import {ProductSubLinks, Routes} from '../../../navigation';
import getPricingDataFromCompanyRatios from '../../../services/refinitiv-company-ratios/get-pricing-data-from-company-ratios';
import {AppApiContext, ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import Card from '../../card';
import CardHeader from '../../card/header';
import ViewMoreLink from '../../view-more-link';
import getProductDetailsTabsVisibility, {ProductDetailsTabsVisibility} from '../get-product-details-tabs-visibility';
import {LayoutColumnsCount} from '../index';
import {orderBookFooterPlaceholder, pageHeader} from '../product-details.css';
import PositionDetails from './position-details';
import ProductOverviewLayout from './product-overview-layout';
import SecondaryPricingData from './secondary-pricing-data';
import PopupHintButton from '../../popup-button/popup-hint-button';
import getRefinitivCompanyProfile from '../../../services/refinitiv-company-profile/get-refinitiv-company-profile';
import getRefinitivCompanyRatios from '../../../services/refinitiv-company-ratios/get-refinitiv-company-ratios';
import getUnifiedStatements from '../../../services/financial-statement/get-unified-statements';
import getFinancialStatements from '../../../services/financial-statement/get-financial-statements';
import Disclaimer from '../../disclaimer';
import {nbsp, valuesDelimiter} from '../../value';
import DateValue from '../../value/date';
import useGlobalFullLayoutFlag from '../../../hooks/use-global-full-layout-flag';
import {pageHeaderAsCard, pageHeaderTitle} from '../../page/page.css';

const {useMemo} = React;
const EodPricesWarningPanel = createLazyComponent(
    () => import(/* webpackChunkName: "eod-prices-warning-panel" */ '../../eod-prices-warning/panel')
);
const ProductNote = createLazyComponent(() => import(/* webpackChunkName: "product-note" */ '../../product-note'));
const ProductChart = createLazyComponent(() => import(/* webpackChunkName: "product-chart" */ '../../product-chart'));
const ProductNewsCard = createLazyComponent(
    () => import(/* webpackChunkName: "product-news-card" */ './product-news-card')
);
const RefinitivProductPricesInfo = createLazyComponent(
    () => import(/* webpackChunkName: "refinitiv-product-prices-info" */ './refinitiv-product-prices-info')
);
const ProductPriceRange = createLazyComponent(
    () => import(/* webpackChunkName: "product-price-range" */ '../product-price-range')
);
const ProductPricingHelp = createLazyComponent(
    () => import(/* webpackChunkName: "product-pricing-help" */ './product-pricing-help')
);
const ProductKeyFigures = createLazyComponent(
    () => import(/* webpackChunkName: "product-key-figures" */ '../product-key-figures')
);
const ProductKeyFiguresHelp = createLazyComponent(
    () => import(/* webpackChunkName: "product-key-figures-help" */ '../product-key-figures/product-key-figures-help')
);
const ProductAgendaCard = createLazyComponent(
    () => import(/* webpackChunkName: "product-agenda" */ './product-agenda-card/index')
);
const ProductCompanyRatios = createLazyComponent(
    () => import(/* webpackChunkName: "product-company-ratios" */ '../product-company-ratios')
);
const ProductCompanyRatiosHelp = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "product-company-ratios-help" */ '../product-company-ratios/product-company-ratios-help'
        )
);
const ProductCompanyInformation = createLazyComponent(
    () => import(/* webpackChunkName: "product-company-information" */ '../product-company-information')
);
const ProductAnalystViews = createLazyComponent(
    () => import(/* webpackChunkName: "product-analyst-views" */ './product-company-analyst-views')
);
const ProductCompanyFinancials = createLazyComponent(
    () => import(/* webpackChunkName: "product-company-financials" */ '../product-company-financials')
);
const ProductOrderBook = createLazyComponent(
    () => import(/* webpackChunkName: "product-order-book" */ '../../product-order-book/index')
);

interface Props {
    productInfo: ProductInfo;
    layoutColumnsCount: LayoutColumnsCount;
}

const {useContext, useEffect, memo} = React;
const ProductOverview = memo<Props>(({productInfo, layoutColumnsCount}) => {
    const isPointerDevice = !isTouchDevice();
    const i18n = useContext(I18nContext);
    const {openModal} = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const {value: financialStatements, error: financialStatementsError} = useAsyncWithProgressiveState<
        UnifiedStatements | undefined
    >(async () => {
        return productInfo.isin
            ? getUnifiedStatements(await getFinancialStatements(config, {isin: productInfo.isin}))
            : undefined;
    }, [productInfo.isin, config]);
    const {value: companyRatios, error: companyRatiosError} = useAsyncWithProgressiveState<
        RefinitivCompanyRatios | undefined
    >(() => {
        return productInfo.isin
            ? getRefinitivCompanyRatios(config, {isin: productInfo.isin})
            : Promise.resolve(undefined);
    }, [productInfo.isin, config]);
    const {value: companyProfile, error: companyProfileError} = useAsyncWithProgressiveState<
        RefinitivCompanyProfile | undefined
    >(() => {
        return productInfo.isin
            ? getRefinitivCompanyProfile(config, {isin: productInfo.isin})
            : Promise.resolve(undefined);
    }, [productInfo.isin, config]);
    const tabsVisibility = useMemo<Partial<ProductDetailsTabsVisibility>>(
        () => getProductDetailsTabsVisibility(productInfo, currentClient),
        [productInfo, currentClient]
    );
    const orderBook: OrderBook | undefined = useProductOrderBook(productInfo);
    const pricingData = useMemo<PricingData>(
        () => (companyRatios ? getPricingDataFromCompanyRatios(companyRatios) : {}),
        [companyRatios]
    );
    const canShowFullCardsView: boolean = layoutColumnsCount > 1;
    const isStock: boolean = productInfo.productTypeId === ProductTypeIds.STOCK;
    const {currency} = pricingData;
    const companyRatiosLastModified: RefinitivCompanyRatios['lastModified'] | undefined = companyRatios?.lastModified;

    useEffect(() => {
        const error: Error | undefined = companyRatiosError || companyProfileError || financialStatementsError;

        if (error) {
            openModal({error});
        }
    }, [companyRatiosError, companyProfileError, financialStatementsError, openModal]);

    return (
        <>
            <header className={`${pageHeader} ${hasGlobalFullLayout ? '' : pageHeaderAsCard}`}>
                <h1 className={pageHeaderTitle}>{localize(i18n, 'trader.productDetails.tabs.overview')}</h1>
            </header>
            <ProductOverviewLayout
                layoutColumnsCount={layoutColumnsCount}
                warning={productInfo.onlyEodPrices ? <EodPricesWarningPanel /> : undefined}
                productNote={<ProductNote productInfo={productInfo} />}
                chart={
                    <Card>
                        <ProductChart productInfo={productInfo} />
                        {isStock && (
                            <ProductPriceRange
                                productInfo={productInfo}
                                pricingData={pricingData}
                                hasOneColumnLayout={layoutColumnsCount === 1}
                            />
                        )}
                    </Card>
                }
                news={
                    isStock ? (
                        <ProductNewsCard
                            productInfo={productInfo}
                            isFullView={canShowFullCardsView}
                            isin={productInfo.isin}
                        />
                    ) : undefined
                }
                information={
                    isStock ? (
                        <Card
                            data-name="companyInformation"
                            header={
                                <CardHeader title={localize(i18n, 'trader.productDetails.companyInformation.title')} />
                            }
                            footer={
                                tabsVisibility.companyProfile && (
                                    <ViewMoreLink
                                        to={`${Routes.PRODUCTS}/${productInfo.id}/${ProductSubLinks.COMPANY_PROFILE}`}
                                    />
                                )
                            }>
                            <ProductCompanyInformation companyProfile={companyProfile} />
                        </Card>
                    ) : undefined
                }
                companyRatios={
                    isStock ? (
                        <Card
                            data-name="companyRatios"
                            header={
                                <CardHeader
                                    title={
                                        <>
                                            {localize(i18n, 'trader.productDetails.ratios.title')}
                                            {!isPointerDevice && (
                                                <PopupHintButton
                                                    title={localize(i18n, 'trader.productDetails.ratios.title')}>
                                                    <ProductCompanyRatiosHelp />
                                                </PopupHintButton>
                                            )}
                                        </>
                                    }
                                />
                            }
                            footer={
                                <>
                                    <Disclaimer>
                                        {companyRatiosLastModified && (
                                            <>
                                                {localize(i18n, 'trader.productDetails.companyProfile.lastUpdated')}:
                                                {nbsp}
                                                <DateValue
                                                    id="lastUpdated"
                                                    field="lastUpdated"
                                                    value={companyRatiosLastModified}
                                                />
                                                {currency && valuesDelimiter}
                                            </>
                                        )}
                                        {currency &&
                                            localize(i18n, 'trader.productDetails.analystViews.estimations.currency', {
                                                currency
                                            })}
                                    </Disclaimer>
                                    <ViewMoreLink
                                        to={`${Routes.PRODUCTS}/${productInfo.id}/${ProductSubLinks.RATIOS}`}
                                    />
                                </>
                            }>
                            <ProductCompanyRatios
                                productInfo={productInfo}
                                companyProfile={companyProfile}
                                companyRatios={companyRatios}
                                isFullView={canShowFullCardsView}
                            />
                        </Card>
                    ) : undefined
                }
                financials={
                    isStock ? (
                        <ProductCompanyFinancials
                            productInfo={productInfo}
                            financialStatements={financialStatements}
                            isFullView={canShowFullCardsView}
                        />
                    ) : undefined
                }
                analyst={
                    isStock ? (
                        <ProductAnalystViews
                            companyRatios={companyRatios}
                            productInfo={productInfo}
                            isAnalystViewsTabVisible={Boolean(tabsVisibility.analystViews)}
                        />
                    ) : undefined
                }
                pricingData={
                    <Card
                        header={
                            <CardHeader
                                title={
                                    <>
                                        {localize(i18n, 'trader.productDetails.pricingData.title')}
                                        {!isPointerDevice && (
                                            <PopupHintButton
                                                title={localize(i18n, 'trader.productDetails.pricingData.title')}>
                                                <ProductPricingHelp productInfo={productInfo} currency={currency} />
                                            </PopupHintButton>
                                        )}
                                    </>
                                }
                            />
                        }
                        footer={true}>
                        <RefinitivProductPricesInfo productInfo={productInfo} pricingData={pricingData} />
                        <SecondaryPricingData productInfo={productInfo} pricingData={pricingData} />
                        <PositionDetails productInfo={productInfo} />
                    </Card>
                }
                orderBook={
                    orderBook ? (
                        <Card
                            data-name="productOrderBookCard"
                            header={<CardHeader title={localize(i18n, 'trader.ordersBook.title')} />}
                            footer={<div className={orderBookFooterPlaceholder} />}>
                            <ProductOrderBook productInfo={productInfo} orderBook={orderBook} />
                        </Card>
                    ) : undefined
                }
                agenda={isStock ? <ProductAgendaCard productInfo={productInfo} /> : undefined}
                keyFigures={
                    isStock ? (
                        <Card
                            data-name="productKeyFigures"
                            header={
                                <CardHeader
                                    title={
                                        <>
                                            {localize(i18n, 'trader.productDetails.keyFigures.title')}
                                            {!isPointerDevice && (
                                                <PopupHintButton
                                                    title={localize(i18n, 'trader.productDetails.keyFigures.title')}>
                                                    <ProductKeyFiguresHelp />
                                                </PopupHintButton>
                                            )}
                                        </>
                                    }
                                />
                            }
                            footer={
                                !currency || (
                                    <Disclaimer>
                                        {localize(i18n, 'trader.productDetails.analystViews.estimations.currency', {
                                            currency
                                        })}
                                    </Disclaimer>
                                )
                            }>
                            <ProductKeyFigures
                                companyRatios={companyRatios}
                                productInfo={productInfo}
                                isFullView={canShowFullCardsView}
                            />
                        </Card>
                    ) : undefined
                }
            />
        </>
    );
});

ProductOverview.displayName = 'ProductOverview';
export default ProductOverview;
