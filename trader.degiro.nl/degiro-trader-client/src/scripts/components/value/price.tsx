import * as React from 'react';
import {NumericValueProps} from './index';
import NumericValue from './numeric';

const defaultPriceFormatting: NumericValueProps['formatting'] = {preset: 'price'};
/**
 * @description This component is used mostly for the next fields
 *  LastPrice
 *  OpenPrice
 *  HighPrice
 *  LowPrice
 * @param {NumericValueProps} props
 * @constructor
 */
const Price: React.FunctionComponent<NumericValueProps> = (props) => (
    <NumericValue {...props} formatting={props.formatting || defaultPriceFormatting} />
);

export default React.memo(Price);
