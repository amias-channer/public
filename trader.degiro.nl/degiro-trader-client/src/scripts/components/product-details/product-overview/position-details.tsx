import {Position, PositionId, ProductInfo} from 'frontend-core/dist/models/product';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import localize from 'frontend-core/dist/services/i18n/localize';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {line, lineTopSeparator} from '../../../../styles/details-overview.css';
import useProductPosition from '../../../hooks/use-product-position';
import {I18nContext} from '../../app-component/app-context';
import {PositionFields} from '../../portfolio/positions-table-columns';
import CardRowWithTooltip from '../../product-details/card-row-with-tooltip';
import AbsoluteDifference from '../../value/absolute-difference';
import {nbsp} from '../../value/index';
import NumericValue from '../../value/numeric';
import Price from '../../value/price';
import TooltipDescriptionLine from '../product-details-hint/tooltip-description-line';
import pricingTooltips from '../tooltips-data/refinitiv-pricing-tooltips';

interface Props {
    productInfo: ProductInfo;
    className?: string;
}

const {useContext} = React;
const PositionDetails: React.FunctionComponent<Props> = ({className, productInfo}) => {
    const i18n = useContext(I18nContext);
    const position: Position | undefined = useProductPosition(productInfo);

    if (!position || !position.isActive) {
        return null;
    }

    const isPointerDevice = !isTouchDevice();
    const positionId: PositionId = position.id;

    return (
        <dl data-name="positionDetails" className={className}>
            <CardRowWithTooltip
                className={`${line} ${lineTopSeparator}`}
                label={localize(i18n, 'trader.productDetails.positionDetails.position')}
                tooltip={
                    isPointerDevice && (
                        <TooltipDescriptionLine
                            title={pricingTooltips.valueInProductCurrency.title}
                            content={pricingTooltips.valueInProductCurrency.content}
                        />
                    )
                }>
                <Price
                    value={position.valueInProductCurrency}
                    id={positionId}
                    prefix={`${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                    field="valueInProductCurrency"
                />{' '}
                <NumericValue
                    id={positionId}
                    value={position[PositionFields.QUANTITY]}
                    field={PositionFields.QUANTITY}
                    prefix={`${localize(i18n, 'trader.paymentDetails.quantityUnits')}${nbsp}`}
                    brackets={true}
                />
            </CardRowWithTooltip>
            <CardRowWithTooltip
                className={line}
                label={localize(i18n, 'trader.productDetails.breakEvenPrice')}
                tooltip={
                    isPointerDevice && (
                        <TooltipDescriptionLine
                            title={pricingTooltips.breakEvenPrice.title}
                            content={pricingTooltips.breakEvenPrice.content}
                        />
                    )
                }>
                <Price
                    id={positionId}
                    field={PositionFields.BREAK_EVEN_PRICE}
                    value={position[PositionFields.BREAK_EVEN_PRICE]}
                />
            </CardRowWithTooltip>
            <CardRowWithTooltip
                className={line}
                label={localize(i18n, 'trader.portfolio.absoluteDifference')}
                tooltip={
                    isPointerDevice && (
                        <TooltipDescriptionLine
                            title={pricingTooltips.todayPL.title}
                            content={pricingTooltips.todayPL.content}
                        />
                    )
                }>
                <AbsoluteDifference
                    id={positionId}
                    value={position[PositionFields.TODAY_ABSOLUTE_DIFF]}
                    field={PositionFields.TODAY_ABSOLUTE_DIFF}
                />
            </CardRowWithTooltip>
            <CardRowWithTooltip
                className={line}
                label={localize(i18n, 'trader.portfolio.unrealizedPlColumn')}
                tooltip={
                    isPointerDevice && (
                        <TooltipDescriptionLine
                            title={pricingTooltips.unrealisedPL.title}
                            content={pricingTooltips.unrealisedPL.content}
                        />
                    )
                }>
                <AbsoluteDifference
                    id={positionId}
                    value={position[PositionFields.UNREALIZED_PL]}
                    field={PositionFields.UNREALIZED_PL}
                />
            </CardRowWithTooltip>
            <CardRowWithTooltip
                className={line}
                label={localize(i18n, 'trader.portfolio.totalResultColumn')}
                tooltip={
                    isPointerDevice && (
                        <TooltipDescriptionLine
                            title={pricingTooltips.totalPL.title}
                            content={pricingTooltips.totalPL.content}
                        />
                    )
                }>
                <AbsoluteDifference
                    id={positionId}
                    value={position[PositionFields.TOTAL_RESULT]}
                    field={PositionFields.TOTAL_RESULT}
                />
            </CardRowWithTooltip>
        </dl>
    );
};

export default React.memo<Props>(PositionDetails);
