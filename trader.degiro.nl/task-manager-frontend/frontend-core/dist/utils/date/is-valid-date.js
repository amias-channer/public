export default function isValidDate(date) {
    return date ? new Date(date).toString() !== 'Invalid Date' : false;
}
//# sourceMappingURL=is-valid-date.js.map