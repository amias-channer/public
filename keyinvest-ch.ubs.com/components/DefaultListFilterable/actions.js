export const DEFAULT_LIST_FILTERABLE_FILTERS_FIRST_LEVEL_TOGGLE_TAB = 'DefaultListFilterable/DEFAULT_LIST_FILTERABLE_FILTERS_FIRST_LEVEL_TOGGLE_TAB';

export const DEFAULT_LIST_FILTERABLE_FETCH_DATA = 'DefaultListFilterable/DEFAULT_LIST_FILTERABLE_FETCH_DATA';
export const DEFAULT_LIST_FILTERABLE_GOT_DATA = 'DefaultListFilterable/DEFAULT_LIST_FILTERABLE_GOT_DATA';

export const DEFAULT_LIST_FILTERABLE_FETCH_MORE_DATA = 'DefaultListFilterable/DEFAULT_LIST_FILTERABLE_FETCH_MORE_DATA';
export const DEFAULT_LIST_FILTERABLE_GOT_MORE_DATA = 'DefaultListFilterable/DEFAULT_LIST_FILTERABLE_GOT_MORE_DATA';

export const DEFAULT_LIST_FILTERABLE_WILL_UNMOUNT = 'DefaultListFilterable/DEFAULT_LIST_FILTERABLE_WILL_UNMOUNT';

export const DEFAULT_LIST_FILTERABLE_TRIGGER_EXPORT = 'DefaultListFilterable/DEFAULT_LIST_FILTERABLE_TRIGGER_EXPORT';

export const DEFAULT_LIST_FILTERABLE_UPDATE_FILTER_LIST_ITEM = 'DefaultListFilterable/DEFAULT_LIST_FILTERABLE_UPDATE_FILTER_LIST_ITEM';

export function defaultListFilterableFiltersFirstLevelToggleTab(uniqDefaultListId, activeTab) {
  return {
    type: DEFAULT_LIST_FILTERABLE_FILTERS_FIRST_LEVEL_TOGGLE_TAB,
    uniqDefaultListId,
    activeTab,
  };
}
export function defaultListFilterableFiltersFetchData(
  stateName, uniqDefaultListId, activeTab, queryString, onLoadFinishedFunc,
) {
  return {
    type: DEFAULT_LIST_FILTERABLE_FETCH_DATA,
    uniqDefaultListId,
    activeTab,
    stateName,
    queryString,
    onLoadFinishedFunc,
  };
}

export function defaultListFilterableGotData(uniqDefaultListId, data, onLoadFinishedFunc) {
  return {
    type: DEFAULT_LIST_FILTERABLE_GOT_DATA,
    uniqDefaultListId,
    data,
    onLoadFinishedFunc,
  };
}

export function defaultListFilterableFiltersFetchMoreData(
  url,
  uniqDefaultListId,
  onLoadMoreFinishedFunc,
  pathsToOverride,
  pathsOfListsToAppend,
) {
  return {
    type: DEFAULT_LIST_FILTERABLE_FETCH_MORE_DATA,
    url,
    uniqDefaultListId,
    onLoadMoreFinishedFunc,
    pathsToOverride,
    pathsOfListsToAppend,
  };
}

export function defaultListFilterableGotMoreData(
  uniqDefaultListId, data,
  pathsToOverride, pathsOfListsToAppend,
) {
  return {
    type: DEFAULT_LIST_FILTERABLE_GOT_MORE_DATA,
    uniqDefaultListId,
    data,
    pathsToOverride,
    pathsOfListsToAppend,
  };
}

export function defaultListFilterableWillUnmount(uniqDefaultListId) {
  return {
    type: DEFAULT_LIST_FILTERABLE_WILL_UNMOUNT,
    uniqDefaultListId,
  };
}

export function defaultListFilterableTriggerExport(jobListKey, fileType) {
  return {
    type: DEFAULT_LIST_FILTERABLE_TRIGGER_EXPORT,
    jobListKey,
    fileType,
  };
}

export function defaultListFilterableUpdateFilterListItem(uniqDefaultListId,
  level,
  filterKey,
  listType,
  itemKey,
  itemValue,
  dataSource,
  innerPath,
  childof) {
  return {
    type: DEFAULT_LIST_FILTERABLE_UPDATE_FILTER_LIST_ITEM,
    uniqDefaultListId,
    level,
    filterKey,
    listType,
    itemKey,
    itemValue,
    dataSource,
    innerPath,
    childof,
  };
}
