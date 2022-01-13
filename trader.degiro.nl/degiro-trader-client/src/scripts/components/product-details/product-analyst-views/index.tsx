import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {AppApiContext, ConfigContext, I18nContext} from '../../app-component/app-context';
import {LayoutColumnsCount} from '../index';
import BuySellSurvey from './buy-sell-survey';
import KeyProjections from './key-projections';
import {UnifiedEstimates, KeyFigures} from '../../../models/analyst-views';
import {RefinitivCompanyRatios} from '../../../models/refinitiv-company-profile';
import {UnifiedStatements} from '../../../models/financial-statement';
import {pageHeader, pageHeaderTitle, pageHeaderAsCard} from '../../page/page.css';
import getKeyFiguresFromCompanyRatiosAndFinancialStatements from '../../../services/product-analyst-views/get-key-figures-from-company-ratios-and-financial-statements';
import areCompanyRatiosUpToDate from '../../../services/product-analyst-views/are-company-ratios-up-to-date';
import Estimations from './estimations';
import hasSomeKeyFigures from './has-some-key-figures';
import ProductAnalystViewsLayout from './product-analyst-views-layout';
import NoDataMessage from '../no-data-message';
import getRefinitivCompanyRatios from '../../../services/refinitiv-company-ratios/get-refinitiv-company-ratios';
import getUnifiedStatements from '../../../services/financial-statement/get-unified-statements';
import getFinancialStatements from '../../../services/financial-statement/get-financial-statements';
import getUnifiedProductEstimates from '../../../services/product-analyst-views/get-unified-product-estimates';
import getProductEstimates from '../../../services/product-analyst-views/get-product-estimates';
import Spinner from '../../progress-bar/spinner';
import Disclaimer from '../../disclaimer';
import ExternalHtmlContent from '../../external-html-content';
import useGlobalFullLayoutFlag from '../../../hooks/use-global-full-layout-flag';

interface Props {
    productInfo: ProductInfo;
    layoutColumnsCount: LayoutColumnsCount;
}

const {useContext, useMemo, useEffect, memo} = React;
const ProductAnalystViews = memo<Props>(({layoutColumnsCount, productInfo}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const {openModal} = useContext(AppApiContext);
    const {
        value: productEstimates,
        error: productEstimatesError,
        isLoading: areProductEstimatesLoading
    } = useAsyncWithProgressiveState<UnifiedEstimates | undefined>(async () => {
        return productInfo.isin
            ? getUnifiedProductEstimates(await getProductEstimates(config, {isin: productInfo.isin}))
            : undefined;
    }, [productInfo.isin, config]);
    const {
        value: companyRatios,
        error: companyRatiosError,
        isLoading: areCompanyRatiosLoading
    } = useAsyncWithProgressiveState<RefinitivCompanyRatios | undefined>(() => {
        return productInfo.isin
            ? getRefinitivCompanyRatios(config, {isin: productInfo.isin})
            : Promise.resolve(undefined);
    }, [productInfo.isin, config]);
    const {
        value: financialStatements,
        error: financialStatementsError,
        isLoading: areFinancialStatementsLoading
    } = useAsyncWithProgressiveState<UnifiedStatements | undefined>(async () => {
        return productInfo.isin
            ? getUnifiedStatements(await getFinancialStatements(config, {isin: productInfo.isin}))
            : undefined;
    }, [productInfo.isin, config]);
    const pageTitle: string = localize(i18n, 'trader.productDetails.analystViews.title');
    const hasOneColumnLayout: boolean = layoutColumnsCount === 1;
    const hasThreeColumnsLayout: boolean = layoutColumnsCount === 3;
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const pageHeaderClassName: string = `${pageHeader} ${hasGlobalFullLayout ? '' : pageHeaderAsCard}`;
    const keyFigures = useMemo<KeyFigures>(() => {
        return companyRatios && financialStatements
            ? getKeyFiguresFromCompanyRatiosAndFinancialStatements(companyRatios, financialStatements)
            : {};
    }, [companyRatios, financialStatements]);

    useEffect(() => {
        const error = productEstimatesError || companyRatiosError || financialStatementsError;

        if (error) {
            return openModal({error});
        }
    }, [productEstimatesError, companyRatiosError, financialStatementsError, openModal]);

    useDocumentTitle(pageTitle);

    if (areProductEstimatesLoading || areCompanyRatiosLoading || areFinancialStatementsLoading) {
        return <Spinner />;
    }

    if (
        !productEstimates &&
        !companyRatios?.consRecommendationTrend?.opinions &&
        (!hasSomeKeyFigures(keyFigures) || !areCompanyRatiosUpToDate(companyRatios))
    ) {
        return <NoDataMessage hasCompactLayout={!hasThreeColumnsLayout} />;
    }

    return (
        <div>
            <header className={pageHeaderClassName}>
                <h1 className={pageHeaderTitle}>{pageTitle}</h1>
            </header>
            <ProductAnalystViewsLayout
                layoutColumnsCount={layoutColumnsCount}
                keyProjections={
                    <KeyProjections
                        companyRatios={companyRatios}
                        keyFigures={keyFigures}
                        isCompactView={hasOneColumnLayout}
                    />
                }
                buySellSurvey={
                    <BuySellSurvey
                        companyRatios={companyRatios}
                        hasFullView={hasThreeColumnsLayout}
                        isCompactView={hasOneColumnLayout}
                    />
                }
                estimations={
                    <Estimations productEstimates={productEstimates} hasOneColumnLayout={hasOneColumnLayout} />
                }
                disclaimer={
                    <Disclaimer isFooter={false}>
                        <ExternalHtmlContent>
                            {`* ${localize(i18n, 'trader.productDetails.analystViews.disclaimer')}`}
                        </ExternalHtmlContent>
                    </Disclaimer>
                }
            />
        </div>
    );
});

ProductAnalystViews.displayName = 'ProductAnalystViews';
export default ProductAnalystViews;
