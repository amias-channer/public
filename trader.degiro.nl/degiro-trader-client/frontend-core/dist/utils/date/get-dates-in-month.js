/**
 * @param {number} month The month as an number between 0 and 11 (January to December).
 * @param {number} year Not zero based, required to account for leap years
 * @returns {number[]} List of dates, between 1 and 31
 */
export default function getDatesInMonth(month, year) {
    const date = new Date(year, month, 1);
    /**
     * @description month may be changed:
     *  month = 12, year = 2017 => month = 1, year = 2018
     *  month = -1, year = 2017 => month = 11, year = 2016
     * @type {number}
     */
    const datesMonth = date.getMonth();
    const result = [];
    while (date.getMonth() === datesMonth) {
        const currentDate = date.getDate();
        result.push(currentDate);
        date.setDate(currentDate + 1);
    }
    return result;
}
//# sourceMappingURL=get-dates-in-month.js.map