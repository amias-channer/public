import {BarChartPoint} from '../../models/chart';
import {
    FinancialStatementItem,
    StatementCode,
    StatementItemsDict,
    UnifiedStatementPeriod
} from '../../models/financial-statement';

const pickStatementValues = (statement: StatementItemsDict, codes: StatementCode[]): (number | undefined)[] => {
    return codes.map((code) => {
        const statementItem: FinancialStatementItem | undefined = statement[code];

        return statementItem ? statementItem.value * 1_000_000 : undefined;
    });
};

export default function convertStatementsToChartPoints(
    statementPeriod: UnifiedStatementPeriod[],
    codesToPick: StatementCode[]
): BarChartPoint[] {
    return statementPeriod.map((statementGroup: UnifiedStatementPeriod) => {
        const allItems = {...statementGroup.BAL.items, ...statementGroup.INC.items, ...statementGroup.CAS.items};
        const statementItems = pickStatementValues(allItems, codesToPick);

        return {
            groupName: statementGroup.periodName,
            groupValues: statementItems
        };
    });
}
