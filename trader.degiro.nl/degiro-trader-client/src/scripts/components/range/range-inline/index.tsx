import * as React from 'react';
import {Interval} from 'frontend-core/dist/models/interval';
import divideIntervalIntoEqualParts from 'frontend-core/dist/utils/interval/divide-interval-into-equal-parts';
import SelectIntervalInline from '../select-interval-inline';

interface Props {
    value: Interval<number>;
    boundaries: Interval<number>;
    onChange: (value: Interval<number>) => void;
    //                     full text format       suffix format
    //                 example: "10% — 12%"       "%" (suffix used for format like this: "<input value={1}/> %" )
    //                                   ↓        ↓
    format?: (n: Interval<number>) => [string, string];
}

const {useMemo, memo} = React;
const RangeInline = memo<Props>(({boundaries, value, format, onChange}) => {
    const optionsListLength = 4;
    const data = useMemo<Interval[]>(() => {
        const dividedBoundaries = divideIntervalIntoEqualParts(boundaries, optionsListLength).map(
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
        <SelectIntervalInline format={format} value={value} boundaries={boundaries} data={data} onChange={onChange} />
    );
});

RangeInline.displayName = 'RangeInline';
export default RangeInline;
