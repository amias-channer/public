import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {Link} from 'react-router-dom';
import getProductDetailsHref from '../../../../services/router/get-product-details-href';
import {I18nContext} from '../../../app-component/app-context';
import {
    detailsButton,
    fullWidthSection
} from '../../../app-component/side-information-panel/side-information-panel.css';
import ProductActionsButton from '../../../product-actions-button';
import ProductCategoryBadge from '../../../product-category-badge/index';
import ProductUpdates from '../../../products-observer/product-updates';
import OrderTriggerValue from '../../../value/order-trigger-value';
import Volume from '../../../value/volume';
import {
    layout,
    pricesLine,
    pricesLineSection,
    productActionsToggle,
    productLine,
    productLink
} from './product-details.css';

const ProductPositionInfo = createLazyComponent(
    () => import(/* webpackChunkName: "product-position-info" */ '../../../product-position-info/index')
);

interface Props {
    productInfo: ProductInfo;
    label: string;
}

const {useContext} = React;
const productPricesFields: [QuotecastField, ...QuotecastField[]] = ['BidVolume', 'BidPrice', 'AskVolume', 'AskPrice'];
const ProductDetails: React.FunctionComponent<Props> = ({productInfo, label}) => {
    const i18n = useContext(I18nContext);
    const productId: string = String(productInfo.id);
    const productCurrencySymbol: string = getCurrencySymbol(productInfo.currency);

    return (
        <div className={layout}>
            <div className={productLine}>
                {label} -
                <Link className={productLink} to={getProductDetailsHref(productInfo.id)}>
                    {productInfo.name}
                </Link>
                <ProductCategoryBadge productInfo={productInfo} />
                <ProductActionsButton className={productActionsToggle} productInfo={productInfo} />
            </div>
            <div className={pricesLine}>
                <div className={pricesLineSection}>
                    {localize(i18n, 'trader.productDetails.bid')}
                    {` (${productCurrencySymbol})`}
                </div>
                <div className={pricesLineSection}>
                    {localize(i18n, 'trader.productDetails.ask')}
                    {` (${productCurrencySymbol})`}
                </div>
            </div>
            <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                {(values) => (
                    <div className={pricesLine}>
                        <div className={pricesLineSection}>
                            <Volume
                                value={values.BidVolume?.value}
                                field="BidVolume"
                                highlightValueChange={true}
                                id={productId}
                            />{' '}
                            <OrderTriggerValue
                                value={values.BidPrice?.value}
                                productInfo={productInfo}
                                field="BidPrice"
                                highlightValueChange={true}
                                id={productId}
                            />
                        </div>
                        <div className={pricesLineSection}>
                            <OrderTriggerValue
                                value={values.AskPrice?.value}
                                productInfo={productInfo}
                                field="AskPrice"
                                highlightValueChange={true}
                                id={productId}
                            />{' '}
                            <Volume
                                value={values.AskVolume?.value}
                                field="AskVolume"
                                highlightValueChange={true}
                                id={productId}
                            />
                        </div>
                    </div>
                )}
            </ProductUpdates>
            <ProductPositionInfo className={`${detailsButton} ${fullWidthSection}`} productInfo={productInfo}>
                <Icon type="keyboard_arrow_right" />
            </ProductPositionInfo>
        </div>
    );
};

export default React.memo(ProductDetails);
