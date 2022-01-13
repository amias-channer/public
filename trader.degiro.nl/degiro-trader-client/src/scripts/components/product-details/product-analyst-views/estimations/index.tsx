import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import {I18n} from 'frontend-core/dist/models/i18n';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {startStickyCell, startStickyCellShadowedContent, stickyCellContent} from '../../../table/table.css';
import TableShadowedWrapper from '../../../table/table-shadowed-wrapper';
import {
    row,
    headerCell,
    table as tableClassName,
    compactHeaderColumn,
    startStickyCellWithoutBorder,
    sectionHeaderCellContent
} from './estimations.css';
import {
    MeasureCode,
    MeasureData,
    PeriodGroup,
    Section,
    SectionTypes,
    sortedSections,
    UnifiedEstimates
} from '../../../../models/analyst-views';
import {I18nContext} from '../../../app-component/app-context';
import MeasureRow from './measure-row';
import NoDataMessage from '../../no-data-message/index';
import ExpandableGroupsTable from './expandable-groups-table';
import DateValue from '../../../value/date';
import useGlobalFullLayoutFlag from '../../../../hooks/use-global-full-layout-flag';
import Header from './header';
import {nbsp, valuesDelimiter} from '../../../value';
import Card from '../../../card';
import Disclaimer from '../../../disclaimer';

export type CompactLabels = [string | undefined, string | undefined];

function getInterimGroupLabels(i18n: I18n, interim: PeriodGroup[]): string[] {
    return interim.map(({year, periodType}: PeriodGroup, index: number) => {
        return index === 0
            ? localize(i18n, 'trader.productDetails.analystViews.estimations.currentLabel')
            : `${periodType.replace('TR', '')} | ${year}`;
    });
}

/**
 * @param {PeriodGroup[]} interim
 * @returns {string[]} ['Q1\`20', 'Q4\`22']
 */
function getInterimCompactLabels(interim: PeriodGroup[]): CompactLabels {
    if (!isNonEmptyArray(interim)) {
        return [undefined, undefined];
    }

    const {year, periodType}: PeriodGroup = interim[0];
    const {year: lastGroupYear, periodType: lastGroupPeriodType}: PeriodGroup = interim[interim.length - 1];

    return [
        `${periodType.replace('TR', '')}\`${year.toString().substr(-2)}`,
        `${lastGroupPeriodType.replace('TR', '')}\`${lastGroupYear.toString().substr(-2)}`
    ];
}

function getAnnualGroupLabels(i18n: I18n, annual: PeriodGroup[]): string[] {
    return annual.map((periodGroup: PeriodGroup, index: number) => {
        return index === 0
            ? localize(i18n, 'trader.productDetails.analystViews.estimations.currentLabel')
            : `Y | ${periodGroup.year}`;
    });
}

interface Props {
    hasOneColumnLayout: boolean;
    productEstimates?: UnifiedEstimates;
}

const {useContext} = React;
const visibleCellsReservedColSpan: number = 2;
const Estimations: React.FunctionComponent<Props> = ({productEstimates, hasOneColumnLayout}) => {
    const i18n = useContext(I18nContext);
    const {interim = [], annual = []} = productEstimates || {};
    const interimGroupLabels: string[] = getInterimGroupLabels(i18n, interim);
    const annualGroupLabels: string[] = getAnnualGroupLabels(i18n, annual);
    const firstAnnual: PeriodGroup | undefined = annual[0];
    const lastAnnual: PeriodGroup | undefined = annual[annual.length - 1];
    const compactInterimLabels: CompactLabels = getInterimCompactLabels(interim);
    const compactAnnualLabels: CompactLabels = [firstAnnual?.year.toString(), lastAnnual?.year.toString()];
    const hasCompactLayout: boolean = !useGlobalFullLayoutFlag();
    // extract class name because of line lenght limit
    const headerCellClassName: string = `${headerCell} ${
        hasOneColumnLayout ? compactHeaderColumn : ''
    } ${startStickyCell} ${startStickyCellWithoutBorder}`;

    return (
        <Card
            data-name="estimations"
            header={<Header productEstimates={productEstimates} />}
            innerHorizontalGap={false}
            footer={
                productEstimates ? (
                    <Disclaimer>
                        *{nbsp}
                        {localize(i18n, 'trader.productDetails.analystViews.estimations.lastUpdated')}:{nbsp}
                        <DateValue id="lastUpdated" field="lastUpdated" value={productEstimates.lastUpdated} />
                        {valuesDelimiter}
                        {localize(i18n, 'trader.productDetails.analystViews.estimations.currency', {
                            currency: productEstimates.currency
                        })}
                        {valuesDelimiter}
                        {localize(i18n, 'trader.productDetails.analystViews.estimations.preferredMeasure', {
                            preferredMeasure: productEstimates.preferredMeasure
                        })}
                    </Disclaimer>
                ) : (
                    true
                )
            }>
            {productEstimates ? (
                <TableShadowedWrapper>
                    {({stickyHeaderCellRef}) => (
                        <ExpandableGroupsTable
                            headerRowLabel={productEstimates.sections[SectionTypes.INC]?.type || ''}
                            interimGroupHeaderLabels={interimGroupLabels}
                            annualGroupHeaderLabels={annualGroupLabels}
                            interimGroupCompactLabels={compactInterimLabels}
                            annualGroupCompactLabels={compactAnnualLabels}
                            className={tableClassName}
                            hasOneColumnLayout={hasOneColumnLayout}
                            hasCompactLayout={hasCompactLayout}
                            stickyHeaderCellRef={stickyHeaderCellRef}>
                            {({isInterimGroupExpanded, isAnnualGroupExpanded}) =>
                                Object.entries(sortedSections).map(([sectionType, measuresCodes], index: number) => {
                                    const sectionData: Section | undefined =
                                        productEstimates.sections[sectionType as SectionTypes];

                                    return (
                                        sectionData && (
                                            <>
                                                {index !== 0 && (
                                                    <tr className={row}>
                                                        <th className={headerCellClassName} ref={stickyHeaderCellRef}>
                                                            <div
                                                                className={`${sectionHeaderCellContent} 
                                                                    ${stickyCellContent} 
                                                                    ${startStickyCellShadowedContent}
                                                                `}>
                                                                {sectionData.type}
                                                            </div>
                                                        </th>
                                                        <th
                                                            colSpan={
                                                                annualGroupLabels.length +
                                                                interimGroupLabels.length +
                                                                visibleCellsReservedColSpan
                                                            }
                                                            className={headerCell}
                                                        />
                                                    </tr>
                                                )}
                                                {measuresCodes.map((code: MeasureCode) => {
                                                    const measureData: MeasureData | undefined =
                                                        sectionData.measures[code];

                                                    return (
                                                        measureData && (
                                                            <MeasureRow
                                                                measureCode={code}
                                                                hasOneColumnLayout={hasOneColumnLayout}
                                                                hasCompactLayout={hasCompactLayout}
                                                                isInterimGroupExpanded={isInterimGroupExpanded}
                                                                isAnnualGroupExpanded={isAnnualGroupExpanded}
                                                                measureData={measureData}
                                                            />
                                                        )
                                                    );
                                                })}
                                            </>
                                        )
                                    );
                                })
                            }
                        </ExpandableGroupsTable>
                    )}
                </TableShadowedWrapper>
            ) : (
                <NoDataMessage hasCompactLayout={hasCompactLayout} />
            )}
        </Card>
    );
};

export default React.memo(Estimations);
