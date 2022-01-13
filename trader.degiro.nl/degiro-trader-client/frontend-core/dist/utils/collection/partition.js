/**
 * Takes an array and a predicate function as its parameter and returns a tuple with two array:
 *   1) Collection with elements that satisfied the predicate function
 *   2) Another collection with elements that did not match the predicate function.
 *
 * @param {array} arr
 * @param {function} predicate
 * @returns {[T[], T[]]}  Tuple with the passing and failing members separated
 */
export default function partition(arr, predicate) {
    return arr.reduce(([pass, fail], element) => {
        return predicate(element) ? [[...pass, element], fail] : [pass, [...fail, element]];
    }, [[], []]);
}
//# sourceMappingURL=partition.js.map