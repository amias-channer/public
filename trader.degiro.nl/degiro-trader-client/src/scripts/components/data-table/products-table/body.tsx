import ExchangeAbbr from 'frontend-core/dist/components/ui-common/exchange-abbr';
import ProductType from 'frontend-core/dist/components/ui-common/product-type';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {ConfigContext, I18nContext} from '../../app-component/app-context';
import FeedQuality from '../../feed-quality/index';
import ProductPerformanceChart from '../../product-performance-chart/index';
import ProductSymbolIsin from '../../product-symbol-isin/index';
import ProductUpdates from '../../products-observer/product-updates';
import {
    cell,
    exchangeCell,
    feedQualityCell,
    hoverableRow,
    inlineEndContentCell,
    performanceChartCell,
    priceCell,
    productNameCell,
    row,
    selectedRow,
    startStickyCell,
    stickyCellContent
} from '../../table/table.css';
import {nbsp} from '../../value';
import AbsoluteDifference from '../../value/absolute-difference';
import DateValue, {defaultFullTimeValueFormat} from '../../value/date';
import OrderTriggerValue from '../../value/order-trigger-value';
import Price from '../../value/price';
import RelativeDifference from '../../value/relative-difference';
import Volume from '../../value/volume';
import {Column, ColumnDescription, ProductsTableViewProps} from './index';
import ProductNameCellContent from './product-name-cell-content';

interface ProductsTableBodyProps {
    products: [ProductInfo, ...ProductInfo[]];
    columns: ProductsTableViewProps['columns'];
    selectedItems: ProductsTableViewProps['selectedItems'];
}

