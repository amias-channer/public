import getFilterPeriod, {DateRange} from 'frontend-core/dist/services/filter/get-filter-period';
import startOfDay from 'frontend-core/dist/utils/date/start-of-day';
import shiftDate from 'frontend-core/dist/utils/date/shift-date';
import {AgendaPeriodTypes} from '../../models/agenda';

export default function getAgendaDateRangeByPeriodType(agendaPeriodType: AgendaPeriodTypes): DateRange {
    const today: Date = new Date();
    const todayStartOfDay: Date = startOfDay(today);
    const currentDayOfTheWeek: number = today.getDay();
    const daysToNextWeekStart: number = 7 - currentDayOfTheWeek;
    const tomorrowStartOfDay: Date = shiftDate(todayStartOfDay, {days: 1});
    const yesterdayStartOfDay: Date = shiftDate(todayStartOfDay, {days: -1});

    switch (agendaPeriodType) {
        case AgendaPeriodTypes.LAST_SIX_MONTHS:
            return getFilterPeriod(
                {value: shiftDate(yesterdayStartOfDay, {months: -6})},
                {value: yesterdayStartOfDay},
                {}
            );
        case AgendaPeriodTypes.LAST_SIX_MONTHS_INCLUDING_TODAY:
            return getFilterPeriod({value: shiftDate(todayStartOfDay, {months: -6})}, {value: todayStartOfDay}, {});
        case AgendaPeriodTypes.LAST_SEVEN_DAYS:
            return getFilterPeriod(null, {value: yesterdayStartOfDay}, {daysRange: 6});
        case AgendaPeriodTypes.LAST_SEVEN_DAYS_INCLUDING_TODAY:
            return getFilterPeriod(null, {value: todayStartOfDay}, {daysRange: 6});
        case AgendaPeriodTypes.YESTERDAY:
            return getFilterPeriod({value: yesterdayStartOfDay}, {value: yesterdayStartOfDay}, {});
        case AgendaPeriodTypes.TOMORROW:
            return getFilterPeriod({value: tomorrowStartOfDay}, {value: tomorrowStartOfDay}, {});
        case AgendaPeriodTypes.THIS_WEEK:
            return getFilterPeriod({value: shiftDate(todayStartOfDay, {days: -currentDayOfTheWeek})}, null, {
                daysRange: 6
            });
        case AgendaPeriodTypes.NEXT_WEEK:
            return getFilterPeriod({value: shiftDate(todayStartOfDay, {days: daysToNextWeekStart})}, null, {
                daysRange: 6
            });
        case AgendaPeriodTypes.NEXT_TWO_WEEKS:
            return getFilterPeriod({value: todayStartOfDay}, null, {daysRange: 13});
        case AgendaPeriodTypes.NEXT_SEVEN_DAYS:
            return getFilterPeriod({value: tomorrowStartOfDay}, null, {daysRange: 6});
        case AgendaPeriodTypes.NEXT_SEVEN_DAYS_INCLUDING_TODAY:
            return getFilterPeriod({value: todayStartOfDay}, null, {daysRange: 6});
        case AgendaPeriodTypes.NEXT_SIX_MONTHS:
            return getFilterPeriod(
                {value: tomorrowStartOfDay},
                {value: shiftDate(tomorrowStartOfDay, {months: 6})},
                {}
            );
        case AgendaPeriodTypes.NEXT_SIX_MONTHS_INCLUDING_TODAY:
            return getFilterPeriod({value: todayStartOfDay}, {value: shiftDate(todayStartOfDay, {months: 6})}, {});
        default:
            return getFilterPeriod({value: todayStartOfDay}, {value: todayStartOfDay}, {});
    }
}
