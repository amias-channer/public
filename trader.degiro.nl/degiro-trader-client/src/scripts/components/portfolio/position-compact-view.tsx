import * as React from 'react';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import isJointCashPosition from 'frontend-core/dist/services/position/is-joint-cash-position';
import ExchangeAbbr from 'frontend-core/dist/components/ui-common/exchange-abbr';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import {Position} from 'frontend-core/dist/models/product';
import {
    item,
    underlinedItem,
    primaryContentAsColumn,
    primaryContentTitle,
    secondaryContentAsColumn,
    secondaryContentTitle,
    subContent
} from '../list/list.css';
import {positionsListItem} from './portfolio.css';
import Swipeable, {SwipePosition} from '../swipeable';
import {OnSwipeHandler} from '../swipeable/hooks/use-swipeable-items';
import SwipeableProductActions from '../swipeable/swipeable-product-actions';
import SwipeableTradingActions from '../swipeable/swipeable-trading-actions';
import PositionName from './position-name';
import {nbsp, valuesDelimiter} from '../value';
import Price from '../value/price';
import {PositionFields} from './positions-table-columns';
import NumericValue from '../value/numeric';
import Amount from '../value/amount';
import AbsoluteDifference from '../value/absolute-difference';
import RelativeDifference from '../value/relative-difference';
import getPositionProductLinkId from '../../services/product/get-position-product-link-id';
import PositionUpdates from '../products-observer/position-updates';
import {PositionUpdateField} from '../../hooks/use-position-updates';
import {ConfigContext} from '../app-component/app-context';
import {PositionTypeIds} from './position-types';

export type ItemClickHandler = (position: Position, event: React.MouseEvent<HTMLDivElement>) => void;
interface Props {
    arePositionValuesSwitched: boolean;
    onAction?: () => void;
    onClick: ItemClickHandler;
    onSwipe?: OnSwipeHandler;
    position: Position;
    positionTypeId: PositionTypeIds;
    swipePosition?: SwipePosition;
}

