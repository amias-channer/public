import isObject from 'lodash/isObject'
import merge from 'lodash/merge'
import reduce from 'lodash/reduce'

/**
 * Converts from { a: { b: { c: "foo" } } } to { "a.b.c": "foo" }
 */
export const flattenKeys = (obj: object | string, objPath: string[] = []): object =>
  !isObject(obj)
    ? { [objPath.join('.')]: obj }
    : reduce(
        obj,
        (cum, next, key) => merge(cum, flattenKeys(next, [...objPath, key])),
        {},
      )
