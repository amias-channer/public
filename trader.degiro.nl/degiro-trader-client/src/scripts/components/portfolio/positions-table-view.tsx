import ExchangeAbbr from 'frontend-core/dist/components/ui-common/exchange-abbr';
import ItemDetailsIcon from 'frontend-core/dist/components/ui-trader4/icon/item-details-icon';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {Position} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';
import {PositionUpdateField} from '../../hooks/use-position-updates';
import {largeViewportMinWidth as fullColumnsLayoutMediaQuery} from '../../media-queries';
import getPositionProductLinkId from '../../services/product/get-position-product-link-id';
import {nonClickableAreaAttrs} from '../clickable-area/non-clickable-area';
import TableHeadSortableColumn from '../data-table/table-head-sortable-column';
import FeedQualityIcon from '../feed-quality/icon';
import FeedQuality from '../feed-quality/index';
import PositionUpdates from '../products-observer/position-updates';
import {
    cell,
    currencyCell,
    detailsIconCell,
    exchangeCell,
    feedQualityCell,
    headerCell,
    inlineEndContentCell,
    priceCell,
    productNameCell,
    row,
    selectableRow,
    startStickyCell,
    stickyCellContent,
    stickyCellTableWrapper,
    table as tableClassName
} from '../table/table.css';
import {nbsp} from '../value';
import AbsoluteDifference from '../value/absolute-difference';
import Amount from '../value/amount';
import DateValue, {defaultFullTimeValueFormat} from '../value/date';
import NumericValue from '../value/numeric';
import Price from '../value/price';
import RelativeDifference from '../value/relative-difference';
import PositionNameCellContent from './position-name-cell-content';
import {PositionTypeIds} from './position-types';
import {PositionsViewProps} from './positions';
import {getPositionsTableColumns, PositionFields} from './positions-table-columns';

export interface TableHeadCells extends Partial<Record<PositionFields, React.ReactNode>> {
    productName: React.ReactNode;
}

interface Props
    extends Pick<
        PositionsViewProps,
        'filters' | 'positions' | 'productType' | 'positionType' | 'onSort' | 'onPositionItemClick'
    > {
    hasTradingButtons: boolean;
    tableHeadCells: TableHeadCells;
}

