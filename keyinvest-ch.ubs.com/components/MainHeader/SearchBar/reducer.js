import produce from 'immer';
import {
  SEARCH_BAR_BACKEND_ERROR,
  SEARCH_BAR_CLEAR_SEARCH_RESULTS,
  SEARCH_BAR_DISMISS_BACKEND_ERROR_MESSAGE,
  SEARCH_BAR_ENTER_PRESSED,
  SEARCH_BAR_GOT_SEARCH_RESULTS,
  SEARCH_BAR_LOADING_SEARCH_RESULTS,
  SEARCH_BAR_SET_FOCUS,
} from './actions';

export const initialState = {
  searchResults: null,
  loadingSearchResults: false,
  isEnterPressed: false,
  searchIsFocused: false,
  isBackendError: null,
};

const searchBarReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case SEARCH_BAR_GOT_SEARCH_RESULTS:
      draft.searchResults = action.searchResults;
      draft.loadingSearchResults = false;
      break;
    case SEARCH_BAR_LOADING_SEARCH_RESULTS:
      draft.loadingSearchResults = true;
      draft.isBackendError = initialState.isBackendError;
      break;
    case SEARCH_BAR_CLEAR_SEARCH_RESULTS:
      draft.searchResults = null;
      break;
    case SEARCH_BAR_SET_FOCUS:
      draft.searchIsFocused = action.status;
      break;
    case SEARCH_BAR_ENTER_PRESSED:
      draft.isEnterPressed = action.isEnterPressed;
      break;
    case SEARCH_BAR_BACKEND_ERROR:
      draft.loadingSearchResults = false;
      draft.isBackendError = action.error;
      break;
    case SEARCH_BAR_DISMISS_BACKEND_ERROR_MESSAGE:
      draft.isBackendError = initialState.isBackendError;
      break;
    default:
      break;
  }
});

export default searchBarReducer;
