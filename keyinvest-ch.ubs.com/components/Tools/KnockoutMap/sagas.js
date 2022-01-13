import { call, takeEvery, put } from 'redux-saga/effects';
import HttpService from '../../../utils/httpService';
import {
  KNOCK_OUT_MAP_FETCH_DATA,
  knockoutMapGotData,
} from './actions';
import Logger from '../../../utils/logger';


export function* fetchContent(action) {
  try {
    const response = yield call(HttpService.fetch, action.url);
    if (response && response.data) {
      yield put(knockoutMapGotData(response.data));
    }
  } catch (e) {
    Logger.error('KNOCK_OUT_MAP_SAGAS', 'Failed to fetch content in method fetchContent()', e);
  }
}

export const knockoutMapSagas = [
  takeEvery(KNOCK_OUT_MAP_FETCH_DATA, fetchContent),
];
