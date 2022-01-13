import formatNumber from 'frontend-core/dist/utils/number/format-number';
import isNegativeNumber from 'frontend-core/dist/utils/is-negative-number';
import isPositiveNumber from 'frontend-core/dist/utils/is-positive-number';
import {useContext, useRef} from 'react';
import {ConfigContext} from '../../app-component/app-context';
import {NumericValueProps, NumericValueSign, RootNodeProps, valuePlaceholder} from '../index';
import {
    negativeValue,
    positiveValue,
    valueFallHighlighting1,
    valueFallHighlighting2,
    valueGrowHighlighting1,
    valueGrowHighlighting2
} from '../value.css';

type ValueChangeClassIndex = 0 | 1;

interface State {
    sign: NumericValueSign;
    content: string;
    rootNodeProps: RootNodeProps;
}

interface Props extends Omit<NumericValueProps, 'value'> {
    value: number | null | undefined;
}

interface PrevData extends Pick<NumericValueProps, 'id' | 'field'>, Pick<State, 'content'> {
    value: Props['value'];
    // It's special flag to restart an animation initiated by CSS class.
    valueChangeClassIndex: ValueChangeClassIndex;
}

const valueGrowClassNames: string[] = [valueGrowHighlighting1, valueGrowHighlighting2];
const valueFallClassNames: string[] = [valueFallHighlighting1, valueFallHighlighting2];

export default function useNumericValue({
    id,
    field,
    value,
    formatting,
    highlightValueChange,
    highlightValueBySign,
    className = '',
    neutralValueClassName,
    emptyValueClassName
}: Props): State {
    const config = useContext(ConfigContext);
    const prevData = useRef<PrevData>({id, field, value, content: '', valueChangeClassIndex: 0});
    const {id: prevId, field: prevField, content: prevContent, value: prevValue} = prevData.current;
    const rootNodeProps: State['rootNodeProps'] = {'data-id': id, 'data-field': field};
    const rootNodeClassNames: string[] = [];
    let {valueChangeClassIndex} = prevData.current;
    let sign: NumericValueSign = '';
    let content: string;

    // value can be null, void, etc.
    if (value == null || isNaN(value)) {
        content = valuePlaceholder;

        if (emptyValueClassName) {
            rootNodeClassNames.push(emptyValueClassName);
        }
    } else {
        content = formatNumber(value, {
            fractionDelimiter: config.fractionDelimiter,
            thousandDelimiter: config.thousandDelimiter,
            ...formatting
        });

        // do not highlight first update or unchanged text content
        if (
            highlightValueChange &&
            id === prevId &&
            field === prevField &&
            prevValue != null &&
            prevContent &&
            prevContent !== content
        ) {
            if (value > prevValue) {
                rootNodeClassNames.push(valueGrowClassNames[valueChangeClassIndex]);
            } else {
                rootNodeClassNames.push(valueFallClassNames[valueChangeClassIndex]);
            }

            // swap values: 1 -> 0, 0 -> 1
            valueChangeClassIndex = valueChangeClassIndex === 1 ? 0 : 1;
        }

        if (value && isPositiveNumber(content)) {
            rootNodeProps['data-positive'] = 'true';
            sign = '+';

            if (highlightValueBySign) {
                rootNodeClassNames.push(positiveValue);
            }
        } else if (value && isNegativeNumber(content)) {
            rootNodeProps['data-negative'] = 'true';
            sign = '-';

            if (highlightValueBySign) {
                rootNodeClassNames.push(negativeValue);
            }
        } else if (neutralValueClassName) {
            rootNodeClassNames.push(neutralValueClassName);
        }
    }

    if (className) {
        rootNodeClassNames.push(className);
    }

    rootNodeProps.className = rootNodeClassNames.length ? rootNodeClassNames.join(' ') : undefined;
    rootNodeProps.title = content && content !== valuePlaceholder ? content : undefined;
    prevData.current = {id, field, value, content, valueChangeClassIndex};

    return {sign, rootNodeProps, content};
}
