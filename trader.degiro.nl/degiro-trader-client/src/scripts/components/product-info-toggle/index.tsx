import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import {OrderBook} from 'frontend-core/dist/models/order-book';
import {ProductInfo} from 'frontend-core/dist/models/product';
import createComposedClassNameSelector from 'frontend-core/dist/utils/css/create-composed-classname-selector';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../styles/link.css';
import useProductOrderBook from '../../hooks/use-product-order-book';
import isTradableProduct from '../../services/product/is-tradable-product';
import getProductDetailsHref from '../../services/router/get-product-details-href';
import {selectableButtonWithBackdrop} from '../button/button.css';
import FeedQuality from '../feed-quality';
import {icon} from '../hint/hint.css';
import Menu from '../menu';
import ProductActionsButton from '../product-actions-button';
import ProductBrief from '../product-brief';
import ProductCategoryBadge from '../product-category-badge';
import ProductName from '../product-name';
import ProductTradingButtons from '../product-trading-buttons';
import {tooltipPopoverClassName} from '../tooltip-popover';
import {
    detailsLine,
    header,
    ordersBook,
    popupContent,
    pricesInfo,
    productActionsToggle,
    productName,
    productSubDetails,
    tradingButton,
    tradingButtons
} from './product-info-toggle.css';

const ProductPositionInfo = createLazyComponent(
    () => import(/* webpackChunkName: "product-position-info" */ '../product-position-info/index')
);
const ProductPricesInfo = createLazyComponent(
    () => import(/* webpackChunkName: "product-prices-info" */ '../product-prices-info/index')
);
const ProductOrderBook = createLazyComponent(
    () => import(/* webpackChunkName: "product-order-book" */ '../product-order-book/index')
);

interface Props {
    productInfo: ProductInfo;
}

const {useRef} = React;
const tradingButtonProps = {className: tradingButton};
const ProductInfoToggle: React.FunctionComponent<Props> = ({productInfo}) => {
    const toggle = useToggle(false);
    const targetButtonRef = useRef<HTMLButtonElement>(null);
    const orderBook: OrderBook | undefined = useProductOrderBook(productInfo);

    return (
        <Menu
            // [REFINITIV-1214]
            innerPopupRefs={[createComposedClassNameSelector(tooltipPopoverClassName)]}
            horizontalPosition="before"
            isOpened={toggle.isOpened}
            onClose={toggle.close}
            target={
                <button
                    ref={targetButtonRef}
                    data-test-key="open-popup-button"
                    type="button"
                    className={selectableButtonWithBackdrop}
                    onClick={toggle.toggle}>
                    <Icon type="details" className={icon} />
                </button>
            }>
            <div className={popupContent}>
                <div className={header}>
                    <Link
                        onClick={toggle.close}
                        to={getProductDetailsHref(productInfo.id)}
                        className={`${accentWhenSelectedLink} ${productName}`}>
                        <ProductName productInfo={productInfo} />
                    </Link>
                    <ProductCategoryBadge productInfo={productInfo} className={inlineRight} />
                    <ProductActionsButton productInfo={productInfo} className={productActionsToggle} />
                    <button
                        type="button"
                        data-test-key="close-popup-button"
                        onClick={() => {
                            targetButtonRef.current?.focus();
                            toggle.close();
                        }}
                        className={`${selectableButtonWithBackdrop} ${inlineRight}`}>
                        <Icon type="close" />
                    </button>
                </div>
                <ProductBrief productInfo={productInfo} className={productSubDetails}>
                    <FeedQuality productInfo={productInfo} />
                </ProductBrief>
                {orderBook && (
                    <ProductOrderBook
                        collapsable={true}
                        className={ordersBook}
                        productInfo={productInfo}
                        orderBook={orderBook}
                    />
                )}
                <ProductPricesInfo productInfo={productInfo} className={pricesInfo} />
                <ProductPositionInfo productInfo={productInfo} className={detailsLine} />
                {isTradableProduct(productInfo) && (
                    <ProductTradingButtons
                        productInfo={productInfo}
                        onClick={toggle.close}
                        fullText={true}
                        buttonProps={tradingButtonProps}
                        className={tradingButtons}
                    />
                )}
            </div>
        </Menu>
    );
};

export default React.memo(ProductInfoToggle);
