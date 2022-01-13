import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {Interval} from 'frontend-core/dist/models/interval';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {nbsp} from '../../value';
import InputWithClearButton from '../input-with-clear-button';
import {input as inputClassName, wrapper} from './input-interval.css';

type Props = React.PropsWithChildren<{
    value: Interval<number>;
    onChange?: (newValue: Interval<number>) => void;
    inputStartRef?: React.Ref<any>;
    inputEndRef?: React.Ref<any>;
    children?: React.ReactNode;
    className?: string;
    minValue?: number;
    maxValue?: number;
}>;

const {useCallback, useContext, memo} = React;
const InputInterval = memo<Props>(
    ({className = '', children, inputStartRef, inputEndRef, value, onChange, minValue, maxValue}) => {
        const i18n = useContext(I18nContext);
        const [start, setStart] = useStateFromProp<Interval<number>, string>(value, (value) => {
            return value.start === -Infinity ? '' : String(value.start);
        });
        const [end, setEnd] = useStateFromProp<Interval<number>, string>(value, (value) => {
            return value.end === Infinity ? '' : String(value.end);
        });
        const handleStartChange = useCallback(
            (event: React.KeyboardEvent<HTMLInputElement>) => setStart((event.target as HTMLInputElement)?.value),
            []
        );
        const handleEndChange = useCallback(
            (event: React.KeyboardEvent<HTMLInputElement>) => setEnd((event.target as HTMLInputElement)?.value),
            []
        );
        const handleApply = useCallback(
            (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();

                const startNumber = parseFloat(start);
                const resultStart = isNaN(startNumber) ? -Infinity : startNumber;
                const endNumber = parseFloat(end);
                const resultEnd = isNaN(endNumber) ? Infinity : endNumber;

                if (resultStart > resultEnd) {
                    return onChange?.({end: resultStart, start: resultEnd});
                }

                return onChange?.({start: resultStart, end: resultEnd});
            },
            [end, start]
        );

        return (
            <form className={`${wrapper} ${className}`} onSubmit={handleApply} noValidate={true}>
                <InputWithClearButton
                    ref={inputStartRef}
                    step="0.1"
                    className={inputClassName}
                    onInput={handleStartChange}
                    placeholder={
                        minValue === undefined ? localize(i18n, 'trader.filtersList.interval.from') : String(minValue)
                    }
                    type="number"
                    value={start}
                />
                {`${nbsp}—${nbsp}`}
                <InputWithClearButton
                    ref={inputEndRef}
                    step="0.1"
                    className={inputClassName}
                    onInput={handleEndChange}
                    placeholder={
                        maxValue === undefined ? localize(i18n, 'trader.filtersList.interval.to') : String(maxValue)
                    }
                    type="number"
                    value={end}
                />
                {children}
            </form>
        );
    }
);

InputInterval.displayName = 'InputInterval';
export default InputInterval;
