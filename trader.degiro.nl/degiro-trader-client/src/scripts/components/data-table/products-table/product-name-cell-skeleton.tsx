import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {buyButton, sellButton, smallButtonLayout} from '../../product-trading-buttons/product-trading-buttons.css';
import {icon, layout, layoutWithDefaultIcon} from '../../hint/hint.css';
import {toggleIconWrapper} from '../../product-actions-button/product-actions-button.css';
import {dataPlaceholder} from './products-table.css';
import {nbsp} from '../../value';
import {I18nContext} from '../../app-component/app-context';

const {useContext, memo} = React;
const ProductNameCellSkeleton = memo(() => {
    const i18n = useContext(I18nContext);

    return (
        <>
            <div className={smallButtonLayout}>
                <button type="button" className={buyButton} disabled={true}>
                    {localize(i18n, 'trader.productActions.buy.short')}
                </button>
                <button type="button" className={sellButton} disabled={true}>
                    {localize(i18n, 'trader.productActions.sell.short')}
                </button>
            </div>
            <button type="button" className={` ${layout} ${layoutWithDefaultIcon} ${toggleIconWrapper} `}>
                <Icon type="more_vert" className={icon} />
            </button>
            <span className={dataPlaceholder}>{''.padEnd(50, nbsp)}</span>
        </>
    );
});

ProductNameCellSkeleton.displayName = 'ProductNameCellSkeleton';
export default ProductNameCellSkeleton;
