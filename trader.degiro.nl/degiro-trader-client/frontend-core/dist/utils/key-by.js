/**
 * @param {object[]} list
 * @param {string} [prop]
 * @returns {object}
 * @example
 * keyBy<Model>([
 *      {id: 'key1', message: 'message 1'},
 *      {id: 'key2', message: 'message 2'},
 *  ]) =>
 *  {
 *      key1: {id: 'key1', message: 'message 1'},
 *      key2: {id: 'key2', message: 'message 2'},
 *  };
 * @example
 * keyBy<Model, 'key'>([
 *      {key: 'key1', message: 'message 1'},
 *      {key: 'key2', message: 'message 2'},
 *  ], 'key') =>
 *  {
 *      key1: {id: 'key1', message: 'message 1'},
 *      key2: {id: 'key2', message: 'message 2'},
 *  };
 */
export default function keyBy(list, prop) {
    // TODO: investigate how to rewrite types to get rid of type casting
    const mappingKeyName = prop || 'id';
    return list.reduce((itemsMap, item) => {
        const mappingKeyValue = item[mappingKeyName];
        itemsMap[mappingKeyValue] = item;
        return itemsMap;
    }, {});
}
//# sourceMappingURL=key-by.js.map