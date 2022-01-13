import * as React from 'react';
import {NumericValueProps} from './index';
import NumericValue from './numeric';
import {relativeDiffValueText} from './value.css';

const defaultRelativeDifferenceFormatting: NumericValueProps['formatting'] = {preset: 'percent'};
const RelativeDifference: React.FunctionComponent<NumericValueProps> = ({
    className = '',
    highlightValueBySign = true,
    highlightValueChange = true,
    showPositiveSign = true,
    formatting = defaultRelativeDifferenceFormatting,
    ...restProps
}) => (
    <NumericValue
        {...restProps}
        highlightValueBySign={highlightValueBySign}
        highlightValueChange={highlightValueChange}
        showPositiveSign={showPositiveSign}
        className={`${className} ${relativeDiffValueText}`}
        formatting={formatting}
    />
);

export default React.memo(RelativeDifference);
