import Input, {InputProps} from 'frontend-core/dist/components/ui-trader3/input';
import * as React from 'react';

export interface InputNumberProps extends InputProps {
    fractionSize?: number;
    allowNegative?: boolean;
}

const InputNumber: React.FunctionComponent<InputNumberProps> = (props) => {
    const {required, fractionSize} = props;
    const negativeSignPattern: string = props.allowNegative ? '-?' : '';
    const integerPattern: string = `${negativeSignPattern}[0-9]${required ? '{1,}' : '*'}`;

    return (
        <Input
            type={fractionSize ? 'number' : 'tel'}
            min="0"
            max="1000000000000"
            minLength={1}
            maxLength={15}
            step="any"
            inputMode="numeric"
            pattern={fractionSize ? `${integerPattern}|(${negativeSignPattern}[0-9]+[.,][0-9]{1,2})` : integerPattern}
            {...props}
            ref={undefined}
        />
    );
};

export default React.memo(InputNumber);
