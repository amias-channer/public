export default function getMaxDate(firstDate, ...dates) {
    return dates.reduce((maxDate, currentDate) => (maxDate > currentDate ? maxDate : currentDate), firstDate);
}
//# sourceMappingURL=get-max-date.js.map