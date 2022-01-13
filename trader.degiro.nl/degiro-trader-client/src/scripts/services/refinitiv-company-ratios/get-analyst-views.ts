import {BarChartPoint} from '../../models/chart';
import {
    OpinionDescriptions,
    OpinionPeriodTypes,
    RefinitivCompanyRatios,
    OpinionItem
} from '../../models/refinitiv-company-profile';

const opinionPositions: Partial<Record<OpinionDescriptions, number>> = {
    [OpinionDescriptions.SELL]: 0,
    [OpinionDescriptions.UNDERPERFORM]: 1,
    [OpinionDescriptions.HOLD]: 2,
    [OpinionDescriptions.OUTPERFORM]: 3,
    [OpinionDescriptions.BUY]: 4
};

function getGroupNameFromPeriod(periodType: OpinionPeriodTypes): string {
    if (periodType === OpinionPeriodTypes.CURR) {
        return 'CUR';
    }

    return periodType;
}

export default function getAnalystViews(companyRatios: RefinitivCompanyRatios): BarChartPoint[] {
    const opinions: OpinionItem[] | undefined = companyRatios.consRecommendationTrend?.opinions;

    if (!opinions) {
        return [];
    }

    const opinionsDict: Partial<Record<OpinionPeriodTypes, number[]>> = {
        [OpinionPeriodTypes.CURR]: [0, 0, 0, 0, 0],
        [OpinionPeriodTypes['1WA']]: [0, 0, 0, 0, 0],
        [OpinionPeriodTypes['1MA']]: [0, 0, 0, 0, 0],
        [OpinionPeriodTypes['2MA']]: [0, 0, 0, 0, 0],
        [OpinionPeriodTypes['3MA']]: [0, 0, 0, 0, 0]
    };

    opinions.forEach((opinion) => {
        const opinionPosition: number | undefined = opinionPositions[opinion.opinionDescription];

        if (opinionPosition === undefined) {
            return;
        }

        opinion.periods.forEach(({periodType, value}) => {
            const opinionDictItem: number[] | undefined = opinionsDict[periodType];

            if (opinionDictItem) {
                opinionDictItem[opinionPosition] = value;
            }
        });
    });

    return Object.entries(opinionsDict).map(([period, groupValues]) => ({
        groupName: getGroupNameFromPeriod(period as OpinionPeriodTypes),
        groupValues: groupValues!
    }));
}
