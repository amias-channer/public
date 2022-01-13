/**
 * @returns {string}
 */
export default function generateElementId() {
    // remove dot to have a valid CSS selector, e.g. #el06545168076619634
    return `el${String(Math.random()).replace('.', '')}`;
}
//# sourceMappingURL=generate-element-id.js.map