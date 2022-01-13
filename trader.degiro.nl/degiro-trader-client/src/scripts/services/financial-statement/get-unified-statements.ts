import {
    AnnualStatements,
    FinancialStatement,
    FinancialStatementItem,
    FinancialStatements,
    QuarterlyStatements,
    StatementItemsDict,
    StatementsByPeriod,
    StatementPeriodTypes,
    UnifiedStatementPeriod,
    StatementTypes,
    UnifiedStatementPeriodItem,
    UnifiedStatements
} from '../../models/financial-statement';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric'
});
const defaultStatementPeriodItem: UnifiedStatementPeriodItem = {items: {}, source: ''};
const sortAnnualStatements = (statements: AnnualStatements[]) => statements.sort((a, b) => a.fiscalYear - b.fiscalYear);
const sortQuarterlyStatements = (statements: QuarterlyStatements[]) =>
    statements.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
const convertStatementsToDict = (items: FinancialStatementItem[]): StatementItemsDict => {
    return items.reduce((statementItems: StatementItemsDict, item: FinancialStatementItem) => {
        statementItems[item.code] = {...item};
        return statementItems;
    }, {});
};
const convertStatementsToUnifiedStatementPeriod = (
    period: StatementsByPeriod,
    periodName: string
): UnifiedStatementPeriod => {
    const unifiedPeriod: UnifiedStatementPeriod = {
        fiscalYear: period.fiscalYear,
        periodName,
        endDate: new Date(period.endDate),
        [StatementTypes.INCOME]: {...defaultStatementPeriodItem},
        [StatementTypes.BALANCE]: {...defaultStatementPeriodItem},
        [StatementTypes.CASH_FLOW]: {...defaultStatementPeriodItem}
    };

    return period.statements.reduce((period: UnifiedStatementPeriod, statement: FinancialStatement) => {
        period[statement.type] = {
            items: convertStatementsToDict(statement.items),
            periodLength: statement.periodLength,
            source: statement.source,
            periodType: statement.periodType
        };
        return period;
    }, unifiedPeriod);
};

export default function getUnifiedStatements(statements?: FinancialStatements): UnifiedStatements {
    const yearlyStatements: UnifiedStatementPeriod[] = sortAnnualStatements(
        statements?.annual || []
    ).map((period: StatementsByPeriod) => convertStatementsToUnifiedStatementPeriod(period, String(period.fiscalYear)));
    const quarterlyStatements: UnifiedStatementPeriod[] = sortQuarterlyStatements(
        statements?.interim || []
    ).map((period: StatementsByPeriod) =>
        convertStatementsToUnifiedStatementPeriod(period, dateFormatter.format(new Date(period.endDate)))
    );

    return {
        [StatementPeriodTypes.YEAR]: yearlyStatements,
        [StatementPeriodTypes.QUARTER]: quarterlyStatements,
        currency: statements?.currency
    };
}
