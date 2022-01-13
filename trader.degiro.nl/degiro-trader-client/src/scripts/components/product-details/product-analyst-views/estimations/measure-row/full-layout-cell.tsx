import * as React from 'react';
import {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import {MeasureItemDataValue} from '../../../../../models/analyst-views';
import {inlineEndContentCell} from '../../../../table/table.css';
import {cell} from '../estimations.css';
import NumericValue from '../../../../value/numeric';
import {negativeValue, positiveValue} from '../../../../value/value.css';

interface Props {
    value: MeasureItemDataValue;
    className: string;
    previousMeasureItemValue: MeasureItemDataValue;
}
const valueFormatting: NumberFormattingOptions = {roundSize: 3};
const FullLayoutCell: React.FunctionComponent<Props> = ({value, className, previousMeasureItemValue}) => {
    const valueClassName: string | undefined =
        value === undefined || previousMeasureItemValue === undefined || value === previousMeasureItemValue
            ? undefined
            : value > previousMeasureItemValue
            ? positiveValue
            : negativeValue;

    return (
        <td className={`${cell} ${inlineEndContentCell} ${className}`}>
            <NumericValue
                formatting={valueFormatting}
                className={valueClassName}
                id="estimationsMeasureItem"
                value={value}
                field="value"
            />
        </td>
    );
};

export default React.memo(FullLayoutCell);
