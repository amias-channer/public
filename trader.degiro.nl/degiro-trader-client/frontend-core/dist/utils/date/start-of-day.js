export default function startOfDay(originDate) {
    const date = new Date(originDate);
    // do not reset our if it's already midnight, it might resolve to the date change
    // For originDate == 1765324800000 ("Wed Dec 10 2025 01:00:00 GMT+0100 (Central European Standard Time)")
    // "2025-12-10T00:00:00.000Z" converts to "2025-12-09T23:00:00.000Z"
    if (date.getHours() === 0) {
        date.setMinutes(0, 0, 0);
        return date;
    }
    date.setHours(0, 0, 0, 0);
    return date;
}
//# sourceMappingURL=start-of-day.js.map