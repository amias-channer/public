import {
  call, select,
  debounce, put, takeEvery,
} from 'redux-saga/effects';
import { push } from 'connected-react-router';
import Logger from '../../../utils/logger';
import {
  SEARCH_BAR_ACCESS_FIRST_RESULT,
  SEARCH_BAR_GET_SEARCH_RESULTS,
  searchBarAccessFirstResult,
  searchBarBackendError,
  searchBarClearSearchResults,
  searchBarGotSearchResults,
  searchBarLoadingSearchResults,
  searchBarSetFocus,
}
  from './actions';
import HttpService from '../../../utils/httpService';
import { generateSearchUrl, getUniqSearchResult } from './SearchBar.helper';
import i18n from '../../../utils/i18n';

const getIsEnterPressed = (state) => state.searchBar.isEnterPressed;
const getSearchResultsFromStore = (state) => state.searchBar.searchResults;

export function* getSearchResults(action) {
  yield put(searchBarLoadingSearchResults());
  try {
    const data = yield call(HttpService.fetch, generateSearchUrl(action.searchQuery));
    yield put(searchBarGotSearchResults(data));
    const isEnterPressed = yield select(getIsEnterPressed);
    if (isEnterPressed) {
      yield put(searchBarAccessFirstResult());
    }
  } catch (e) {
    yield put(searchBarBackendError(i18n.t('error_technical_message')));
    Logger.error('SEARCH_BAR', 'Failed to fetch content', e);
  }
}

export function* accessFirstSearchResult() {
  try {
    const searchResults = yield select(getSearchResultsFromStore);
    if (searchResults) {
      const searchItem = getUniqSearchResult(searchResults);
      if (searchItem && searchItem.url) {
        yield put(push(searchItem.url));
        yield put(searchBarClearSearchResults());
        yield put(searchBarSetFocus(false));
      }
    }
  } catch (e) {
    Logger.error('SEARCH_BAR', 'Failed to access url in search result', e);
  }
}

export const searchBarSagas = [
  debounce(400, SEARCH_BAR_GET_SEARCH_RESULTS, getSearchResults),
  takeEvery(SEARCH_BAR_ACCESS_FIRST_RESULT, accessFirstSearchResult),
];
