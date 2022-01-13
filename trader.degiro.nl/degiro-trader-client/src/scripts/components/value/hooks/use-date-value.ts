import formatDate from 'frontend-core/dist/utils/date/format-date';
import isValidDate from 'frontend-core/dist/utils/date/is-valid-date';
import parseDate from 'frontend-core/dist/utils/date/parse-date';
import {DateValueProps, RootNodeProps, valuePlaceholder} from '../index';

interface State {
    content: string;
    rootNodeProps: RootNodeProps & {dateTime?: string};
}

export const defaultDateValueFormat: string = 'DD/MM/YYYY';
export const defaultFullTimeValueFormat: string = 'HH:mm:ss';
export const defaultShortTimeValueFormat: string = 'HH:mm';
export const defaultDateTimeValueFormat: string = 'DD/MM/YYYY HH:mm';

const todayBeginDate: Date = new Date();

todayBeginDate.setHours(0);
todayBeginDate.setMinutes(0);
todayBeginDate.setSeconds(0);
todayBeginDate.setMilliseconds(0);

export default function useDateValue({
    id,
    field,
    value,
    className,
    onlyTime,
    onlyTodayTime,
    parserOptions,
    format = defaultDateValueFormat,
    timeFormat = defaultShortTimeValueFormat
}: DateValueProps): State {
    const dateValue: Date | undefined = value ? parseDate(value, parserOptions) : undefined;
    const rootNodeProps: State['rootNodeProps'] = {'data-id': id, 'data-field': field, className};

    if (!dateValue || !isValidDate(dateValue)) {
        return {
            content: valuePlaceholder,
            rootNodeProps
        };
    }

    let dateFormatString: string = format;

    if (onlyTodayTime) {
        // it's a present or future date
        if (dateValue.getTime() >= todayBeginDate.getTime()) {
            dateFormatString = timeFormat;
        }
    } else if (onlyTime) {
        dateFormatString = timeFormat;
    }

    rootNodeProps.dateTime = dateValue.toISOString();

    return {
        rootNodeProps,
        content: formatDate(dateValue, dateFormatString)
    };
}
