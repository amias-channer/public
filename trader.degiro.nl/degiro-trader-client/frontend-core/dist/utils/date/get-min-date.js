export default function getMinDate(firstDate, ...dates) {
    return dates.reduce((minDate, currentDate) => (minDate < currentDate ? minDate : currentDate), firstDate);
}
//# sourceMappingURL=get-min-date.js.map