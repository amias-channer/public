import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import omitNullable from 'frontend-core/dist/utils/omit-nullable';
import * as React from 'react';
import {inlineEndContentCell} from '../../../../table/table.css';
import {valuePlaceholder} from '../../../../value';
import {cell, lastGroupedCell} from '../estimations.css';
import LineChartByValues from '../../../../chart/line-chart-by-values/index';
import {MeasureItemDataValue} from '../../../../../models/analyst-views';
import getLineChartHeight from './get-line-chart-height';

export interface LineChartCellProps {
    lineChartDataValues: MeasureItemDataValue[];
}

const LineChartCell: React.FunctionComponent<LineChartCellProps> = ({lineChartDataValues}) => (
    <td className={`${cell} ${inlineEndContentCell} ${lastGroupedCell}`}>
        {omitNullable(lineChartDataValues).length && isNonEmptyArray(lineChartDataValues) ? (
            <LineChartByValues
                height={getLineChartHeight(lineChartDataValues)}
                width={50}
                values={lineChartDataValues}
            />
        ) : (
            valuePlaceholder
        )}
    </td>
);

export default React.memo(LineChartCell);
