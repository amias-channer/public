import * as React from 'react';
import {NumericValueProps} from './index';
import NumericValue from './numeric';

const defaultOrderInputPriceFormatting: NumericValueProps['formatting'] = {preset: 'orderInputPrice'};
const OrderInputPrice: React.FunctionComponent<NumericValueProps> = (props) => (
    <NumericValue {...props} formatting={props.formatting || defaultOrderInputPriceFormatting} />
);

export default React.memo(OrderInputPrice);
