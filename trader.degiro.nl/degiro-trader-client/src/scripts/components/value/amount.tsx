import * as React from 'react';
import {NumericValueProps} from './index';
import NumericValue from './numeric';

const defaultAmountFormatting: NumericValueProps['formatting'] = {preset: 'amount'};
const Amount: React.FunctionComponent<NumericValueProps> = (props) => (
    <NumericValue {...props} formatting={props.formatting || defaultAmountFormatting} />
);

export default React.memo(Amount);
