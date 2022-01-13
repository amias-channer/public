import formatNumber from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';
import Input, {InputProps} from './index';

/**
 * @description We can't use any different delimiters, because some browsers clear the invalid input value
 * @type {string}
 */
const fractionDelimiter: string = '.';

export interface NumericInputProps extends InputProps {
    allowNegative?: boolean;
    fractionSize?: number;
    roundSize?: number;
}

export interface FormatInputProps {
    value: string;
    fractionSize: number;
    fractionDelimiter: string;
    roundSize: any;
}

const {useState, useEffect, useCallback} = React;
/**
 * @description Don't separate by thousands, because in Input field we accept only 1 delimiter: DOT
 * @param {FormatInputProps} props
 * @returns {string}
 */
const formatInputValue = (props: FormatInputProps) => {
    const {value, fractionSize, roundSize, fractionDelimiter} = props;

    if (!value) {
        return '';
    }

    if (value === '0') {
        return value;
    }

    return formatNumber(value, {fractionSize, roundSize, fractionDelimiter, separateThousands: false});
};
const NumericInput: React.FunctionComponent<NumericInputProps> = ({
    allowNegative,
    fractionSize = 0,
    roundSize: rawRoundSize,
    ...inputProps
}) => {
    const {onInput, value, required} = inputProps;
    const roundSize: number | undefined = rawRoundSize == null || isNaN(rawRoundSize) ? undefined : rawRoundSize;
    const [internalValue, setInternalValue] = useState<string | undefined>();
    const handleInput = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const input: HTMLInputElement = event.currentTarget;

            if (input.validity.valid) {
                setInternalValue(input.value);

                if (typeof onInput === 'function') {
                    onInput(event);
                }
            }
        },
        [onInput]
    );

    useEffect(() => {
        if (value === undefined) {
            setInternalValue(undefined);
            return;
        }

        setInternalValue((internalValue) => {
            const newValue: string = formatInputValue({
                value: String(value),
                fractionDelimiter,
                fractionSize,
                roundSize
            });
            const currentValue: string | undefined =
                internalValue &&
                formatInputValue({
                    value: internalValue,
                    fractionDelimiter,
                    fractionSize,
                    roundSize
                });

            // 12 vs 12.00, 15 vs 15.000
            if (newValue !== currentValue) {
                return newValue;
            }

            return internalValue;
        });
    }, [value, fractionSize, roundSize]);

    const negativeSignPattern: string = allowNegative ? '-?' : '';
    const integerPattern: string = `${negativeSignPattern}[0-9]${required ? '{1,}' : '*'}`;

    if (fractionSize) {
        // [TRADER-1868] do not use inputmode attribute together with type="number" as it fails in iOS 14.5.1
        // e.g. an input "1,2" is treated as invalid value
        //
        // eslint-disable-next-line max-len
        // See also https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/
        inputProps.type = 'inputMode' in HTMLInputElement.prototype ? 'text' : 'number';
        inputProps.inputMode = 'decimal';
    } else {
        inputProps.type = 'tel';
        inputProps.inputMode = 'numeric';
    }

    inputProps.value = internalValue;
    inputProps.pattern = fractionSize
        ? `${integerPattern}|(${negativeSignPattern}[0-9]+[.,][0-9]{1,${fractionSize}})`
        : integerPattern;

    if (!inputProps.min && !allowNegative) {
        inputProps.min = '0';
    }

    if (!inputProps.step) {
        /**
         * @description [WF-482]. We should setup step to 'any' for the float numbers, because in the other case it
         *  doesn't allow to use decimals
         * @type {string}
         */
        inputProps.step = fractionSize ? 'any' : '1';
    }

    inputProps.onInput = handleInput;

    return <Input {...inputProps} />;
};

export default React.memo(NumericInput);
