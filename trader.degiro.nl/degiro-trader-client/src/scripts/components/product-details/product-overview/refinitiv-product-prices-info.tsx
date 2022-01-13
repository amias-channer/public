import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {line, lineTopSeparator} from '../../../../styles/details-overview.css';
import {PricingData} from '../../../models/refinitiv-company-profile';
import {I18nContext} from '../../app-component/app-context';
import CardRowWithTooltip from '../../product-details/card-row-with-tooltip';
import {
    multilineValueItem,
    secondaryValueItem
} from '../../product-details/card-row-with-tooltip/card-row-with-tooltip.css';
import ProductUpdates from '../../products-observer/product-updates';
import {nbsp} from '../../value';
import AbsoluteDifference from '../../value/absolute-difference';
import DateValue from '../../value/date';
import NumberAbbr from '../../value/number-abbr';
import OrderTriggerValue from '../../value/order-trigger-value';
import Price from '../../value/price';
import RelativeDifference from '../../value/relative-difference';
import {defaultPercentFormatting} from '../formatting-config';
import TooltipDescriptionLine from '../product-details-hint/tooltip-description-line';
import pricingTooltips from '../tooltips-data/refinitiv-pricing-tooltips';
import Disclaimer from '../../disclaimer';

interface Props {
    productInfo: ProductInfo;
    className?: string;
    pricingData: PricingData;
}

