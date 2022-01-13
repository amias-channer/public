import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import * as React from 'react';
import CountryFlag from '../../country-flag/index';
import ProductName from '../../product-name/index';
import ProductUpdates from '../../products-observer/product-updates';
import Price from '../../value/price';
import RelativeDifference from '../../value/relative-difference';
import {
    list,
    listItem,
    listItemTitle,
    listItemValueSection,
    listLayout,
    listLayoutWithNavigationButtons,
    navigationButton,
    selectedListItem
} from './products-carousel.css';

interface Props<T> {
    products: T[];
    selectedProduct?: T;
    withNavigationButtons?: boolean;
    className?: string;
    onSelect(selectedProduct: T): void;
}

const productPricesFields: [QuotecastField, ...QuotecastField[]] = ['LastPrice', 'RelativeDifference'];
const scrollToSelectedItem = (itemEl: HTMLElement | null) => {
    const list: HTMLElement | null | undefined = itemEl?.parentElement;
    const itemIndex: number = Array.from(list ? list.children : []).indexOf(itemEl as HTMLElement);

    if (itemEl && list && itemIndex >= 0) {
        requestAnimationFrame(() => {
            list.scrollLeft = itemIndex * itemEl.clientWidth;
        });
    }
};
const ProductsCarousel = <T extends ProductInfo = ProductInfo>({
    products,
    selectedProduct,
    withNavigationButtons,
    className = '',
    onSelect
}: Props<T>) => {
    const selectedProductIndex: number = products.indexOf(selectedProduct as T);
    const onProductNavigationClick = (productInfo: T) => {
        deactivateActiveElement();
        onSelect(productInfo);
    };
    const prevProduct: T | undefined = selectedProductIndex < 1 ? undefined : products[selectedProductIndex - 1];
    const nextProduct: T | undefined = selectedProductIndex < 0 ? undefined : products[selectedProductIndex + 1];

    return (
        <div className={`${listLayout} ${withNavigationButtons ? listLayoutWithNavigationButtons : ''} ${className}`}>
            {withNavigationButtons && (
                <button
                    type="button"
                    aria-label="Previous product"
                    disabled={!prevProduct}
                    data-index={selectedProductIndex - 1}
                    data-name="prevProductButton"
                    onClick={prevProduct ? onProductNavigationClick.bind(null, prevProduct) : undefined}
                    className={navigationButton}>
                    <Icon type="keyboard_arrow_left" />
                </button>
            )}
            <div className={list}>
                {products.map((productInfo: T, index: number) => {
                    const {id: productId, country} = productInfo;
                    const isSelectedItem: boolean = index === selectedProductIndex;

                    return (
                        <button
                            key={String(productId)}
                            type="button"
                            data-name="productItem"
                            data-index={index}
                            ref={isSelectedItem ? scrollToSelectedItem : undefined}
                            className={`${listItem} ${isSelectedItem ? selectedListItem : ''}`}
                            onClick={onProductNavigationClick.bind(null, productInfo)}>
                            {country && <CountryFlag country={country} className={inlineLeft} />}
                            <ProductName productInfo={productInfo} className={listItemTitle} />
                            <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                                {(values) => (
                                    <>
                                        <Price
                                            className={listItemValueSection}
                                            highlightValueChange={true}
                                            id={productId}
                                            value={values.LastPrice?.value}
                                            field="LastPrice"
                                        />
                                        <RelativeDifference
                                            className={listItemValueSection}
                                            id={productId}
                                            value={values.RelativeDifference?.value}
                                            field="RelativeDifference"
                                        />
                                    </>
                                )}
                            </ProductUpdates>
                        </button>
                    );
                })}
            </div>
            {withNavigationButtons && (
                <button
                    type="button"
                    aria-label="Next product"
                    disabled={!nextProduct}
                    data-name="nextProductButton"
                    data-index={selectedProductIndex + 1}
                    onClick={nextProduct ? onProductNavigationClick.bind(null, nextProduct) : undefined}
                    className={navigationButton}>
                    <Icon type="keyboard_arrow_right" />
                </button>
            )}
        </div>
    );
};

export default React.memo(ProductsCarousel) as <T extends ProductInfo = ProductInfo>(props: Props<T>) => JSX.Element;
