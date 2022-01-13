import {
    KeyCurrentRatios,
    keyCurrentRatiosIds,
    KeyFigures,
    KeyForecastData,
    keyForecastDataIds,
    KeyInterimIncomeStatementData,
    keyInterimIncomeStatementDataIds
} from '../../models/analyst-views';
import {
    StatementCode,
    StatementItemsDict,
    StatementPeriodTypes,
    StatementTypes,
    UnifiedStatements,
    UnifiedStatementPeriod
} from '../../models/financial-statement';
import {RatiosGroup, RatioItem, RefinitivCompanyRatios} from '../../models/refinitiv-company-profile';

function getLatestKeyFinancialStatementData<T extends StatementCode>(
    financialStatements: UnifiedStatements,
    ids: readonly T[],
    statementPeriodType: StatementPeriodTypes,
    statementType: StatementTypes
): {[P in T]?: number} {
    const financialStatementsByPeriodType: UnifiedStatementPeriod[] = financialStatements[statementPeriodType];

    if (financialStatementsByPeriodType.length < 1) {
        return {};
    }

    const latestFinancialStatementData: StatementItemsDict =
        financialStatementsByPeriodType[financialStatementsByPeriodType.length - 1][statementType].items;

    return ids.reduce((latestKeyFinancialStatementData: {[P in T]?: number}, id: T) => {
        const value = latestFinancialStatementData[id]?.value;

        return {
            ...latestKeyFinancialStatementData,
            [id]: value && value * 1000000
        };
    }, {});
}

function aggregateRatios<T extends string>(ratioItems: RatioItem[], ids: readonly T[]): {[P in T]?: number} {
    const ratios: {[P in T]?: number} = {};

    ratioItems.forEach((ratioItem: RatioItem) => {
        const ratioItemId = ratioItem.id as T;

        if (ids.includes(ratioItemId)) {
            ratios[ratioItemId] = Number(ratioItem.value) || undefined;
        }
    });

    return ratios;
}

export default function getKeyFiguresFromCompanyRatiosAndFinancialStatements(
    companyRatios: RefinitivCompanyRatios,
    financialStatements: UnifiedStatements
): KeyFigures {
    const {currentRatios, forecastData} = companyRatios;
    const keyCurrentRatios: KeyCurrentRatios = (currentRatios?.ratiosGroups || []).reduce(
        (ratios: KeyCurrentRatios, ratiosGroup: RatiosGroup) => ({
            ...ratios,
            ...aggregateRatios(ratiosGroup.items, keyCurrentRatiosIds)
        }),
        {}
    );
    const keyForecastData: KeyForecastData = aggregateRatios(forecastData?.ratios || [], keyForecastDataIds);
    const keyInterimIncomeStatementData: KeyInterimIncomeStatementData = getLatestKeyFinancialStatementData(
        financialStatements,
        keyInterimIncomeStatementDataIds,
        StatementPeriodTypes.QUARTER,
        StatementTypes.INCOME
    );

    return {
        ...keyCurrentRatios,
        ...keyForecastData,
        ...keyInterimIncomeStatementData
    };
}
