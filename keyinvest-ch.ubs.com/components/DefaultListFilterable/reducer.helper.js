import {
  assocPath, concat, mergeLeft, pathOr,
} from 'ramda';
import produce from 'immer';

export const updateAllSubLists = (list, itemNewValue) => produce(list, (draft) => {
  Object.keys(draft).forEach((item) => {
    if (draft[item]) {
      if (draft[item].list) {
        draft[item].list = updateAllSubLists(draft[item].list, itemNewValue);
      }
      draft[item] = mergeLeft(itemNewValue, draft[item]);
    }
  });
  return draft;
});

/**
 * Override values from 'source' into 'destination' based on the list of mappings
 *
 * @param pathsMapping - [{storePath: [], responsePath: [], fallbackValue: *}]
 * @param source - eg. API response
 * @param destination - eg. storeDraft
 * @param uniqId - eg. draft[uniqListId]
 * @returns {*}
 */
export const applyOverridesFromResponseToStore = (
  pathsMapping, source, destination, uniqId,
) => {
  if (pathsMapping && Array.isArray(pathsMapping)) {
    pathsMapping.forEach((pathToUpdate) => {
      if (Array.isArray(pathToUpdate.storePath) && Array.isArray(pathToUpdate.responsePath)) {
        const fullPathStoreToUpdate = ['data', ...pathToUpdate.storePath];
        const fullPathResponseToUpdate = ['data', ...pathToUpdate.responsePath];
        const valueToSet = pathOr(pathToUpdate.fallbackValue, fullPathResponseToUpdate, source);
        if (valueToSet !== undefined) {
          destination[uniqId] = assocPath(
            fullPathStoreToUpdate,
            valueToSet,
            destination[uniqId],
          );
        }
      }
    });
  }
  return destination[uniqId];
};

/**
 * Appending lists from 'source' into 'destination' based on the list mappings
 * @param pathsMapping - [{storePath: [], responsePath: [], fallbackValue: *}]
 * @param source - eg. API response
 * @param destination - eg. storeDraft
 * @param uniqId - eg. draft[uniqListId]
 * @returns {*}
 */
export const applyAppendsFromResponseToStore = (
  pathsMapping, source, destination, uniqId,
) => {
  if (pathsMapping && Array.isArray(pathsMapping)) {
    pathsMapping.forEach((pathOfListToAppend) => {
      if (
        Array.isArray(pathOfListToAppend.storePath)
        && Array.isArray(pathOfListToAppend.responsePath)
      ) {
        const fullPathResponseOfListToAppend = ['data', ...pathOfListToAppend.responsePath];
        const fullPathStoreOfListToAppend = ['data', ...pathOfListToAppend.storePath];
        const currentRows = pathOr(
          [], fullPathStoreOfListToAppend, destination[uniqId],
        );
        const additionalRows = pathOr(null, fullPathResponseOfListToAppend, source);
        if (additionalRows && Array.isArray(additionalRows)) {
          destination[uniqId] = assocPath(
            fullPathStoreOfListToAppend,
            concat(currentRows, additionalRows),
            destination[uniqId],
          );
        }
      }
    });
  }
  return destination[uniqId];
};