const {useCallback, useContext, useMemo} = React;
const totalValueFormatting: NumberFormattingOptions = {preset: 'amount', roundSize: 2};
const positionUpdatesFields: PositionUpdateField[] = [
    PositionFields.PRICE,
    PositionFields.BREAK_EVEN_PRICE,
    PositionFields.QUANTITY,
    PositionFields.BALANCE_PARTICIPATIONS,
    PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY,
    PositionFields.TOTAL_VALUE,
    PositionFields.REALIZED_PL,
    PositionFields.UNREALIZED_PL,
    PositionFields.UNREALIZED_RELATIVE_PL,
    PositionFields.CASH_FUND_TOTAL_RESULT,
    PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF,
    PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF,
    PositionFields.TODAY_ABSOLUTE_DIFF,
    PositionFields.TODAY_RELATIVE_DIFF
];
const PositionCompactView = React.memo<Props>(
    ({arePositionValuesSwitched, onAction, onClick, onSwipe, position, positionTypeId, swipePosition}) => {
        const {productInfo} = position;
        const {exchange} = productInfo;
        const positionId: string = String(position.id);
        const productCurrencySymbolPrefix: string = `${getCurrencySymbol(productInfo.currency)}${nbsp}`;
        const isJointCash: boolean = isJointCashPosition(position);
        const productLinkId: number | string | void = getPositionProductLinkId(position);
        const hasProductLink: boolean = productLinkId !== undefined;
        const {baseCurrency} = useContext(ConfigContext);
        const baseCurrencyPrefix: string = useMemo(() => `${getCurrencySymbol(baseCurrency)}${nbsp}`, [baseCurrency]);
        const handleSwipe = useCallback((position: SwipePosition) => onSwipe?.(positionId, position), [
            onSwipe,
            positionId
        ]);
        const areAllPositionsInactive: boolean = positionTypeId === PositionTypeIds.INACTIVE;
        const plField: PositionFields = areAllPositionsInactive
            ? PositionFields.REALIZED_PL
            : PositionFields.UNREALIZED_PL;

        return (
            <Swipeable
                leadingActions={
                    // Don't add swipeable product actions to "hidden" products, e.g. cash funds
                    hasProductLink ? <SwipeableProductActions onAction={onAction} productInfo={productInfo} /> : null
                }
                trailingActions={
                    // Don't add swipeable trading actions to "hidden" products, e.g. cash funds
                    hasProductLink ? <SwipeableTradingActions onAction={onAction} productInfo={productInfo} /> : null
                }
                onSwipe={handleSwipe}
                position={swipePosition}>
                <PositionUpdates position={position} fields={positionUpdatesFields}>
                    {(values) => (
                        <div
                            className={positionsListItem}
                            onClick={(event) => onClick(position, event)}
                            data-id={positionId}>
                            <div className={`${item} ${underlinedItem}`}>
                                <div className={primaryContentAsColumn}>
                                    <PositionName className={primaryContentTitle} position={position} />
                                    <div className={subContent} data-name="positionDetails">
                                        {exchange && <ExchangeAbbr exchange={exchange} />}
                                        {exchange && valuesDelimiter}
                                        <Price
                                            id={positionId}
                                            key="positionPrice"
                                            highlightValueChange={true}
                                            prefix={productCurrencySymbolPrefix}
                                            field={PositionFields.PRICE}
                                            value={values[PositionFields.PRICE]}
                                        />
                                        {arePositionValuesSwitched ? ' ' : ' × '}
                                        {arePositionValuesSwitched ? (
                                            !areAllPositionsInactive && (
                                                <Price
                                                    id={positionId}
                                                    key="positionBreakEvenPrice"
                                                    prefix={productCurrencySymbolPrefix}
                                                    field={PositionFields.BREAK_EVEN_PRICE}
                                                    value={values[PositionFields.BREAK_EVEN_PRICE]}
                                                />
                                            )
                                        ) : isJointCash ? (
                                            <NumericValue
                                                value={values[PositionFields.BALANCE_PARTICIPATIONS]}
                                                id={positionId}
                                                key="quantity"
                                                field={PositionFields.BALANCE_PARTICIPATIONS}
                                            />
                                        ) : (
                                            <NumericValue
                                                value={values[PositionFields.QUANTITY]}
                                                id={positionId}
                                                key="quantity"
                                                field={PositionFields.QUANTITY}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div data-name="valuesSwitch" className={secondaryContentAsColumn}>
                                    {isJointCash ? (
                                        <Amount
                                            id={positionId}
                                            className={secondaryContentTitle}
                                            prefix={baseCurrencyPrefix}
                                            field={PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY}
                                            value={values[PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY]}
                                        />
                                    ) : (
                                        <NumericValue
                                            id={positionId}
                                            className={secondaryContentTitle}
                                            prefix={baseCurrencyPrefix}
                                            field={PositionFields.TOTAL_VALUE}
                                            formatting={totalValueFormatting}
                                            value={values[PositionFields.TOTAL_VALUE]}
                                        />
                                    )}
                                    <div className={subContent}>
                                        {arePositionValuesSwitched ? (
                                            isJointCash ? (
                                                <Amount
                                                    id={positionId}
                                                    prefix={baseCurrencyPrefix}
                                                    field={PositionFields.CASH_FUND_TOTAL_RESULT}
                                                    highlightValueBySign={true}
                                                    value={values[PositionFields.CASH_FUND_TOTAL_RESULT]}
                                                />
                                            ) : (
                                                <Amount
                                                    id={positionId}
                                                    prefix={baseCurrencyPrefix}
                                                    field={plField}
                                                    highlightValueBySign={true}
                                                    value={values[plField]}
                                                />
                                            )
                                        ) : isJointCash ? (
                                            <AbsoluteDifference
                                                id={positionId}
                                                field={PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF}
                                                value={values[PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF]}
                                            />
                                        ) : (
                                            <AbsoluteDifference
                                                id={positionId}
                                                field={PositionFields.TODAY_ABSOLUTE_DIFF}
                                                value={values[PositionFields.TODAY_ABSOLUTE_DIFF]}
                                            />
                                        )}{' '}
                                        {arePositionValuesSwitched ? (
                                            !areAllPositionsInactive &&
                                            !isJointCash && (
                                                <RelativeDifference
                                                    id={positionId}
                                                    brackets={true}
                                                    field={PositionFields.UNREALIZED_RELATIVE_PL}
                                                    value={values[PositionFields.UNREALIZED_RELATIVE_PL]}
                                                />
                                            )
                                        ) : isJointCash ? (
                                            <RelativeDifference
                                                id={positionId}
                                                brackets={true}
                                                field={PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF}
                                                value={values[PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF]}
                                            />
                                        ) : (
                                            <RelativeDifference
                                                id={positionId}
                                                brackets={true}
                                                field={PositionFields.TODAY_RELATIVE_DIFF}
                                                value={values[PositionFields.TODAY_RELATIVE_DIFF]}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </PositionUpdates>
            </Swipeable>
        );
    }
);

PositionCompactView.displayName = 'PositionCompactView';

export default PositionCompactView;
