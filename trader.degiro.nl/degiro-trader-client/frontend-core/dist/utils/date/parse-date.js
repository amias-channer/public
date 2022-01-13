/**
 * @description [WF-355]
 * @todo REMOVE when we switch all APIs to ISO-8601 for dates
 * @param {Date} date
 * @returns {Date}
 */
function normalizeDateYear(date) {
    const today = new Date();
    const currentYear = today.getFullYear();
    // if the month is greater than the current one, decrease the year
    if (date.getMonth() > today.getMonth() && date.getFullYear() === currentYear) {
        date.setFullYear(currentYear - 1);
    }
    return date;
}
const fullISODatePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
/**
 * @description Keep parsers ordered by most used formats to access them faster (parseDate() perf)
 * @type {DateParser[]}
 */
const parsers = [
    {
        /**
         * @description 'ISO_8601'
         * @type {RegExp}
         */
        pattern: /^\s*[+-]?(\d{4})[/-](\d{2})[/-](\d{2})$/,
        /**
         *
         * @param {string} input
         * @param {DateParserOptions} [options]
         * @returns {Date|null}
         */
        exec(input, options) {
            const { keepOriginDate = false } = options || {};
            const [, year, month, date, hours, minutes, seconds] = fullISODatePattern.exec(input) || this.pattern.exec(input) || [];
            if (!year) {
                return null;
            }
            if (keepOriginDate) {
                return new Date(Number(year), Number(month) - 1, Number(date), Number(hours || 0), Number(minutes || 0), Number(seconds || 0));
            }
            return new Date(input);
        }
    },
    {
        // as timestamp, 1453134116994
        pattern: /^([0-9]{13})$/,
        /**
         *
         * @param {string} input
         * @returns {null|Date}
         */
        exec(input) {
            const [, timestamp] = this.pattern.exec(input) || [];
            if (!timestamp) {
                return null;
            }
            return new Date(Number(timestamp));
        }
    },
    {
        // as '04:50'
        pattern: /^\s*(\d{1,2}):(\d{1,2})\s*$/,
        /**
         *
         * @param {string} input
         * @returns {Date|null}
         */
        exec(input) {
            const [, hours, minutes] = this.pattern.exec(input) || [];
            if (hours == null) {
                return null;
            }
            const date = new Date();
            date.setHours(Number(hours), Number(minutes), 0, 0);
            return normalizeDateYear(date);
        }
    },
    {
        // as '2/6'
        pattern: /^\s*(\d{1,2})\/(\d{1,2})\s*$/,
        /**
         *
         * @param {string} input
         * @returns {Date|null}
         */
        exec(input) {
            const [, date, months] = this.pattern.exec(input) || [];
            if (date == null) {
                return null;
            }
            return normalizeDateYear(new Date(new Date().getFullYear(), Number(months) - 1, Number(date)));
        }
    },
    {
        // as '25/06 | 09:13:33'
        pattern: /^\s*(\d{2})\/(\d{2})\s*\|\s*(\d{2})\s*:\s*(\d{2})\s*:\s*(\d{2})\s*$/,
        /**
         *
         * @param {string} input
         * @returns {Date|null}
         */
        exec(input) {
            const [, date, months, hours, minutes, seconds] = this.pattern.exec(input) || [];
            if (!date) {
                return null;
            }
            return normalizeDateYear(new Date(new Date().getFullYear(), Number(months) - 1, Number(date), Number(hours), Number(minutes), Number(seconds)));
        }
    },
    {
        /**
         * '25/10/2014'
         * '2/10/2014'
         * '2/1/2014'
         * '25-10-2014'
         * '25-9-2014'
         * '2-9-2014'
         */
        pattern: /^\s*(\d{1,2})[/-](\d{1,2})[/-](\d{4})\s*$/,
        /**
         *
         * @param {string} input
         * @returns {Date|null}
         */
        exec(input) {
            const [, date, month, year] = this.pattern.exec(input) || [];
            if (!date) {
                return null;
            }
            return new Date(Number(year), Number(month) - 1, Number(date));
        }
    }
];
/**
 * @see {@link http://confluence/display/WF/Parsing+and+formatting+data}
 * @param {Date|string} date
 * @param {DateParserOptions} [options]
 * @returns {Date|undefined}
 */
export default function parseDate(date, options) {
    if (!date) {
        return;
    }
    if (date instanceof Date) {
        return date;
    }
    const dateString = String(date);
    // parse specific date value to Date
    for (const parser of parsers) {
        const parsedDate = parser.exec(dateString, options);
        if (parsedDate) {
            return parsedDate;
        }
    }
}
//# sourceMappingURL=parse-date.js.map