import omitNullable from 'frontend-core/dist/utils/omit-nullable';
import {
    Estimates,
    MeasureCode,
    MeasureItemDataValue,
    MeasurePeriodItem,
    MeasuresDict,
    PeriodGroup,
    SectionType,
    SectionTypes,
    sortedSections,
    Statement,
    StatementItem,
    UnifiedEstimates
} from '../../models/analyst-views';

function getPeriodStatementsTypes(periodGroup: PeriodGroup[]): Statement['type'][] {
    return periodGroup.reduce((allStatementsTypes: string[], {statements}: PeriodGroup) => {
        return [...allStatementsTypes, ...statements.map((statement: Statement) => statement.type)];
    }, []);
}

function getAvailableSections(estimates: Estimates): string[] {
    const {annual = [], interim = []} = estimates;
    const annualStatementsTypes: Statement['type'][] = getPeriodStatementsTypes(annual);
    const interimStatementsTypes: Statement['type'][] = getPeriodStatementsTypes(interim);

    return [...new Set<string>([...annualStatementsTypes, ...interimStatementsTypes])];
}

function isSectionAvailable(availableSections: string[], sectionType: SectionType): boolean {
    return availableSections.some((availableSectionType: string) => availableSectionType === sectionType);
}

function getMeasureItemDataValues(measureItemData: MeasurePeriodItem[]): MeasureItemDataValue[] {
    return measureItemData.map((item: MeasurePeriodItem) => item.value);
}

function getMeasureItemsPeriodData(periodGroup: PeriodGroup[], code: MeasureCode): MeasurePeriodItem[] {
    return periodGroup.map((value: PeriodGroup) => {
        const {year, periodType} = value;
        const statement: Statement | undefined = value.statements.find((statement: Statement) => {
            return statement.items.some((item: StatementItem) => item.code === code);
        });
        const statementItem: StatementItem | undefined = statement?.items.find(
            (item: StatementItem) => item.code === code
        );

        return {
            year,
            periodType,
            value: statementItem?.value,
            measureName: statementItem?.name
        };
    });
}

function getSectionMeasuresData({annual = [], interim = []}: Estimates, sectionType: SectionTypes): MeasuresDict {
    const sectionMeasureCodes: MeasureCode[] = sortedSections[sectionType];

    return sectionMeasureCodes.reduce((measures, code) => {
        const annualMeasureItemData: MeasurePeriodItem[] = getMeasureItemsPeriodData(annual, code);
        const interimMeasureItemData: MeasurePeriodItem[] = getMeasureItemsPeriodData(interim, code);
        const annualMeasureItemDataValues: MeasureItemDataValue[] = getMeasureItemDataValues(annualMeasureItemData);
        const interimMeasureItemDataValues: MeasureItemDataValue[] = getMeasureItemDataValues(interimMeasureItemData);

        if (omitNullable(annualMeasureItemDataValues).length || omitNullable(interimMeasureItemDataValues).length) {
            measures[code] = {
                annual: annualMeasureItemData,
                interim: interimMeasureItemData
            };
        }

        return measures;
    }, {} as MeasuresDict);
}

export default function getUnifiedProductEstimates(estimates?: Estimates): UnifiedEstimates | undefined {
    if (!estimates || !Object.keys(estimates).length) {
        return;
    }
    const availableSections: string[] = getAvailableSections(estimates);

    return {
        preferredMeasure: estimates.preferredMeasure,
        currency: estimates.currency,
        lastUpdated: estimates.lastUpdated ? new Date(estimates.lastUpdated) : undefined,
        interim: estimates.interim,
        annual: estimates.annual,
        sections: {
            [SectionTypes.INC]: isSectionAvailable(availableSections, 'Income Statement')
                ? {
                      type: 'Income Statement',
                      measures: getSectionMeasuresData(estimates, SectionTypes.INC)
                  }
                : undefined,
            [SectionTypes.BAL]: isSectionAvailable(availableSections, 'Balance Sheet')
                ? {
                      type: 'Balance Sheet',
                      measures: getSectionMeasuresData(estimates, SectionTypes.BAL)
                  }
                : undefined,
            [SectionTypes.CASH]: isSectionAvailable(availableSections, 'Cash Flow Statement')
                ? {
                      type: 'Cash Flow Statement',
                      measures: getSectionMeasuresData(estimates, SectionTypes.CASH)
                  }
                : undefined,
            [SectionTypes.VAL]: isSectionAvailable(availableSections, 'Valuation')
                ? {
                      type: 'Valuation',
                      measures: getSectionMeasuresData(estimates, SectionTypes.VAL)
                  }
                : undefined
        }
    };
}
