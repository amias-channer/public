import {BarChartPoint} from '../../models/chart';
import {StatementCode, StatementTypes, UnifiedStatementPeriod} from '../../models/financial-statement';
import convertStatementsToChartPoints from './convert-statements-to-chart-points';

function findFirstAvailableCode(
    statements: UnifiedStatementPeriod[],
    codes: StatementCode[]
): StatementCode | undefined {
    return codes.find((code: StatementCode) => {
        return statements.some((statement: UnifiedStatementPeriod) => {
            const allItems = {
                ...statement.BAL.items,
                ...statement.INC.items,
                ...statement.CAS.items
            };

            return code in allItems;
        });
    });
}

const hasAllCodes = (codes: (StatementCode | undefined)[]): codes is StatementCode[] =>
    codes.every((code) => code != null);

function getCodesByStatementType(statements: UnifiedStatementPeriod[], statementType: StatementTypes): StatementCode[] {
    let codes: (StatementCode | undefined)[];

    switch (statementType) {
        case StatementTypes.INCOME: {
            codes = [
                findFirstAvailableCode(statements, ['RTLR', 'SIIB']),
                findFirstAvailableCode(statements, ['NINC'])
            ];
            break;
        }
        case StatementTypes.BALANCE:
            codes = [findFirstAvailableCode(statements, ['ATOT']), findFirstAvailableCode(statements, ['LTLL'])];
            break;
        case StatementTypes.CASH_FLOW: {
            codes = [
                findFirstAvailableCode(statements, ['ACSH', 'ACAE', 'ACDB', 'SCSI']),
                findFirstAvailableCode(statements, ['SNCC'])
            ];
            break;
        }
    }
    return codes && hasAllCodes(codes) ? codes : [];
}

export default function getCompanyFinancialsChartPoints(
    statementPeriod: UnifiedStatementPeriod[],
    statementType: StatementTypes
): BarChartPoint[] {
    const codesToPick = getCodesByStatementType(statementPeriod, statementType);

    return convertStatementsToChartPoints(statementPeriod, codesToPick).slice(-4);
}