const productPricesFields: [QuotecastField, ...QuotecastField[]] = [
    'LastPrice',
    'AbsoluteDifference',
    'RelativeDifference',
    'BidPrice',
    'AskPrice',
    'CumulativeVolume',
    'LowPrice',
    'OpenPrice',
    'HighPrice',
    'CurrentClosePrice',
    'CombinedLastDateTime'
];
const {useContext, memo} = React;
const ProductsTableBody = memo<ProductsTableBodyProps>(({products, columns, selectedItems}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);

    return (
        <tbody>
            {products.map((productInfo: ProductInfo) => {
                const productId: string = String(productInfo.id);
                const {exchange} = productInfo;
                const currencyPrefix = `${getCurrencySymbol(productInfo.currency)}${nbsp}`;
                const isSelected = selectedItems?.includes(productId);

                return (
                    <ProductUpdates key={productId} productInfo={productInfo} fields={productPricesFields}>
                        {(values) => {
                            return (
                                <tr className={`${row} ${hoverableRow} ${isSelected ? selectedRow : ''}`}>
                                    {columns.map((column: Column) => {
                                        const field: string = typeof column === 'string' ? column : column.field;
                                        const {renderBodyCell} = column as ColumnDescription;

                                        if (renderBodyCell) {
                                            return renderBodyCell(productInfo);
                                        }

                                        const key: string = `${productId}.${field}`;

                                        switch (field) {
                                            case 'name':
                                                return (
                                                    <td
                                                        key={key}
                                                        className={`${cell} ${startStickyCell} ${productNameCell}`}>
                                                        <div className={stickyCellContent}>
                                                            <ProductNameCellContent productInfo={productInfo} />
                                                        </div>
                                                    </td>
                                                );
                                            case 'currency':
                                                return (
                                                    <td
                                                        key={key}
                                                        data-id={productId}
                                                        data-field="currency"
                                                        className={cell}>
                                                        {productInfo.currency}
                                                    </td>
                                                );
                                            case 'symbolIsin':
                                                return (
                                                    <td key={key} className={cell}>
                                                        <ProductSymbolIsin productInfo={productInfo} />
                                                    </td>
                                                );
                                            case 'productType':
                                                return (
                                                    <td key={key} className={cell}>
                                                        <ProductType
                                                            id={productInfo.productTypeId}
                                                            config={config}
                                                            i18n={i18n}
                                                        />
                                                    </td>
                                                );
                                            case 'exchange.hiqAbbr':
                                                return (
                                                    <td key={key} className={`${cell} ${exchangeCell}`}>
                                                        {exchange && <ExchangeAbbr exchange={exchange} />}
                                                    </td>
                                                );
                                            case 'stoploss':
                                                return (
                                                    <td
                                                        key={key}
                                                        data-id={productId}
                                                        data-field="stoploss"
                                                        className={`${cell} ${inlineEndContentCell}`}>
                                                        {productInfo.stoploss}
                                                    </td>
                                                );
                                            case 'leverage':
                                                return (
                                                    <td
                                                        key={key}
                                                        data-id={productId}
                                                        data-field="leverage"
                                                        className={`${cell} ${inlineEndContentCell}`}>
                                                        {productInfo.leverage}
                                                    </td>
                                                );
                                            case 'financingLevel':
                                                return (
                                                    <td
                                                        key={key}
                                                        className={`${cell} ${priceCell} ${inlineEndContentCell}`}>
                                                        <Price
                                                            value={productInfo.financingLevel}
                                                            id={productId}
                                                            prefix={currencyPrefix}
                                                            field="financingLevel"
                                                        />
                                                    </td>
                                                );
                                            case 'LastPrice.value':
                                                return (
                                                    <td
                                                        key={key}
                                                        className={`${cell} ${priceCell} ${inlineEndContentCell}`}>
                                                        <Price
                                                            highlightValueChange={true}
                                                            marked={true}
                                                            value={values.LastPrice?.value}
                                                            id={productId}
                                                            prefix={currencyPrefix}
                                                            field="LastPrice"
                                                        />
                                                    </td>
                                                );
                                            case 'AbsoluteDifference.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <AbsoluteDifference
                                                            value={values.AbsoluteDifference?.value}
                                                            id={productId}
                                                            field="AbsoluteDifference"
                                                        />
                                                    </td>
                                                );
                                            case 'RelativeDifference.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <RelativeDifference
                                                            value={values.RelativeDifference?.value}
                                                            id={productId}
                                                            field="RelativeDifference"
                                                        />
                                                    </td>
                                                );
                                            case 'BidPrice.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <OrderTriggerValue
                                                            highlightValueChange={true}
                                                            value={values.BidPrice?.value}
                                                            productInfo={productInfo}
                                                            id={productId}
                                                            field="BidPrice"
                                                        />
                                                    </td>
                                                );
                                            case 'AskPrice.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <OrderTriggerValue
                                                            highlightValueChange={true}
                                                            value={values.AskPrice?.value}
                                                            productInfo={productInfo}
                                                            id={productId}
                                                            field="AskPrice"
                                                        />
                                                    </td>
                                                );
                                            case 'CumulativeVolume.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <Volume
                                                            value={values.CumulativeVolume?.value}
                                                            id={productId}
                                                            field="CumulativeVolume"
                                                        />
                                                    </td>
                                                );
                                            case 'LowPrice.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <Price
                                                            value={values.LowPrice?.value}
                                                            id={productId}
                                                            field="LowPrice"
                                                        />
                                                    </td>
                                                );
                                            case 'OpenPrice.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <Price
                                                            value={values.OpenPrice?.value}
                                                            id={productId}
                                                            field="OpenPrice"
                                                        />
                                                    </td>
                                                );
                                            case 'HighPrice.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <Price
                                                            value={values.HighPrice?.value}
                                                            id={productId}
                                                            field="HighPrice"
                                                        />
                                                    </td>
                                                );
                                            case 'CurrentClosePrice.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <Price
                                                            value={values.CurrentClosePrice?.value}
                                                            id={productId}
                                                            field="CurrentClosePrice"
                                                        />
                                                    </td>
                                                );
                                            case 'CombinedLastDateTime.value':
                                                return (
                                                    <td key={key} className={`${cell} ${inlineEndContentCell}`}>
                                                        <DateValue
                                                            value={values.CombinedLastDateTime?.value}
                                                            id={productId}
                                                            onlyTodayTime={true}
                                                            timeFormat={defaultFullTimeValueFormat}
                                                            field="CombinedLastDateTime"
                                                        />
                                                    </td>
                                                );
                                            case 'feedQuality':
                                                return (
                                                    <td key={key} className={`${cell} ${feedQualityCell}`}>
                                                        <FeedQuality productInfo={productInfo} />
                                                    </td>
                                                );
                                            case 'chart': {
                                                return (
                                                    <td key={key} className={`${cell} ${performanceChartCell}`}>
                                                        <ProductPerformanceChart productInfo={productInfo} />
                                                    </td>
                                                );
                                            }
                                            default:
                                                return null;
                                        }
                                    })}
                                </tr>
                            );
                        }}
                    </ProductUpdates>
                );
            })}
        </tbody>
    );
});

ProductsTableBody.displayName = 'ProductsTableBody';
export default ProductsTableBody;
