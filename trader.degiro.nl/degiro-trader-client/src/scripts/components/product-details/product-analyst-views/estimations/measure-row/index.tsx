import * as React from 'react';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import {MeasureCode, MeasureData, MeasureItemDataValue, MeasurePeriodItem} from '../../../../../models/analyst-views';
import {startStickyCell, startStickyCellShadowedContent, stickyCellContent} from '../../../../table/table.css';
import {row, cell, collapsedCell, measureNameCell, tooltipButton} from '../estimations.css';
import ProductDetailsHint from '../../../product-details-hint';
import TooltipDescriptionLine from '../../../product-details-hint/tooltip-description-line';
import {openedTooltip} from '../../../product-ratios/ratios-table/ratios-table.css';
import estimationsTooltips from '../../../tooltips-data/refinitiv-analyst-views-estimations-tooltips';
import LineChartCell from './line-chart-cell';
import CompactCell from './compact-layout-cell';
import FullLayoutCell from './full-layout-cell';

interface Props {
    measureCode: MeasureCode;
    measureData: MeasureData;
    isAnnualGroupExpanded: boolean;
    isInterimGroupExpanded: boolean;
    hasCompactLayout: boolean;
    hasOneColumnLayout: boolean;
}

function getMeasureName({annual, interim}: MeasureData): string | undefined {
    return [...annual, ...interim].find((measureDataItem: MeasurePeriodItem) => measureDataItem.measureName)
        ?.measureName;
}

const MeasureRow: React.FunctionComponent<Props> = ({
    measureCode,
    measureData,
    isAnnualGroupExpanded,
    isInterimGroupExpanded,
    hasCompactLayout,
    hasOneColumnLayout
}) => {
    const {annual, interim} = measureData;
    const collapsedInterimCellClassName: string = isInterimGroupExpanded ? '' : collapsedCell;
    const collapsedAnnualCellClassName: string = isAnnualGroupExpanded ? '' : collapsedCell;
    const lineChartInterimValues: MeasureItemDataValue[] = interim.map(({value}: MeasurePeriodItem) => value);
    const lineChartAnnualValues: MeasureItemDataValue[] = annual.map(({value}: MeasurePeriodItem) => value);
    const measureName: string | undefined = getMeasureName(measureData);
    const renderMeasurePeriod = (
        measurePeriodData: MeasurePeriodItem[],
        collapsedCellClassName: string,
        hasCompactLayout: boolean
    ): React.ReactElement[] => {
        return measurePeriodData.map(({value}: MeasurePeriodItem, index: number) => {
            const {value: previousMeasureItemValue} = measurePeriodData[index - 1] || {};
            const isCollapsableCell: boolean = !(index === 0 || index === measurePeriodData.length - 1);

            return (
                <FullLayoutCell
                    key={`itemValue-${index}`}
                    className={isCollapsableCell && hasCompactLayout ? collapsedCellClassName : ''}
                    previousMeasureItemValue={previousMeasureItemValue}
                    value={value}
                />
            );
        });
    };

    return (
        <tr className={row}>
            <td className={`${cell} ${startStickyCell} ${measureNameCell}`}>
                <div className={`${stickyCellContent} ${startStickyCellShadowedContent}`}>
                    {measureName}
                    {!isTouchDevice() && (
                        <ProductDetailsHint
                            className={tooltipButton}
                            activeClassName={openedTooltip}
                            tooltip={<TooltipDescriptionLine {...estimationsTooltips[measureCode]} />}
                        />
                    )}
                </div>
            </td>
            {interim.length > 0 &&
                (hasOneColumnLayout && !isInterimGroupExpanded ? (
                    <CompactCell lineChartDataValues={lineChartInterimValues} />
                ) : (
                    <>
                        {renderMeasurePeriod(interim, collapsedInterimCellClassName, hasCompactLayout)}
                        <LineChartCell lineChartDataValues={lineChartInterimValues} />
                    </>
                ))}
            {annual.length > 0 &&
                (hasOneColumnLayout && !isAnnualGroupExpanded ? (
                    <CompactCell lineChartDataValues={lineChartAnnualValues} />
                ) : (
                    <>
                        {renderMeasurePeriod(annual, collapsedAnnualCellClassName, hasCompactLayout)}
                        <LineChartCell lineChartDataValues={lineChartAnnualValues} />
                    </>
                ))}
        </tr>
    );
};

export default React.memo(MeasureRow);
