/**
 * @example
 *  getDateDifference(new Date(2019, 10, 19), new Date(2017, 10, 19), 'years') // 2
 *  getDateDifference(new Date(2017, 10, 25), new Date(2017, 10, 19), 'days') // 6
 * @param {Date} firstDate
 * @param {Date} secondDate
 * @param {Units} [units]
 * @returns {number}
 */
export default function getDateDifference(firstDate, secondDate, units = 'days') {
    const yearsDifference = firstDate.getFullYear() - secondDate.getFullYear();
    const monthDifference = firstDate.getMonth() - secondDate.getMonth();
    const dateDifference = firstDate.getDate() - secondDate.getDate();
    const hoursDifference = firstDate.getHours() - secondDate.getHours();
    const minutesDifference = firstDate.getMinutes() - secondDate.getMinutes();
    const secondsDifference = firstDate.getSeconds() - secondDate.getSeconds();
    const msDifference = firstDate.getMilliseconds() - secondDate.getMilliseconds();
    const timeDifference = firstDate.getTime() - secondDate.getTime();
    switch (units) {
        case 'years':
        case 'months': {
            const years = yearsDifference +
                (monthDifference +
                    (dateDifference +
                        (hoursDifference + (minutesDifference + (secondsDifference + msDifference / 100) / 60) / 60) /
                            24) /
                        (365 / 12)) /
                    12;
            if (units === 'months') {
                return years * 12;
            }
            return years;
        }
        case 'days':
            return timeDifference / (60 * 60 * 24 * 1000);
        case 'hours':
            return timeDifference / (60 * 60 * 1000);
        case 'minutes':
            return timeDifference / (60 * 1000);
        case 'seconds':
            return timeDifference / 1000;
        case 'ms':
            return msDifference;
    }
}
//# sourceMappingURL=get-date-difference.js.map