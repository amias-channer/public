import * as React from 'react';
import {hiddenSelectControl} from 'frontend-core/scripts/components/ui-trader4/control-utils.css';
import {Interval} from 'frontend-core/dist/models/interval';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import isInfinityInterval from 'frontend-core/dist/utils/interval/is-infinity-interval';
import addEventListener from 'frontend-core/dist/utils/events/add-event-listener';
import {filterOptionAllLabel} from 'frontend-core/dist/services/filter';
import formatInterval from 'frontend-core/dist/utils/interval/format-interval';
import isNull from 'frontend-core/dist/utils/is-null';
import {formLineIcon} from '../../filters/form-line-select-filter/form-line-select-filter.css';
import InputInterval from '../input-interval';
import {I18nContext} from '../../app-component/app-context';
import {selectPlaceholder, inlineInputInterval} from './select-interval-inline.css';

interface Props {
    data: Interval<number>[];
    value: Interval<number>;
    boundaries: Interval<number>;
    onChange: (value: Interval<number>) => void;
    //                     full text format       suffix format
    //                 example: "10% — 12%"       "%" (suffix used for format like this: "<input value={1}/> %" )
    //                                   ↓        ↓
    format?: (n: Interval<number>) => [string, string];
}
const {useContext, useRef, useMemo, useCallback, useEffect, memo} = React;
const defaultFormatter = (value: Interval): [string, string] => [formatInterval(value), ''];
const SelectIntervalInline = memo<Props>(({data, value, boundaries, onChange, format = defaultFormatter}) => {
    const i18n = useContext(I18nContext);
    const inputStartRef = useRef<HTMLInputElement>(null);
    const inputEndRef = useRef<HTMLInputElement>(null);
    const selectedOptionIndex = useMemo(() => {
        return data.findIndex(
            (interval) => value === interval || (value?.start === interval?.start && value?.end === interval?.end)
        );
    }, [value, data]);
    const handleStartChange = useCallback(
        (event: Event) => {
            const targetValue = (event.target as HTMLInputElement)?.value;
            const startValue = Number(targetValue);
            const newValue =
                !targetValue || isNaN(startValue) // note: Number("") === 0 that is why we need to check !targetValue
                    ? {
                          start: -Infinity,
                          end: value.end
                      }
                    : {
                          start: Math.min(startValue, value.end),
                          end: Math.max(startValue, value.end)
                      };

            return onChange(newValue);
        },
        [value, onChange]
    );
    const handleEndChange = useCallback(
        (event: Event) => {
            const targetValue = (event.target as HTMLInputElement)?.value;
            const endValue = Number(targetValue);
            const newValue =
                !targetValue || isNaN(endValue) // note: Number("") === 0 that is why we need to check !targetValue
                    ? {
                          start: value.start,
                          end: Infinity
                      }
                    : {
                          start: Math.min(endValue, value.start),
                          end: Math.max(endValue, value.start)
                      };

            return onChange(newValue);
        },
        [value, onChange]
    );

    useEffect(() => {
        return !isNull(inputStartRef.current)
            ? addEventListener(inputStartRef.current, 'change', handleStartChange)
            : undefined;
    }, [handleStartChange]);

    useEffect(() => {
        return !isNull(inputEndRef.current)
            ? addEventListener(inputEndRef.current, 'change', handleEndChange)
            : undefined;
    }, [handleStartChange, handleEndChange]);

    return (
        <InputInterval
            minValue={boundaries.start}
            maxValue={boundaries.end}
            inputStartRef={inputStartRef}
            inputEndRef={inputEndRef}
            className={inlineInputInterval}
            value={value}>
            {format(value)[1]}
            <label className={selectPlaceholder}>
                <Icon className={formLineIcon} type="keyboard_arrow_down" />
                <select
                    className={hiddenSelectControl}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                        onChange(data[Number(event.target.value)])
                    }>
                    <option selected={true} disabled={true}>
                        {localize(i18n, 'trader.filtersList.selectIntervalFromList')}
                    </option>
                    {data.map((value, i) => (
                        <option key={i} value={i} selected={selectedOptionIndex === i}>
                            {isInfinityInterval(value) ? localize(i18n, filterOptionAllLabel) : format(value)[0]}
                        </option>
                    ))}
                </select>
            </label>
        </InputInterval>
    );
});

SelectIntervalInline.displayName = 'SelectIntervalInline';
export default SelectIntervalInline;
