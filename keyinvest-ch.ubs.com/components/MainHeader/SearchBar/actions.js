export const SEARCH_BAR_GET_SEARCH_RESULTS = 'SearchBar/SEARCH_BAR_GET_SEARCH_RESULTS';
export const SEARCH_BAR_GOT_SEARCH_RESULTS = 'SearchBar/SEARCH_BAR_GOT_SEARCH_RESULTS';
export const SEARCH_BAR_LOADING_SEARCH_RESULTS = 'SearchBar/SEARCH_BAR_LOADING_SEARCH_RESULTS';
export const SEARCH_BAR_SET_FOCUS = 'SearchBar/SEARCH_BAR_SET_FOCUS';
export const SEARCH_BAR_CLEAR_SEARCH_RESULTS = 'SearchBar/SEARCH_BAR_CLEAR_SEARCH_RESULTS';
export const SEARCH_BAR_ENTER_PRESSED = 'SearchBar/SEARCH_BAR_ENTER_PRESSED';
export const SEARCH_BAR_ACCESS_FIRST_RESULT = 'SearchBar/SEARCH_BAR_ACCESS_FIRST_RESULT';
export const SEARCH_BAR_BACKEND_ERROR = 'SearchBar/SEARCH_BAR_BACKEND_ERROR';
export const SEARCH_BAR_DISMISS_BACKEND_ERROR_MESSAGE = 'SearchBar/SEARCH_BAR_DISMISS_BACKEND_ERROR_MESSAGE';

export function searchBarGetSearchResults(searchQuery) {
  return {
    type: SEARCH_BAR_GET_SEARCH_RESULTS,
    searchQuery,
  };
}

export function searchBarGotSearchResults(searchResults) {
  return {
    type: SEARCH_BAR_GOT_SEARCH_RESULTS,
    searchResults,
  };
}

export function searchBarLoadingSearchResults() {
  return {
    type: SEARCH_BAR_LOADING_SEARCH_RESULTS,
  };
}

export function searchBarClearSearchResults() {
  return {
    type: SEARCH_BAR_CLEAR_SEARCH_RESULTS,
  };
}

export function searchBarSetFocus(status) {
  return {
    type: SEARCH_BAR_SET_FOCUS,
    status,
  };
}

export function searchBarEnterPressed(isEnterPressed) {
  return {
    type: SEARCH_BAR_ENTER_PRESSED,
    isEnterPressed,
  };
}

export function searchBarAccessFirstResult() {
  return {
    type: SEARCH_BAR_ACCESS_FIRST_RESULT,
  };
}

export function searchBarBackendError(error) {
  return {
    type: SEARCH_BAR_BACKEND_ERROR,
    error,
  };
}

export function searchBarDismissBackendErrorMessage() {
  return {
    type: SEARCH_BAR_DISMISS_BACKEND_ERROR_MESSAGE,
  };
}
