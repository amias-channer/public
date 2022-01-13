import {selectableText} from 'frontend-core/dist/components/ui-trader4/selection-utils.css';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {
    autoWidthLabel,
    inlineEndValueItem,
    label,
    lineSection,
    valueItem
} from '../../../../../../styles/details-overview.css';
import {I18nContext} from '../../../../app-component/app-context';
import FeedQuality from '../../../../feed-quality';
import ProductBrief from '../../../../product-brief';
import ProductUpdates from '../../../../products-observer/product-updates';
import {nbsp} from '../../../../value';
import AbsoluteDifference from '../../../../value/absolute-difference';
import Price from '../../../../value/price';
import RelativeDifference from '../../../../value/relative-difference';
import Volume from '../../../../value/volume';
import {layout, line, productBriefLine} from './related-stocks.css';

interface Props {
    productInfo: ProductInfo;
    className?: string;
}

const {useContext} = React;
const productPricesFields: [QuotecastField, ...QuotecastField[]] = [
    'CurrentPrice',
    'CurrentClosePrice',
    'AbsoluteDifference',
    'RelativeDifference',
    'CumulativeVolume',
    'HighPrice',
    'LowPrice',
    'OpenPrice'
];
const ProductPricesInfo: React.FunctionComponent<Props> = ({
    productInfo,
    productInfo: {id: productId},
    className = ''
}) => {
    const i18n = useContext(I18nContext);

    return (
        <dl data-name="productPricesInfo" className={`${layout} ${className}`}>
            <div className={productBriefLine}>
                <ProductBrief productInfo={productInfo} className={selectableText}>
                    <FeedQuality productInfo={productInfo} />
                </ProductBrief>
            </div>
            <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
                {(values) => (
                    <>
                        <div className={line}>
                            <div className={lineSection}>
                                <dt className={`${label} ${autoWidthLabel}`}>
                                    {localize(i18n, 'trader.productDetails.lastPrice')}
                                </dt>
                                <dd className={`${valueItem} ${inlineEndValueItem}`}>
                                    <Price
                                        value={values.CurrentPrice?.value}
                                        field="CurrentPrice"
                                        id={productId}
                                        prefix={`${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                                    />
                                </dd>
                            </div>
                            <div className={lineSection}>
                                <dt className={`${label} ${autoWidthLabel}`}>
                                    {localize(i18n, 'trader.productDetails.openPrice')}
                                </dt>
                                <dt className={`${valueItem} ${inlineEndValueItem}`}>
                                    <Price
                                        value={values.OpenPrice?.value}
                                        field="OpenPrice"
                                        id={productId}
                                        className={`${valueItem} ${inlineEndValueItem}`}
                                    />
                                </dt>
                            </div>
                        </div>
                        <div className={line}>
                            <div className={lineSection}>
                                <dt className={`${label} ${autoWidthLabel}`}>
                                    {localize(i18n, 'trader.productDetails.absoluteDifference')}
                                </dt>
                                <span className={`${valueItem} ${inlineEndValueItem}`}>
                                    <AbsoluteDifference
                                        value={values.AbsoluteDifference?.value}
                                        field="AbsoluteDifference"
                                        id={productId}
                                    />
                                </span>
                            </div>
                            <div className={lineSection}>
                                <dt className={`${label} ${autoWidthLabel}`}>
                                    {localize(i18n, 'trader.productDetails.highPrice')}
                                </dt>
                                <Price
                                    value={values.HighPrice?.value}
                                    field="HighPrice"
                                    id={productId}
                                    className={`${valueItem} ${inlineEndValueItem}`}
                                />
                            </div>
                        </div>
                        <div className={line}>
                            <div className={lineSection}>
                                <dt className={`${label} ${autoWidthLabel}`}>
                                    {localize(i18n, 'trader.productDetails.relativeDifference')}
                                </dt>
                                <dd className={`${valueItem} ${inlineEndValueItem}`}>
                                    <RelativeDifference
                                        value={values.RelativeDifference?.value}
                                        field="RelativeDifference"
                                        id={productId}
                                    />
                                </dd>
                            </div>
                            <div className={lineSection}>
                                <dt className={`${label} ${autoWidthLabel}`}>
                                    {localize(i18n, 'trader.productDetails.lowPrice')}
                                </dt>
                                <Price
                                    value={values.LowPrice?.value}
                                    field="LowPrice"
                                    id={productId}
                                    className={`${valueItem} ${inlineEndValueItem}`}
                                />
                            </div>
                        </div>
                        <div className={line}>
                            <div className={lineSection}>
                                <dt className={`${label} ${autoWidthLabel}`}>
                                    {localize(i18n, 'trader.productDetails.volume')}
                                </dt>
                                <Volume
                                    value={values.CumulativeVolume?.value}
                                    field="CumulativeVolume"
                                    id={productId}
                                    className={`${valueItem} ${inlineEndValueItem}`}
                                />
                            </div>
                            <div className={lineSection}>
                                <dt className={`${label} ${autoWidthLabel}`}>
                                    {localize(i18n, 'trader.productDetails.closePrice')}
                                </dt>
                                <Price
                                    value={values.CurrentClosePrice?.value}
                                    field="CurrentClosePrice"
                                    id={productId}
                                    className={`${valueItem} ${inlineEndValueItem}`}
                                />
                            </div>
                        </div>
                    </>
                )}
            </ProductUpdates>
        </dl>
    );
};

export default React.memo(ProductPricesInfo);
