import abbreviateNumber, {NumberAbbrSize} from 'frontend-core/dist/utils/number/abbreviate-number';
import formatNumber, {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';
import {ConfigContext} from '../app-component/app-context';
import useNumericValue from './hooks/use-numeric-value';
import {NumericValueProps} from './index';
import prepareNumericValueParam from './utils/prepare-numeric-value-param';

export interface NumberAbbrProps extends NumericValueProps {
    sizes?: NumberAbbrSize[];
}

const {useContext} = React;
const NumberAbbr: React.FunctionComponent<NumberAbbrProps> = ({value, sizes, ...restProps}) => {
    const config = useContext(ConfigContext);
    let formatting: NumberFormattingOptions = {roundSize: 2, fractionSize: 2, minFractionSize: 2};
    let suffix: NumberAbbrSize | '' = '';
    let numericValue: number | undefined | null = value || value === 0 ? prepareNumericValueParam(value) : undefined;

    if (numericValue != null) {
        [numericValue, suffix] = abbreviateNumber(numericValue, sizes);

        if (suffix) {
            formatting = {roundSize: 3, fractionSize: 3, minFractionSize: 3};
        }
    }
    const {content, rootNodeProps} = useNumericValue({...restProps, formatting, value: numericValue});
    // value can be empty string '', null, void or number
    const title: string | undefined =
        value || value === 0 ? formatNumber(value, {...config, ...formatting}) : undefined;

    return <span {...rootNodeProps} title={title}>{`${content}${suffix}`}</span>;
};

export default React.memo(NumberAbbr);
