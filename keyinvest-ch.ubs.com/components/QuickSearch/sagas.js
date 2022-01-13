import {
  call, put, takeEvery,
} from 'redux-saga/effects';
import Logger from '../../utils/logger';
import {
  QUICK_SEARCH_ON_DROPDOWN_CHANGE, quickSearchGotResultData,
}
  from './actions';
import HttpService from '../../utils/httpService';
import getAppConfig from '../../main/AppConfig';


export function* getUnderlyingData(action) {
  const appConfig = getAppConfig();
  try {
    const data = yield call(HttpService.fetch, `${HttpService.generateUrl(`${appConfig.pageApiPath}${action.payload.quickSearchUrl}/sin/${action.selectedItem.sin}`)}`);
    yield put(quickSearchGotResultData(action.uniqId, data, action.selectedItem));
  } catch (e) {
    Logger.error('QUICK_SEARCH', 'Failed to fetch content', e);
  }
}

export const quickSearchSagas = [
  takeEvery(QUICK_SEARCH_ON_DROPDOWN_CHANGE, getUnderlyingData),
];
