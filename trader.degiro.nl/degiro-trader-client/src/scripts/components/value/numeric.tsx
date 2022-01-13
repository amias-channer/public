import * as React from 'react';
import useNumericValue from './hooks/use-numeric-value';
import {NumericValueProps, NumericValueSign} from './index';
import prepareNumericValueParam from './utils/prepare-numeric-value-param';

const NumericValue: React.FunctionComponent<NumericValueProps> = (props) => {
    const {prefix, showPositiveSign, brackets, formatting} = props;
    const {sign, content, rootNodeProps} = useNumericValue({...props, value: prepareNumericValueParam(props.value)});
    const signSymbol: NumericValueSign | undefined = showPositiveSign || sign !== '+' ? sign : undefined;
    const suffix: string | undefined = formatting?.preset === 'percent' ? '%' : undefined;
    const contentWithoutSign: string = sign === '-' ? content.slice(1) : content;

    return (
        <span {...rootNodeProps}>
            {brackets ? '(' : undefined}
            {prefix}
            {signSymbol}
            {contentWithoutSign}
            {suffix}
            {brackets ? ')' : undefined}
        </span>
    );
};

export default React.memo(NumericValue);
