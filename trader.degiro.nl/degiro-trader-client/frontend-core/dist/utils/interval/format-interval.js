const defaultValueFormatter = (value) => String(value);
export default function formatInterval({ start, end }, formatValue = defaultValueFormatter) {
    if (start === -Infinity && end === Infinity) {
        return '∞';
    }
    if (start === -Infinity) {
        return `≤ ${formatValue(end)}`;
    }
    if (end === Infinity) {
        return `≥ ${formatValue(start)}`;
    }
    if (start === end) {
        return formatValue(start);
    }
    return `${formatValue(start)} — ${formatValue(end)}`;
}
//# sourceMappingURL=format-interval.js.map