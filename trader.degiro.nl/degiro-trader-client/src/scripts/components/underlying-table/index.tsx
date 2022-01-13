import {horizontalScrollPanel} from 'frontend-core/dist/components/ui-trader4/scroll-panel/scroll-panel.css';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import localize from 'frontend-core/dist/services/i18n/localize';
import getProductInfo from 'frontend-core/dist/services/products/product/get-product-info';
import * as React from 'react';
import {Link} from 'react-router-dom';
import getProductDetailsHref from '../../services/router/get-product-details-href';
import {ConfigContext, CurrentClientContext, I18nContext} from '../app-component/app-context';
import FeedQuality from '../feed-quality/index';
import ProductName from '../product-name/index';
import ProductUpdates from '../products-observer/product-updates';
import {cell, headerCell, inlineEndContentCell, row, table as tableClassName} from '../table/table.css';
import AbsoluteDifference from '../value/absolute-difference';
import OrderTriggerValue from '../value/order-trigger-value';
import Price from '../value/price';
import RelativeDifference from '../value/relative-difference';
import Volume from '../value/volume';

interface Props {
    className?: string;
    underlyingProductId: number | string;
}

const {useContext} = React;
const productPricesFields: [QuotecastField, ...QuotecastField[]] = [
    'LastPrice',
    'AbsoluteDifference',
    'RelativeDifference',
    'BidPrice',
    'AskPrice',
    'CumulativeVolume'
];
const UnderlyingTable: React.FunctionComponent<Props> = ({underlyingProductId, className = ''}) => {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const currentClient = useContext(CurrentClientContext);
    const {value: productInfo} = useAsync<ProductInfo | undefined>(() => {
        return getProductInfo(config, currentClient, {id: String(underlyingProductId)});
    }, [config, currentClient, underlyingProductId]);

    if (!productInfo || !productInfo.vwdId) {
        return null;
    }

    const {id: productId} = productInfo;

    return (
        <div className={`${horizontalScrollPanel} ${className}`}>
            <table className={tableClassName}>
                <thead>
                    <tr className={row}>
                        <th className={headerCell}>{localize(i18n, 'trader.productsTable.productNameColumn')}</th>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'trader.productDetails.lastPrice')}
                        </th>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'trader.productDetails.absoluteDifference')}
                        </th>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'trader.productDetails.relativeDifference')}
                        </th>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'trader.productDetails.bidPrice')}
                        </th>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'trader.productDetails.askPrice')}
                        </th>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'trader.productDetails.volume')}
                        </th>
                        <th className={`${headerCell} ${inlineEndContentCell}`}>
                            {localize(i18n, 'trader.productDetails.lastUpdate')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                        {(values) => (
                            <tr className={row}>
                                <td className={cell}>
                                    <Link to={getProductDetailsHref(productId)}>
                                        <ProductName productInfo={productInfo} />
                                    </Link>
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <Price id={productId} field="LastPrice" value={values.LastPrice?.value} />
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <AbsoluteDifference
                                        id={productId}
                                        field="AbsoluteDifference"
                                        value={values.AbsoluteDifference?.value}
                                    />
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <RelativeDifference
                                        id={productId}
                                        field="RelativeDifference"
                                        value={values.RelativeDifference?.value}
                                    />
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <OrderTriggerValue
                                        id={productId}
                                        field="BidPrice"
                                        value={values.BidPrice?.value}
                                        productInfo={productInfo}
                                    />
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <OrderTriggerValue
                                        id={productId}
                                        field="AskPrice"
                                        value={values.AskPrice?.value}
                                        productInfo={productInfo}
                                    />
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <Volume
                                        id={productId}
                                        field="CumulativeVolume"
                                        value={values.CumulativeVolume?.value}
                                    />
                                </td>
                                <td className={`${cell} ${inlineEndContentCell}`}>
                                    <FeedQuality productInfo={productInfo} />
                                </td>
                            </tr>
                        )}
                    </ProductUpdates>
                </tbody>
            </table>
        </div>
    );
};

export default React.memo(UnderlyingTable);
