import * as React from 'react';
import {Interval} from 'frontend-core/dist/models/interval';
import divideIntervalIntoEqualParts from 'frontend-core/dist/utils/interval/divide-interval-into-equal-parts';
import SelectInterval from '../select-interval';

export interface RangeProps {
    className?: string;
    value: Interval<number>;
    boundaries: Interval<number>;
    onChange: (value: Interval<number>) => void;
    optionsCount?: number;
    //                     full text format       suffix format
    //                 example: "10% — 12%"       "%" (suffix used for format like this: "<input value={1}/> %" )
    //                                   ↓        ↓
    format?: (n: Interval<number>) => [string, string];
}

const {useMemo, memo} = React;
const BaseRange = memo<RangeProps>(({className = '', boundaries, optionsCount = 6, format, value, onChange}) => {
    const options = useMemo<Interval[]>(() => {
        const dividedBoundaries = divideIntervalIntoEqualParts(boundaries, optionsCount - 2).map(
            ({start, end}: Interval) => ({
                start: Number(start.toFixed(2)),
                end: Number(end.toFixed(2))
            })
        );

        dividedBoundaries[0].start = -Infinity;
        dividedBoundaries[dividedBoundaries.length - 1].end = Infinity;

        return [{start: -Infinity, end: Infinity}, ...dividedBoundaries];
    }, [boundaries]);

    return (
        <SelectInterval
            boundaries={boundaries}
            format={format}
            className={className}
            data={options}
            value={value}
            onChange={onChange}
        />
    );
});

BaseRange.displayName = 'BaseRange';
export default BaseRange;
