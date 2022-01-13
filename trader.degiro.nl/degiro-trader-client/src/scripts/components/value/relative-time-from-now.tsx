import formatRelativeTime from 'frontend-core/dist/services/date/format-relative-time';
import * as React from 'react';
import getDateDifference from 'frontend-core/dist/utils/date/get-date-difference';
import {MainClientContext} from '../app-component/app-context';
import DateValue from './date';
import {RelativeTimeProps, valuePlaceholder} from './index';

const {memo, useContext, useState, useEffect} = React;
const RelativeTimeFromNow: React.FunctionComponent<RelativeTimeProps> = memo(
    ({id, field, value: initialValue, className, thresholdInDays}) => {
        const [baseDate, setBaseDate] = useState<Date>(() => new Date());
        const mainClient = useContext(MainClientContext);
        const value: Date | undefined = initialValue ? new Date(initialValue) : undefined;

        // INFO: ensure that every value is with same seconds, to have synchronization between all the instances
        value?.setSeconds(0);

        const formattedRelativeTime: string | undefined = value
            ? formatRelativeTime(value, baseDate, mainClient.displayLanguage)
            : valuePlaceholder;
        const daysDifference: number | undefined = value && Math.abs(getDateDifference(value, baseDate, 'days'));

        // INFO: this is needed to ensure all the instances will have syncronized timers and updates respectively
        useEffect(() => {
            let timerId: number = 0;
            const timeDiff = 60 * 1000 - (baseDate.getSeconds() * 1000 + baseDate.getMilliseconds());
            const timeoutTimerId = setTimeout(() => {
                setBaseDate(new Date());
                timerId = window.setInterval(() => {
                    setBaseDate(new Date());
                }, 60 * 1000 /* every minute */);
            }, timeDiff);

            return () => {
                window.clearTimeout(timeoutTimerId);
                window.clearInterval(timerId);
            };
        }, []);

        if (daysDifference && thresholdInDays && daysDifference > thresholdInDays) {
            return <DateValue field={field} id={id} value={value} className={className} />;
        }
        return formattedRelativeTime ? (
            <time data-id={id} data-field={field} dateTime={value?.toISOString()} className={className}>
                {formattedRelativeTime}
            </time>
        ) : (
            <DateValue field={field} id={id} value={value} className={className} onlyTodayTime={true} />
        );
    }
);

RelativeTimeFromNow.displayName = 'RelativeTimeFromNow';
export default RelativeTimeFromNow;
