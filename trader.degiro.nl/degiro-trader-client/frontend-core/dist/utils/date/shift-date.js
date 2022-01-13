export default function shiftDate(date, { years, months, days, hours, minutes }) {
    const newDate = new Date(date);
    if (years) {
        newDate.setFullYear(newDate.getFullYear() + years);
    }
    if (months) {
        newDate.setMonth(newDate.getMonth() + months);
    }
    if (days) {
        newDate.setDate(newDate.getDate() + days);
    }
    if (hours) {
        newDate.setHours(newDate.getHours() + hours);
    }
    if (minutes) {
        newDate.setMinutes(newDate.getMinutes() + minutes);
    }
    return newDate;
}
//# sourceMappingURL=shift-date.js.map