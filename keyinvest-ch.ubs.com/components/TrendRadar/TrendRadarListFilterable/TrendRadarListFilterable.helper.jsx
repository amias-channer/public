import {
  equals, findIndex, forEachObjIndexed, pathOr,
} from 'ramda';
import { isEmptyData } from '../../../utils/utils';
import Logger from '../../../utils/logger';
import { PATTERN_ID_KEY } from './TrendRadarSignal/TrendRadarSignal.helper';
import { pathOrString } from '../../../utils/typeChecker';

export const INFINITE_LIST_LOAD_MORE_KEY = 'nextPageParams';
export const TREND_RADAR_URL_LEVERAGE_PRODUCTS_KEY = 'urlProductsCall';
export const EMPTY_RELATED_PRODUCT_LIST = [];
export const RELATED_PRODUCTS_KEY = 'products';
export const TREND_RADAR_ROWS_KEY = 'rows';
export const LIST_ITEM_INDEX_TO_SHOW_BANNER = 2;

export const getPropValueByPath = (data, pth = []) => {
  const value = pathOr(null, pth, data);
  if (value && !isEmptyData(value)) {
    return value;
  }
  return null;
};

export const getAddAlertUrl = (data) => pathOrString('', ['flyoutMenu', 'addAlertUrl'], data);
export const getSaveSignalUrl = (data) => pathOrString('', ['flyoutMenu', 'addSignalUrl'], data);
export const getUnderlyingName = (data) => pathOrString('', ['underlyingName'], data);
export const getPatternTypeName = (data) => pathOrString('', ['patternTypeName'], data);

export const getLoadMoreParameter = (
  data,
) => getPropValueByPath(data, [INFINITE_LIST_LOAD_MORE_KEY]);

export const getLoadRelatedProductsUrl = (
  data,
) => getPropValueByPath(data, [TREND_RADAR_URL_LEVERAGE_PRODUCTS_KEY]);

export const findPatternIndexInRows = (rows, patternId) => {
  if (Array.isArray(rows) && patternId !== undefined && patternId !== null) {
    return findIndex(
      (obj) => equals(String(obj[PATTERN_ID_KEY]), String(patternId)),
    )(rows);
  }
  return -1;
};

/**
 * Create the path to the related products of a specific
 * trend radar signal (by index in array) in the list of rows in the store
 *
 * @param indexInRows
 * @returns {[string, number|string, string]|*[]}
 */
export const generateRelatedProductsStorePath = (indexInRows) => {
  if (typeof indexInRows !== 'number' && typeof indexInRows !== 'string') {
    Logger.warn('TrendRadarListFilterable.helper::generateRelatedProductsStorePath', indexInRows, 'should not be empty, a number or a string');
    return [];
  }
  return [TREND_RADAR_ROWS_KEY, indexInRows, RELATED_PRODUCTS_KEY];
};

/**
 * Create an object to hold storePath, responsePath and fallbackValue
 * to used to update the store from a response in the reducer
 *
 * @param storePath
 * @param responsePath
 * @param fallbackValue
 * @returns {{responsePath: *, storePath: *, fallbackValue: *}}
 */
export const generateResponseDataToStoreUpdater = (
  storePath,
  responsePath = [],
  fallbackValue = undefined,
) => ({
  storePath,
  responsePath,
  fallbackValue,
});

/**
 * Gathering all Paths or patterns to take empty list of related products
 * if no products previously loaded for each signal in the state
 *
 * @param rows
 * @returns {[{storePath: [], responsePath: [], fallbackValue: *}]}
 */
export const getPathsOfRowsWithoutRelatedProducts = (rows) => {
  const listOfPaths = [];
  if (!rows || isEmptyData(rows) || !Array.isArray(rows)) {
    return listOfPaths;
  }

  rows.forEach((pattern, index) => {
    if (pattern && !pattern[RELATED_PRODUCTS_KEY]) {
      listOfPaths.push(
        generateResponseDataToStoreUpdater(
          generateRelatedProductsStorePath(index),
          ['empty'],
          EMPTY_RELATED_PRODUCT_LIST,
        ),
      );
    }
  });

  return listOfPaths;
};
/**
 * Gathering paths of patterns having related products
 * in the related products response to be merge into the store
 *
 * @param responseRelatedProducts
 * @param rows
 * @returns {[{storePath: [], responsePath: [], fallbackValue: *}]}
 */
export const getPathsOfRowsHavingRelatedProductsToBeUpdated = (
  responseRelatedProducts,
  rows,
) => {
  const listOfPaths = [];
  if (
    !responseRelatedProducts
    || isEmptyData(responseRelatedProducts)
  ) {
    return listOfPaths;
  }

  forEachObjIndexed((products, patternId) => {
    const indexInStateRows = findPatternIndexInRows(rows, patternId);
    if (indexInStateRows > -1) {
      listOfPaths.push(
        generateResponseDataToStoreUpdater(
          generateRelatedProductsStorePath(indexInStateRows),
          [patternId],
          EMPTY_RELATED_PRODUCT_LIST,
        ),
      );
    }
  }, responseRelatedProducts);

  return listOfPaths;
};
