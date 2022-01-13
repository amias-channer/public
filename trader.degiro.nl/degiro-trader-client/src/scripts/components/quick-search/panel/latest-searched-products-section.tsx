import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {actionLink} from '../../../../styles/link.css';
import {I18nContext} from '../../app-component/app-context';
import Hint from '../../hint';
import {listDivider, listDividerTitle, productDeleteButton} from './panel.css';
import ProductsListItem from './products-list-item';

interface Props {
    products: ProductInfo[];
    onItemDelete(productInfo: ProductInfo): void;
    onAllItemsDelete(): void;
    onProductTradingButtonsClick(event: React.MouseEvent<HTMLElement>): void;
}

const {useContext} = React;
const LatestSearchedProductsSection: React.FunctionComponent<Props> = ({
    products,
    onItemDelete,
    onAllItemsDelete,
    onProductTradingButtonsClick
}) => {
    const i18n = useContext(I18nContext);
    const deleteProductButtonTitle: string = localize(i18n, 'trader.forms.actions.remove');

    return (
        <>
            <header className={listDivider}>
                <span className={listDividerTitle}>
                    {localize(i18n, 'trader.productsSearch.recentlySearchedProducts.title')}
                </span>
                <button
                    type="button"
                    data-name="deleteAllProductsButton"
                    className={actionLink}
                    onClick={onAllItemsDelete}>
                    {localize(i18n, 'trader.productsSearch.recentlySearchedProducts.deleteAll')}
                </button>
            </header>
            {products.map((productInfo: ProductInfo) => {
                const productId: string = String(productInfo.id);

                return (
                    <ProductsListItem
                        key={productId}
                        productInfo={productInfo}
                        onTradingButtonsClick={onProductTradingButtonsClick}
                        secondaryActions={
                            <Hint
                                aria-label={deleteProductButtonTitle}
                                data-name="deleteProductButton"
                                className={productDeleteButton}
                                content={deleteProductButtonTitle}
                                onClick={onItemDelete.bind(null, productInfo)}>
                                <Icon type="close" />
                            </Hint>
                        }
                    />
                );
            })}
        </>
    );
};

export default React.memo(LatestSearchedProductsSection);
