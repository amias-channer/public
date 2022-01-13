import * as React from 'react';
import {NumericValueProps} from './index';
import NumericValue from './numeric';

const defaultVolumeFormatting: NumericValueProps['formatting'] = {fractionSize: 0};
const Volume: React.FunctionComponent<NumericValueProps> = (props) => (
    <NumericValue {...props} formatting={props.formatting || defaultVolumeFormatting} />
);

export default React.memo(Volume);
