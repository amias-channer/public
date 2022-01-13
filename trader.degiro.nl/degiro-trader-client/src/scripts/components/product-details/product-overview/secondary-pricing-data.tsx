import ExchangeName from 'frontend-core/dist/components/ui-common/exchange-name';
import {ProductBitTypes, ProductInfo} from 'frontend-core/dist/models/product';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import isUsExchange from 'frontend-core/dist/services/exchange/is-us-exchange';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {line, lineTopSeparator} from '../../../../styles/details-overview.css';
import {PricingData} from '../../../models/refinitiv-company-profile';
import {Statuses} from '../../../models/status';
import {I18nContext} from '../../app-component/app-context';
import CardRowWithTooltip from '../../product-details/card-row-with-tooltip';
import StatusIcon from '../../status/status-icon';
import {valuePlaceholder, valuesDelimiter} from '../../value';
import NumberAbbr from '../../value/number-abbr';
import {multilineValueItem} from '../card-row-with-tooltip/card-row-with-tooltip.css';
import TooltipDescriptionLine from '../product-details-hint/tooltip-description-line';
import pricingTooltips from '../tooltips-data/refinitiv-pricing-tooltips';

interface Props {
    productInfo: ProductInfo;
    pricingData: PricingData;
    className?: string;
}

const {useContext} = React;
const SecondaryPricingData: React.FunctionComponent<Props> = ({productInfo, pricingData, className}) => {
    const i18n = useContext(I18nContext);
    const {exchange} = productInfo;
    const productId: string = String(productInfo.id);
    const {productBitTypes = []} = productInfo;
    const isInUSGreenList: boolean = productBitTypes.includes(ProductBitTypes.US_RAS_GREEN_LIST);
    const isPointerDevice = !isTouchDevice();

    return (
        <dl className={className}>
            <CardRowWithTooltip
                className={`${line} ${lineTopSeparator}`}
                label={localize(i18n, 'trader.productsTable.isinSymbolColumn')}
                tooltip={
                    isPointerDevice && (
                        <>
                            <TooltipDescriptionLine
                                title={pricingTooltips.symbol.title}
                                content={pricingTooltips.symbol.content}
                            />
                            <TooltipDescriptionLine
                                title={pricingTooltips.ISIN.title}
                                content={pricingTooltips.ISIN.content}
                            />
                        </>
                    )
                }>
                <span data-field="symbolIsin">
                    {Array.from(new Set([productInfo.symbol, productInfo.isin]))
                        .filter(Boolean)
                        .join(valuesDelimiter) || valuePlaceholder}
                </span>
            </CardRowWithTooltip>
            {exchange && (
                <CardRowWithTooltip
                    className={line}
                    label={localize(i18n, 'trader.productDetails.exchange')}
                    valueClassName={multilineValueItem}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={pricingTooltips.exchange.title}
                                content={pricingTooltips.exchange.content}
                            />
                        )
                    }>
                    <ExchangeName exchange={exchange} />
                </CardRowWithTooltip>
            )}
            <CardRowWithTooltip
                className={line}
                label={localize(i18n, 'trader.productDetails.sharesFloating')}
                tooltip={
                    isPointerDevice && (
                        <TooltipDescriptionLine
                            title={pricingTooltips.totalFloat.title}
                            content={pricingTooltips.totalFloat.content}
                        />
                    )
                }>
                {pricingData && <NumberAbbr value={pricingData.totalFloat} field="totalFloat" id={productId} />}
            </CardRowWithTooltip>
            <CardRowWithTooltip
                className={line}
                label={localize(i18n, 'trader.productDetails.sharesOutstanding')}
                tooltip={
                    isPointerDevice && (
                        <TooltipDescriptionLine
                            title={pricingTooltips.sharesOut.title}
                            content={pricingTooltips.sharesOut.content}
                        />
                    )
                }>
                {pricingData && <NumberAbbr value={pricingData.sharesOut} field="sharesOut" id={productId} />}
            </CardRowWithTooltip>
            {isUsExchange(productInfo.exchangeId) && (
                <CardRowWithTooltip
                    className={`${line} ${lineTopSeparator}`}
                    label={localize(i18n, 'trader.productDetails.USGreenListLabel')}
                    tooltip={
                        isPointerDevice && (
                            <TooltipDescriptionLine
                                title={localize(i18n, 'trader.productDetails.USGreenListLabel').concat(':')}
                                content={localize(i18n, 'trader.productsSearch.USGreenListHint')}
                            />
                        )
                    }>
                    <StatusIcon
                        inactive={!isInUSGreenList}
                        status={isInUSGreenList ? Statuses.SUCCESS : Statuses.FAILURE}
                    />
                </CardRowWithTooltip>
            )}
        </dl>
    );
};

export default React.memo(SecondaryPricingData);
