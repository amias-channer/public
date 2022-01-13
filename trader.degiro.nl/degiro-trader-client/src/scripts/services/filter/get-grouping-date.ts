import formatDate from 'frontend-core/dist/utils/date/format-date';

/**
 * @description Get a date string for grouping on UIs (transactions, account-overview, etc.)
 * @param {Date} date
 * @returns {string}
 */
export default function getGroupingDate(date: Date | string): string {
    return typeof date === 'string' ? date.split('T')[0] : formatDate(date, 'YYYY-MM-DD');
}
