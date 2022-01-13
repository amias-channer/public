import * as React from 'react';
import useDateValue from './hooks/use-date-value';
import {DateValueProps} from './index';

export {
    defaultDateValueFormat,
    defaultFullTimeValueFormat,
    defaultShortTimeValueFormat,
    defaultDateTimeValueFormat
} from './hooks/use-date-value';

const DateValue: React.FunctionComponent<DateValueProps> = (props) => {
    const {rootNodeProps, content} = useDateValue(props);

    return <time {...rootNodeProps}>{content}</time>;
};

export default React.memo(DateValue);
