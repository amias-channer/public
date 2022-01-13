/**
 * @description Fast clone of plain objects
 *  - without Date field
 *  - without RegExp field
 *  - without methods and prototype
 * @param {Object} obj
 * @returns {Object}
 */
export default function plainClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
//# sourceMappingURL=plain-clone.js.map