const productPricesFields: [QuotecastField, ...QuotecastField[]] = [
    'CurrentPrice',
    'CurrentClosePrice',
    'AbsoluteDifference',
    'RelativeDifference',
    'AskPrice',
    'AskVolume',
    'BidPrice',
    'BidVolume',
    'CumulativeVolume',
    'HighPrice',
    'LowPrice',
    'OpenPrice',
    'CombinedLastDateTime'
];
const {useContext} = React;
const RefinitivProductPricesInfo: React.FunctionComponent<Props> = ({productInfo, pricingData, className}) => {
    const i18n = useContext(I18nContext);
    const {id: productId} = productInfo;
    const {priceCurrency} = pricingData;
    const isPointerDevice = !isTouchDevice();

    return (
        <ProductUpdates productInfo={productInfo} fields={productPricesFields}>
            {(values) => (
                <dl data-name="refinitivProductPricesInfo" className={className}>
                    <div className={line}>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.lastPrice')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.CurrentPrice.title}
                                        content={pricingTooltips.CurrentPrice.content}
                                    />
                                )
                            }>
                            <Price
                                value={values.CurrentPrice?.value}
                                field="CurrentPrice"
                                id={productId}
                                prefix={`${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                            />
                        </CardRowWithTooltip>
                        <CardRowWithTooltip valueClassName={`${multilineValueItem} ${secondaryValueItem}`}>
                            <DateValue
                                id={productId}
                                value={values.CombinedLastDateTime?.value}
                                field="CombinedLastDateTime"
                                format="DD/MM/YYYY HH:mm"
                            />
                        </CardRowWithTooltip>
                    </div>
                    <div className={line}>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.bidPrice')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.BidPrice.title}
                                        content={pricingTooltips.BidPrice.content}
                                    />
                                )
                            }>
                            <OrderTriggerValue
                                value={values.BidPrice?.value}
                                productInfo={productInfo}
                                field="BidPrice"
                                id={productId}
                            />
                        </CardRowWithTooltip>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.askPrice')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.AskPrice.title}
                                        content={pricingTooltips.AskPrice.content}
                                    />
                                )
                            }>
                            <OrderTriggerValue
                                value={values.AskPrice?.value}
                                productInfo={productInfo}
                                field="AskPrice"
                                id={productId}
                            />
                        </CardRowWithTooltip>
                    </div>
                    <div className={line}>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.bidVolume')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.BidVolume.title}
                                        content={pricingTooltips.BidVolume.content}
                                    />
                                )
                            }>
                            <NumberAbbr value={values.BidVolume?.value} field="BidVolume" id={productId} />
                        </CardRowWithTooltip>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.askVolume')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.AskVolume.title}
                                        content={pricingTooltips.AskVolume.content}
                                    />
                                )
                            }>
                            <NumberAbbr value={values.AskVolume?.value} field="AskVolume" id={productId} />
                        </CardRowWithTooltip>
                    </div>
                    <div className={line}>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.openPrice')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.OpenPrice.title}
                                        content={pricingTooltips.OpenPrice.content}
                                    />
                                )
                            }>
                            <Price value={values.OpenPrice?.value} field="OpenPrice" id={productId} />
                        </CardRowWithTooltip>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.closePrice')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.CurrentClosePrice.title}
                                        content={pricingTooltips.CurrentClosePrice.content}
                                    />
                                )
                            }>
                            <Price value={values.CurrentClosePrice?.value} field="CurrentClosePrice" id={productId} />
                        </CardRowWithTooltip>
                    </div>
                    <div className={line}>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.highPrice')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.HighPrice.title}
                                        content={pricingTooltips.HighPrice.content}
                                    />
                                )
                            }>
                            <Price value={values.HighPrice?.value} field="HighPrice" id={productId} />
                        </CardRowWithTooltip>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.high12m')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.NHIG.title}
                                        content={
                                            <>
                                                {pricingTooltips.NHIG.content}
                                                {priceCurrency && (
                                                    <Disclaimer isInverted={true}>
                                                        {localize(
                                                            i18n,
                                                            'trader.productDetails.analystViews.estimations.currency',
                                                            {currency: priceCurrency}
                                                        )}
                                                    </Disclaimer>
                                                )}
                                            </>
                                        }
                                    />
                                )
                            }>
                            <Price value={pricingData.NHIG} field="NHIG" id={productId} />
                        </CardRowWithTooltip>
                    </div>
                    <div className={line}>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.lowPrice')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.LowPrice.title}
                                        content={pricingTooltips.LowPrice.content}
                                    />
                                )
                            }>
                            <Price value={values.LowPrice?.value} field="LowPrice" id={productId} />
                        </CardRowWithTooltip>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.low12m')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.NLOW.title}
                                        content={
                                            <>
                                                {pricingTooltips.NLOW.content}
                                                {priceCurrency && (
                                                    <Disclaimer isInverted={true}>
                                                        {localize(
                                                            i18n,
                                                            'trader.productDetails.analystViews.estimations.currency',
                                                            {currency: priceCurrency}
                                                        )}
                                                    </Disclaimer>
                                                )}
                                            </>
                                        }
                                    />
                                )
                            }>
                            <Price value={pricingData.NLOW} field="NLOW" id={productId} />
                        </CardRowWithTooltip>
                    </div>
                    <div className={line}>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.absoluteDifference')}
                            tooltip={
                                isPointerDevice && (
                                    <>
                                        <TooltipDescriptionLine
                                            title={pricingTooltips.AbsoluteDifference.title}
                                            content={pricingTooltips.AbsoluteDifference.content}
                                        />
                                        <TooltipDescriptionLine
                                            title={pricingTooltips.RelativeDifference.title}
                                            content={pricingTooltips.RelativeDifference.content}
                                        />
                                    </>
                                )
                            }>
                            <AbsoluteDifference
                                value={values.AbsoluteDifference?.value}
                                field="AbsoluteDifference"
                                id={productId}
                            />{' '}
                            <RelativeDifference
                                brackets={true}
                                formatting={defaultPercentFormatting}
                                value={values.RelativeDifference?.value}
                                field="RelativeDifference"
                                id={productId}
                            />
                        </CardRowWithTooltip>
                        <CardRowWithTooltip
                            label={localize(i18n, 'trader.productDetails.YtdRelative')}
                            tooltip={
                                isPointerDevice && (
                                    <TooltipDescriptionLine
                                        title={pricingTooltips.PRYTDPCT.title}
                                        content={pricingTooltips.PRYTDPCT.content}
                                    />
                                )
                            }>
                            <RelativeDifference
                                formatting={defaultPercentFormatting}
                                value={pricingData.PRYTDPCT}
                                field="PRYTDPCT"
                                id={productId}
                            />
                        </CardRowWithTooltip>
                    </div>
                    <CardRowWithTooltip
                        className={`${line} ${lineTopSeparator}`}
                        label={localize(i18n, 'trader.productDetails.volume')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={pricingTooltips.CumulativeVolume.title}
                                    content={pricingTooltips.CumulativeVolume.content}
                                />
                            )
                        }>
                        <NumberAbbr value={values.CumulativeVolume?.value} field="CumulativeVolume" id={productId} />
                    </CardRowWithTooltip>
                    <CardRowWithTooltip
                        className={line}
                        label={localize(i18n, 'trader.productDetails.volume10d')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={pricingTooltips.VOL10DAVG.title}
                                    content={pricingTooltips.VOL10DAVG.content}
                                />
                            )
                        }>
                        <NumberAbbr value={pricingData.VOL10DAVG} field="VOL10DAVG" id={productId} />
                    </CardRowWithTooltip>
                    <CardRowWithTooltip
                        className={line}
                        label={localize(i18n, 'trader.productDetails.volume3m')}
                        tooltip={
                            isPointerDevice && (
                                <TooltipDescriptionLine
                                    title={pricingTooltips.VOL3MAVG.title}
                                    content={pricingTooltips.VOL3MAVG.content}
                                />
                            )
                        }>
                        <NumberAbbr value={pricingData.VOL3MAVG} field="VOL3MAVG" id={productId} />
                    </CardRowWithTooltip>
                </dl>
            )}
        </ProductUpdates>
    );
};

export default React.memo(RefinitivProductPricesInfo);
