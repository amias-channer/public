export default function serializeInterval({ start, end }) {
    const startStr = start === -Infinity ? '-' : String(start);
    const endStr = end === Infinity ? '-' : String(end);
    return `${startStr}/${endStr}`;
}
//# sourceMappingURL=serialize-interval.js.map