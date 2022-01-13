import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import omitNullable from 'frontend-core/dist/utils/omit-nullable';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';
import {valuePlaceholder} from '../../../../../value';
import {defaultAmountFormatting, oneColumnLayoutNumberAbbrSizes} from '../../../../formatting-config';
import {compactLayoutCell, inlineCenterContentCell, lastGroupedCell} from '../../estimations.css';
import {compactViewCellContent, contentItem} from './compact-layout-cell.css';
import NumberAbbr from '../../../../../value/number-abbr';
import LineChartByValues from '../../../../../chart/line-chart-by-values/index';
import {LineChartCellProps} from '../line-chart-cell';
import getLineChartHeight from '../get-line-chart-height';
import NumericValue from '../../../../../value/numeric';

const valueFormatting: NumberFormattingOptions = {roundSize: 3};
const CompactLayoutCell: React.FunctionComponent<LineChartCellProps> = ({lineChartDataValues}, index) => {
    const renderDataValue = (id: string, value?: number, className: string = ''): React.ReactElement => {
        return value && Math.abs(value) >= 1000 ? (
            <NumberAbbr
                id={id}
                value={value}
                field="value"
                sizes={oneColumnLayoutNumberAbbrSizes}
                formatting={defaultAmountFormatting}
                className={className}
            />
        ) : (
            <NumericValue id={id} value={value} field="value" formatting={valueFormatting} className={className} />
        );
    };

    return (
        <td className={`${compactLayoutCell} ${lastGroupedCell} ${inlineCenterContentCell}`}>
            {isNonEmptyArray(omitNullable(lineChartDataValues)) && isNonEmptyArray(lineChartDataValues) && index ? (
                <>
                    <LineChartByValues
                        height={getLineChartHeight(lineChartDataValues)}
                        width={50}
                        values={lineChartDataValues}
                    />
                    <div className={compactViewCellContent}>
                        {renderDataValue('estimationsMeasureItem', lineChartDataValues[0], contentItem)}
                        {renderDataValue('measureData', lineChartDataValues[lineChartDataValues.length - 1])}
                    </div>
                </>
            ) : (
                valuePlaceholder
            )}
        </td>
    );
};

export default React.memo(CompactLayoutCell);
