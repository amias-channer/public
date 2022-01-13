import { pathOr } from 'ramda';
import Logger from './logger';

const typedPathOr = (type, defaultValue, pathArray, source) => {
  const defaultValueType = Array.isArray(defaultValue) ? 'array' : typeof defaultValue;
  if (defaultValueType !== type) {
    Logger.warn(`Expected type of: "${type}" does not match the default value type: "${defaultValueType}"`, defaultValue, pathArray, source);
  }
  if (typeof source !== 'undefined') {
    const result = pathOr(defaultValue, pathArray, source);
    const resultDataType = typeof result;

    if (type === 'array') {
      if (Array.isArray(result)) {
        return result;
      }
    } else if (resultDataType === type) {
      return result;
    }

    Logger.warn(`Expected data type: "${type}", but the data type received in backend response: "${resultDataType}" for path: ${pathArray} in data:`, source);
    return defaultValue;
  }
  return (src) => typedPathOr(type, defaultValue, pathArray, src);
};

/**
 *
 * @param defaultValue
 * @param pathArray
 * @param source
 * @returns {*|(function(*=): *)}
 */
export const pathOrString = (defaultValue, pathArray, source) => typedPathOr('string', defaultValue, pathArray, source);
export const pathOrArray = (defaultValue, pathArray, source) => typedPathOr('array', defaultValue, pathArray, source);
export const pathOrObject = (defaultValue, pathArray, source) => typedPathOr('object', defaultValue, pathArray, source);
export const pathOrBoolean = (defaultValue, pathArray, source) => typedPathOr('boolean', defaultValue, pathArray, source);
export const pathOrNumber = (defaultValue, pathArray, source) => typedPathOr('number', defaultValue, pathArray, source);
