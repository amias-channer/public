export const MY_SEARCHES_FETCH_DATA = 'MySearches/MY_SEARCHES_FETCH_DATA';
export const MY_SEARCHES_GOT_DATA = 'MySearches/MY_SEARCHES_GOT_DATA';

export const MY_SEARCHES_SAVE = 'MySearches/MY_SEARCHES_SAVE';
export const MY_SEARCHES_GOT_SAVE = 'MySearches/MY_SEARCHES_GOT_SAVE';

export const MY_SEARCHES_UPDATE_NAME = 'MySearches/MY_SEARCHES_UPDATE_NAME';
export const MY_SEARCHES_GOT_UPDATE_NAME = 'MySearches/MY_SEARCHES_GOT_UPDATE_NAME';

export const MY_SEARCHES_REMOVE = 'MySearches/MY_SEARCHES_REMOVE';
export const MY_SEARCHES_GOT_REMOVE = 'MySearches/MY_SEARCHES_GOT_REMOVE';

export const MY_SEARCHES_TOGGLE_SAVE_POPUP = 'MySearches/MY_SEARCHES_TOGGLE_SAVE_POPUP';

export const MY_SEARCHES_WILL_UNMOUNT = 'MySearches/MY_SEARCHES_WILL_UNMOUNT';

export const MY_SEARCHES_ON_SEARCH_NAME_CHANGE = 'MySearches/MY_SEARCHES_ON_SEARCH_NAME_CHANGE';
export const MY_SEARCHES_CLEAR_SEARCH_NAME = 'MySearches/MY_SEARCHES_CLEAR_SEARCH_NAME';

export const MY_SEARCHES_ERROR = 'MySearches/MY_SEARCHES_ERROR';
export const MY_SEARCHES_FAILURE_DISMISS = 'MySearches/MY_SEARCHES_FAILURE_DISMISS';
export const MY_SEARCHES_SUCCESS_DISMISS = 'MySearches/MY_SEARCHES_SUCCESS_DISMISS';

export function mySearchesFetchData() {
  return {
    type: MY_SEARCHES_FETCH_DATA,
  };
}


export function mySearchesGotData(data, failure) {
  return {
    type: MY_SEARCHES_GOT_DATA,
    data,
    failure,
  };
}

export function mySearchesSave(saveEndpoint, searchName, searchUrl, tags, stateName) {
  return {
    type: MY_SEARCHES_SAVE,
    saveEndpoint,
    searchName,
    searchUrl,
    tags,
    stateName,
  };
}


export function mySearchesGotSave(success, failure) {
  return {
    type: MY_SEARCHES_GOT_SAVE,
    success,
    failure,
  };
}

export function mySearchesUpdateName(item, newName) {
  return {
    type: MY_SEARCHES_UPDATE_NAME,
    item,
    newName,
  };
}


export function mySearchesGotUpdateName(data, failure) {
  return {
    type: MY_SEARCHES_GOT_UPDATE_NAME,
    data,
    failure,
  };
}

export function mySearchesRemove(item) {
  return {
    type: MY_SEARCHES_REMOVE,
    item,
  };
}


export function mySearchesGotRemove(data, failure) {
  return {
    type: MY_SEARCHES_GOT_REMOVE,
    data,
    failure,
  };
}

export function toggleSaveSearchPopup(visible, filtersData) {
  return {
    type: MY_SEARCHES_TOGGLE_SAVE_POPUP,
    visible,
    filtersData,
  };
}

export function mySearchesWillUnmount() {
  return {
    type: MY_SEARCHES_WILL_UNMOUNT,
  };
}

export function mySearchesOnSearchNameChange(updatedName) {
  return {
    type: MY_SEARCHES_ON_SEARCH_NAME_CHANGE,
    updatedName,
  };
}

export function mySearchesClearSearchName() {
  return {
    type: MY_SEARCHES_CLEAR_SEARCH_NAME,
  };
}

export function mySearchesError(error) {
  return {
    type: MY_SEARCHES_ERROR,
    error,
  };
}

export function mySearchesFailureDismiss() {
  return {
    type: MY_SEARCHES_FAILURE_DISMISS,
  };
}