const {useMemo} = React;
const totalValueFormatting: NumberFormattingOptions = {preset: 'amount', roundSize: 2};
const PositionsTableView = React.memo<Props>(
    ({
        positions,
        productType,
        positionType,
        filters: {orderBy: orderByValue},
        onSort,
        onPositionItemClick,
        hasTradingButtons,
        tableHeadCells
    }) => {
        const productTypeId: ProductTypeIds = productType.id;
        const positionTypeId: PositionTypeIds = positionType.id;
        const columns = useMemo<PositionFields[]>(() => getPositionsTableColumns(productType, positionTypeId), [
            productType,
            positionTypeId
        ]);
        const hasCompactColumnsLayout = !useMediaQuery(fullColumnsLayoutMediaQuery);
        const hasLastUpdateColumn = !hasCompactColumnsLayout;
        const hasExchangeColumn = !hasCompactColumnsLayout && columns.includes(PositionFields.EXCHANGE);
        const hasBreakEvenPriceColumn = columns.includes(PositionFields.BREAK_EVEN_PRICE);
        const hasTotalResultColumn = columns.includes(PositionFields.TOTAL_RESULT);
        const hasQuantityColumn = columns.includes(PositionFields.QUANTITY);
        const hasPriceColumn = columns.includes(PositionFields.PRICE);
        const hasCurrencyColumn = columns.includes(PositionFields.CURRENCY);
        const hasAccruedInterestColumn = columns.includes(PositionFields.ACCRUED_INTEREST);
        const hasExposureColumn = columns.includes(PositionFields.EXPOSURE);
        const hasTotalValueColumn = columns.includes(PositionFields.TOTAL_VALUE);
        const hasTodayAbsoluteDiffColumn = columns.includes(PositionFields.TODAY_ABSOLUTE_DIFF);
        const hasTodayRelativeDiffColumn = columns.includes(PositionFields.TODAY_RELATIVE_DIFF);
        const hasUnrealizedPlFieldColumn = columns.includes(PositionFields.UNREALIZED_PL);
        const hasRealizedPlFieldColumn = columns.includes(PositionFields.REALIZED_PL);
        const hasCashFundTotalValueColumn = columns.includes(PositionFields.CASH_FUND_TOTAL_VALUE);
        const hasCashFundTotalValueInBaseCurrencyColumn = columns.includes(
            PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY
        );
        const hasCashFundTodayAbsoluteDiffColumn = columns.includes(PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF);
        const hasCashFundTodayRelativeDiffColumn = columns.includes(PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF);
        const hasCashFundTotalResultColumn = columns.includes(PositionFields.CASH_FUND_TOTAL_RESULT);

        return (
            <div className={stickyCellTableWrapper} data-product-type-id={productTypeId}>
                <table className={tableClassName}>
                    <thead>
                        <tr className={row}>
                            <TableHeadSortableColumn
                                onToggle={onSort}
                                value={orderByValue}
                                className={`${productNameCell} ${startStickyCell}`}
                                field="productInfo.name">
                                {tableHeadCells.productName}
                            </TableHeadSortableColumn>
                            {hasExchangeColumn && (
                                <TableHeadSortableColumn
                                    onToggle={onSort}
                                    value={orderByValue}
                                    className={exchangeCell}
                                    field={PositionFields.EXCHANGE}>
                                    {tableHeadCells[PositionFields.EXCHANGE]}
                                </TableHeadSortableColumn>
                            )}
                            {hasQuantityColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.QUANTITY}>
                                    {tableHeadCells[PositionFields.QUANTITY]}
                                </TableHeadSortableColumn>
                            )}
                            {hasPriceColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.PRICE}>
                                    {tableHeadCells[PositionFields.PRICE]}
                                </TableHeadSortableColumn>
                            )}
                            {hasCurrencyColumn && (
                                <TableHeadSortableColumn
                                    className={currencyCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.CURRENCY}>
                                    {tableHeadCells[PositionFields.CURRENCY]}
                                </TableHeadSortableColumn>
                            )}
                            {hasAccruedInterestColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.ACCRUED_INTEREST}>
                                    {tableHeadCells[PositionFields.ACCRUED_INTEREST]}
                                </TableHeadSortableColumn>
                            )}
                            {hasExposureColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.EXPOSURE}>
                                    {tableHeadCells[PositionFields.EXPOSURE]}
                                </TableHeadSortableColumn>
                            )}
                            {hasTotalValueColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.TOTAL_VALUE}>
                                    {tableHeadCells[PositionFields.TOTAL_VALUE]}
                                </TableHeadSortableColumn>
                            )}
                            {hasBreakEvenPriceColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.BREAK_EVEN_PRICE}>
                                    {tableHeadCells[PositionFields.BREAK_EVEN_PRICE]}
                                </TableHeadSortableColumn>
                            )}
                            {hasTodayAbsoluteDiffColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.TODAY_ABSOLUTE_DIFF}>
                                    {tableHeadCells[PositionFields.TODAY_ABSOLUTE_DIFF]}
                                </TableHeadSortableColumn>
                            )}
                            {hasTodayRelativeDiffColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.TODAY_RELATIVE_DIFF}>
                                    {tableHeadCells[PositionFields.TODAY_RELATIVE_DIFF]}
                                </TableHeadSortableColumn>
                            )}
                            {hasCashFundTotalValueColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.CASH_FUND_TOTAL_VALUE}>
                                    {tableHeadCells[PositionFields.CASH_FUND_TOTAL_VALUE]}
                                </TableHeadSortableColumn>
                            )}
                            {hasCashFundTotalValueInBaseCurrencyColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY}>
                                    {tableHeadCells[PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY]}
                                </TableHeadSortableColumn>
                            )}
                            {hasCashFundTodayAbsoluteDiffColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF}>
                                    {tableHeadCells[PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF]}
                                </TableHeadSortableColumn>
                            )}
                            {hasCashFundTodayRelativeDiffColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF}>
                                    {tableHeadCells[PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF]}
                                </TableHeadSortableColumn>
                            )}
                            {hasCashFundTotalResultColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.CASH_FUND_TOTAL_RESULT}>
                                    {tableHeadCells[PositionFields.CASH_FUND_TOTAL_RESULT]}
                                </TableHeadSortableColumn>
                            )}
                            {hasUnrealizedPlFieldColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.UNREALIZED_RELATIVE_PL}>
                                    {tableHeadCells[PositionFields.UNREALIZED_RELATIVE_PL]}
                                </TableHeadSortableColumn>
                            )}
                            {hasRealizedPlFieldColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.REALIZED_PL}>
                                    {tableHeadCells[PositionFields.REALIZED_PL]}
                                </TableHeadSortableColumn>
                            )}
                            {hasTotalResultColumn && (
                                <TableHeadSortableColumn
                                    className={inlineEndContentCell}
                                    onToggle={onSort}
                                    value={orderByValue}
                                    field={PositionFields.TOTAL_RESULT}>
                                    {tableHeadCells[PositionFields.TOTAL_RESULT]}
                                </TableHeadSortableColumn>
                            )}
                            {hasLastUpdateColumn && (
                                <th className={`${headerCell} ${inlineEndContentCell}`}>
                                    {tableHeadCells[PositionFields.LAST_UPDATE]}
                                </th>
                            )}
                            <th className={`${headerCell} ${feedQualityCell}`}>
                                <FeedQualityIcon />
                            </th>
                            <th className={`${headerCell} ${detailsIconCell}`} />
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((position: Position) => {
                            const {productInfo} = position;
                            const {exchange, currency} = productInfo;
                            const positionId: string = String(position.id);
                            const productLinkId: number | string | void = getPositionProductLinkId(position);
                            const productCurrencySymbolPrefix: string = `${getCurrencySymbol(currency)}${nbsp}`;

                            return (
                                <PositionUpdates
                                    key={positionId}
                                    position={position}
                                    fields={columns as PositionUpdateField[]}>
                                    {(values) => (
                                        <tr
                                            onClick={onPositionItemClick.bind(null, position)}
                                            className={`${row} ${selectableRow}`}>
                                            <td
                                                className={`${cell} ${productNameCell} ${startStickyCell}`}
                                                {...(productLinkId == null ? undefined : nonClickableAreaAttrs)}>
                                                <div className={stickyCellContent}>
                                                    <PositionNameCellContent
                                                        position={position}
                                                        hasTradingButtons={hasTradingButtons}
                                                    />
                                                </div>
                                            </td>
                                            {hasExchangeColumn && (
                                                <td className={`${cell} ${exchangeCell}`}>
                                                    {exchange ? <ExchangeAbbr exchange={exchange} /> : null}
                                                </td>
                                            )}
                                            {hasQuantityColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <NumericValue
                                                        id={positionId}
                                                        value={values[PositionFields.QUANTITY]}
                                                        field={PositionFields.QUANTITY}
                                                    />
                                                </td>
                                            )}
                                            {hasPriceColumn && (
                                                <td className={`${cell} ${priceCell} ${inlineEndContentCell}`}>
                                                    <Price
                                                        highlightValueChange={true}
                                                        id={positionId}
                                                        prefix={productCurrencySymbolPrefix}
                                                        value={values[PositionFields.PRICE]}
                                                        field={PositionFields.PRICE}
                                                    />
                                                </td>
                                            )}
                                            {hasCurrencyColumn && (
                                                <td className={`${cell} ${currencyCell}`} data-field="currency">
                                                    {currency}
                                                </td>
                                            )}
                                            {hasAccruedInterestColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <AbsoluteDifference
                                                        id={positionId}
                                                        value={values[PositionFields.ACCRUED_INTEREST]}
                                                        field={PositionFields.ACCRUED_INTEREST}
                                                    />
                                                </td>
                                            )}
                                            {hasExposureColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <Amount
                                                        id={positionId}
                                                        value={values[PositionFields.EXPOSURE]}
                                                        field={PositionFields.EXPOSURE}
                                                    />
                                                </td>
                                            )}
                                            {hasTotalValueColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <Amount
                                                        id={positionId}
                                                        value={values[PositionFields.TOTAL_VALUE]}
                                                        marked={true}
                                                        formatting={totalValueFormatting}
                                                        field={PositionFields.TOTAL_VALUE}
                                                    />
                                                </td>
                                            )}
                                            {hasBreakEvenPriceColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <Price
                                                        id={positionId}
                                                        value={values[PositionFields.BREAK_EVEN_PRICE]}
                                                        field={PositionFields.BREAK_EVEN_PRICE}
                                                    />
                                                </td>
                                            )}
                                            {hasTodayAbsoluteDiffColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <AbsoluteDifference
                                                        id={positionId}
                                                        value={values[PositionFields.TODAY_ABSOLUTE_DIFF]}
                                                        field={PositionFields.TODAY_ABSOLUTE_DIFF}
                                                    />
                                                </td>
                                            )}
                                            {hasTodayRelativeDiffColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <RelativeDifference
                                                        id={positionId}
                                                        value={values[PositionFields.TODAY_RELATIVE_DIFF]}
                                                        field={PositionFields.TODAY_RELATIVE_DIFF}
                                                    />
                                                </td>
                                            )}
                                            {hasCashFundTotalValueColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <Amount
                                                        id={positionId}
                                                        value={values[PositionFields.CASH_FUND_TOTAL_VALUE]}
                                                        marked={true}
                                                        prefix={productCurrencySymbolPrefix}
                                                        field={PositionFields.CASH_FUND_TOTAL_VALUE}
                                                    />
                                                </td>
                                            )}
                                            {hasCashFundTotalValueInBaseCurrencyColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <Amount
                                                        id={positionId}
                                                        value={
                                                            values[
                                                                PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY
                                                            ]
                                                        }
                                                        field={PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY}
                                                    />
                                                </td>
                                            )}
                                            {hasCashFundTodayAbsoluteDiffColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <AbsoluteDifference
                                                        id={positionId}
                                                        value={values[PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF]}
                                                        field={PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF}
                                                    />
                                                </td>
                                            )}
                                            {hasCashFundTodayRelativeDiffColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <RelativeDifference
                                                        id={positionId}
                                                        value={values[PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF]}
                                                        field={PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF}
                                                    />
                                                </td>
                                            )}
                                            {hasCashFundTotalResultColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <AbsoluteDifference
                                                        id={positionId}
                                                        value={values[PositionFields.CASH_FUND_TOTAL_RESULT]}
                                                        field={PositionFields.CASH_FUND_TOTAL_RESULT}
                                                    />
                                                </td>
                                            )}
                                            {hasUnrealizedPlFieldColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <AbsoluteDifference
                                                        id={positionId}
                                                        value={values[PositionFields.UNREALIZED_PL]}
                                                        field={PositionFields.UNREALIZED_PL}
                                                    />
                                                    {nbsp}
                                                    <RelativeDifference
                                                        id={positionId}
                                                        value={values[PositionFields.UNREALIZED_RELATIVE_PL]}
                                                        brackets={true}
                                                        field={PositionFields.UNREALIZED_RELATIVE_PL}
                                                    />
                                                </td>
                                            )}
                                            {hasRealizedPlFieldColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <AbsoluteDifference
                                                        id={positionId}
                                                        value={values[PositionFields.REALIZED_PL]}
                                                        field={PositionFields.REALIZED_PL}
                                                    />
                                                </td>
                                            )}
                                            {hasTotalResultColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <AbsoluteDifference
                                                        id={positionId}
                                                        value={values[PositionFields.TOTAL_RESULT]}
                                                        field={PositionFields.TOTAL_RESULT}
                                                    />
                                                </td>
                                            )}
                                            {hasLastUpdateColumn && (
                                                <td className={`${cell} ${inlineEndContentCell}`}>
                                                    <DateValue
                                                        value={values[PositionFields.LAST_UPDATE]}
                                                        id={positionId}
                                                        onlyTodayTime={true}
                                                        timeFormat={defaultFullTimeValueFormat}
                                                        field={PositionFields.LAST_UPDATE}
                                                    />
                                                </td>
                                            )}
                                            <td className={`${cell} ${feedQualityCell}`}>
                                                <FeedQuality productInfo={productInfo} />
                                            </td>
                                            <td className={`${cell} ${detailsIconCell}`}>
                                                <ItemDetailsIcon />
                                            </td>
                                        </tr>
                                    )}
                                </PositionUpdates>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
);

PositionsTableView.displayName = 'PositionsTableView';

export default PositionsTableView;
