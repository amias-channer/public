import {ProductType, ProductTypeIds} from 'frontend-core/dist/models/product-type';
import {PositionTypeIds} from './position-types';

export enum PositionFields {
    ACCRUED_INTEREST = 'accruedInterest',
    BALANCE_PARTICIPATIONS = 'balanceParticipations',
    BREAK_EVEN_PRICE = 'breakEvenPrice',
    CASH_FUND_TODAY_ABSOLUTE_DIFF = 'todayResult',
    CASH_FUND_TODAY_RELATIVE_DIFF = 'todayRelativeResult',
    CASH_FUND_TOTAL_RESULT = 'totalResult',
    CASH_FUND_TOTAL_VALUE = 'totalValue',
    CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY = 'totalValueInBaseCurrency',
    CURRENCY = 'productInfo.currency',
    EXCHANGE = 'productInfo.exchange.hiqAbbr',
    EXPOSURE = 'exposure',
    LAST_UPDATE = 'lastUpdate',
    PRICE = 'price',
    QUANTITY = 'size',
    REALIZED_PL = 'realizedPl',
    TODAY_ABSOLUTE_DIFF = 'todayPl',
    TODAY_RELATIVE_DIFF = 'change',
    TOTAL_RESULT = 'totalPl',
    TOTAL_VALUE = 'value',
    UNREALIZED_FX_PL = 'unrealizedFxPl',
    UNREALIZED_PL = 'unrealizedPl',
    UNREALIZED_PRODUCT_PL = 'unrealizedProductPl',
    UNREALIZED_RELATIVE_PL = 'unrealizedRelativePl'
}

export function getPositionsTableColumns(productType: ProductType, positionTypeId: PositionTypeIds): PositionFields[] {
    const productTypeId: number = productType.id;
    const columns: PositionFields[] = [];

    if (productTypeId === ProductTypeIds.CASH) {
        columns.push(
            PositionFields.CASH_FUND_TOTAL_VALUE,
            PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY,
            PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF,
            PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF,
            PositionFields.CASH_FUND_TOTAL_RESULT,
            PositionFields.LAST_UPDATE
        );
    } else {
        const isBond: boolean = productTypeId === ProductTypeIds.BOND;
        const isFutureOrCfd: boolean = productTypeId === ProductTypeIds.FUTURE || productTypeId === ProductTypeIds.CFD;

        columns.push(
            PositionFields.EXCHANGE,
            PositionFields.QUANTITY,
            PositionFields.PRICE,
            PositionFields.CURRENCY,
            ...(isBond ? [PositionFields.ACCRUED_INTEREST] : []),
            isFutureOrCfd ? PositionFields.EXPOSURE : PositionFields.TOTAL_VALUE,
            PositionFields.BREAK_EVEN_PRICE,
            PositionFields.TODAY_ABSOLUTE_DIFF,
            PositionFields.TODAY_RELATIVE_DIFF,
            ...(positionTypeId === PositionTypeIds.INACTIVE
                ? [PositionFields.REALIZED_PL]
                : [PositionFields.UNREALIZED_PL, PositionFields.UNREALIZED_RELATIVE_PL]),
            PositionFields.TOTAL_RESULT,
            PositionFields.LAST_UPDATE
        );
    }

    return columns;
}
