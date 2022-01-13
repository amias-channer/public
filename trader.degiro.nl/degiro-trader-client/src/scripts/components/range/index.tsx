import {filterOptionAllLabel} from 'frontend-core/dist/services/filter';
import localize from 'frontend-core/dist/services/i18n/localize';
import formatInterval from 'frontend-core/dist/utils/interval/format-interval';
import isInfinityInterval from 'frontend-core/dist/utils/interval/is-infinity-interval';
import * as React from 'react';
import {Interval} from 'frontend-core/dist/models/interval';
import {I18nContext} from '../app-component/app-context';
import BaseRange, {RangeProps} from './base-range';
import DisabledInput from './disabled-input';

type Props = RangeProps & {disabled?: boolean};

const {useContext, memo} = React;
const Range = memo<Props>(
    ({disabled = false, format = (value: Interval<number>) => [formatInterval(value), ''], ...props}) => {
        const i18n = useContext(I18nContext);
        const {value, className} = props;

        return disabled ? (
            <DisabledInput
                className={className}
                value={isInfinityInterval(value) ? localize(i18n, filterOptionAllLabel) : format(value)[0]}
            />
        ) : (
            <BaseRange {...props} className={className} value={value} format={format} />
        );
    }
);

Range.displayName = 'Range';
export default Range;
