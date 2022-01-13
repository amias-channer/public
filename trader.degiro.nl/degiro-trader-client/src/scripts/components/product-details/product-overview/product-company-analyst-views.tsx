import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {ProductSubLinks, Routes} from '../../../navigation';
import {RefinitivCompanyRatios} from '../../../models/refinitiv-company-profile';
import CardHeader from '../../card/header';
import Card from '../../card';
import ProductAnalystViewsChart from '../product-analyst-views-chart';
import ViewMoreLink from '../../view-more-link';

interface Props {
    companyRatios?: RefinitivCompanyRatios;
    productInfo: ProductInfo;
    isAnalystViewsTabVisible: boolean;
}

const {useContext, memo} = React;
const ProductCompanyAnalystViews = memo<Props>(({companyRatios, productInfo, isAnalystViewsTabVisible}) => {
    const i18n = useContext(I18nContext);

    return (
        <Card
            data-name="productCompanyAnalystViews"
            header={<CardHeader title={localize(i18n, 'trader.productDetails.analystViews.title')} />}
            footer={
                companyRatios &&
                isAnalystViewsTabVisible && (
                    <ViewMoreLink to={`${Routes.PRODUCTS}/${productInfo.id}/${ProductSubLinks.ANALYST_VIEWS}`} />
                )
            }>
            <ProductAnalystViewsChart
                companyRatios={companyRatios && Object.keys(companyRatios).length > 0 ? companyRatios : undefined}
            />
        </Card>
    );
});

ProductCompanyAnalystViews.displayName = 'ProductCompanyAnalystViews';
export default ProductCompanyAnalystViews;
