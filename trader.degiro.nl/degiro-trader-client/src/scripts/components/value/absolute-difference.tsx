import * as React from 'react';
import NumericValue from '../value/numeric';
import {NumericValueProps} from './index';

const defaultAbsoluteDifferenceFormatting: NumericValueProps['formatting'] = {preset: 'amount'};
const AbsoluteDifference: React.FunctionComponent<NumericValueProps> = ({
    highlightValueBySign = true,
    highlightValueChange = true,
    showPositiveSign = true,
    formatting = defaultAbsoluteDifferenceFormatting,
    ...restProps
}) => (
    <NumericValue
        {...restProps}
        highlightValueBySign={highlightValueBySign}
        highlightValueChange={highlightValueChange}
        showPositiveSign={showPositiveSign}
        formatting={formatting}
    />
);

export default React.memo(AbsoluteDifference);
