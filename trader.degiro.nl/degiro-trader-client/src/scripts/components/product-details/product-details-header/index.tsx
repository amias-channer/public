import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import type {QuotecastField} from 'frontend-core/dist/models/quotecast';
import {isSharingAvailable, share} from 'frontend-core/dist/platform/share';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import useGlobalFullLayoutFlag from '../../../hooks/use-global-full-layout-flag';
import isTradableProduct from '../../../services/product/is-tradable-product';
import {I18nContext} from '../../app-component/app-context';
import {selectableButtonWithBackdrop} from '../../button/button.css';
import FavouriteActionMenu from '../../favourites/favourite-action-menu';
import ProductActionsButton from '../../product-actions-button';
import ProductCategoryBadge from '../../product-category-badge/index';
import ProductName from '../../product-name/index';
import ProductNoteActionButton from '../../product-notes/product-note-action-button';
import ProductUpdates from '../../products-observer/product-updates';
import {nbsp} from '../../value';
import AbsoluteDifference from '../../value/absolute-difference';
import Price from '../../value/price';
import RelativeDifference from '../../value/relative-difference';
import Breadcrumbs from './breadcrumbs';
import {
    actionsButton,
    breadcrumbsBackButton,
    categoryBadge,
    compactLastPrice,
    compactPriceDiff,
    compactProductName,
    compactProductNameLayout,
    globallyCenteredContentWrapper,
    header,
    headerContent,
    icon,
    lastPrice,
    lastPriceCurrencySymbol,
    priceDiff,
    priceDiffs,
    prices,
    productName,
    productNameLayout
} from './product-details-header.css';
import FloatControls from './float-controls';

type Props = React.PropsWithChildren<{
    productInfo: ProductInfo;
    hasCompactView: boolean;
}>;

const {useContext, useMemo, memo} = React;
const productPricesFields: [QuotecastField, ...QuotecastField[]] = [
    'CurrentPrice',
    'AbsoluteDifference',
    'RelativeDifference'
];
const ProductDetailsHeader = memo<Props>(({children, productInfo, hasCompactView}) => {
    const i18n = useContext(I18nContext);
    const history = useHistory();
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const productId: string = String(productInfo.id);
    const pricesNode: React.ReactNode = (
        <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
            {(values) => (
                <>
                    <Price
                        className={hasCompactView ? compactLastPrice : lastPrice}
                        id={productId}
                        value={values.CurrentPrice?.value}
                        field="CurrentPrice"
                    />
                    <span className={priceDiffs}>
                        <AbsoluteDifference
                            id={productId}
                            value={values.AbsoluteDifference?.value}
                            className={hasCompactView ? compactPriceDiff : priceDiff}
                            field="AbsoluteDifference"
                        />
                        <RelativeDifference
                            id={productId}
                            value={values.RelativeDifference?.value}
                            className={hasCompactView ? compactPriceDiff : priceDiff}
                            brackets={true}
                            field="RelativeDifference"
                        />
                    </span>
                </>
            )}
        </ProductUpdates>
    );
    const productNameNode: React.ReactNode = (
        <ProductName
            productInfo={productInfo}
            subscribeToExternalName={true}
            className={hasCompactView ? compactProductName : productName}
        />
    );
    const productActionsNode: React.ReactNode = (
        <>
            <ProductNoteActionButton
                productInfo={productInfo}
                className={`${actionsButton} ${selectableButtonWithBackdrop}`}
                iconClassName={icon}
            />
            <FavouriteActionMenu productInfo={productInfo} />
            {isSharingAvailable() && (
                <button
                    type="button"
                    data-name="productDetailsShareButton"
                    className={`${actionsButton} ${selectableButtonWithBackdrop}`}
                    onClick={() => {
                        share({
                            title: localize(i18n, 'trader.productDetails.share.title', {productName: productInfo.name}),
                            text: localize(i18n, 'trader.productDetails.share.text', {productName: productInfo.name}),
                            url: window.location.href
                        }).catch(logErrorLocally);
                    }}>
                    <Icon type="share" />
                </button>
            )}
            <ProductActionsButton productInfo={productInfo} />
        </>
    );
    const hasFloatControls = useMemo(
        () => productInfo.productTypeId !== ProductTypeIds.INDEX && isTradableProduct(productInfo),
        [productInfo]
    );

    if (hasCompactView) {
        return (
            <div className={header}>
                <div
                    className={`${compactProductNameLayout} ${
                        hasGlobalFullLayout ? globallyCenteredContentWrapper : ''
                    }`}>
                    <span>
                        <button
                            type="button"
                            data-name="backButton"
                            className={breadcrumbsBackButton}
                            onClick={history.goBack}>
                            <Icon type="arrow_back" />
                        </button>
                        {productNameNode}
                        {getCurrencySymbol(productInfo.currency)}
                        {nbsp}
                        {pricesNode}
                    </span>
                    <span>
                        {productActionsNode}
                        {hasFloatControls && <FloatControls productInfo={productInfo} hasCompactView={true} />}
                    </span>
                </div>
                {children}
            </div>
        );
    }

    return (
        <div className={header}>
            <div className={hasGlobalFullLayout ? globallyCenteredContentWrapper : ''}>
                <div className={headerContent}>
                    {hasGlobalFullLayout && <Breadcrumbs onBack={history.goBack} productInfo={productInfo} />}
                    <div className={productNameLayout}>
                        {productNameNode}
                        <ProductCategoryBadge productInfo={productInfo} className={categoryBadge} />
                        {productActionsNode}
                        {hasFloatControls && <FloatControls productInfo={productInfo} hasCompactView={false} />}
                    </div>
                    {!hasGlobalFullLayout && <Breadcrumbs onBack={history.goBack} productInfo={productInfo} />}
                    <div className={prices}>
                        <span className={lastPriceCurrencySymbol}>
                            {getCurrencySymbol(productInfo.currency)}
                            {nbsp}
                        </span>
                        {pricesNode}
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
});

ProductDetailsHeader.displayName = 'ProductDetailsHeader';
export default ProductDetailsHeader;
