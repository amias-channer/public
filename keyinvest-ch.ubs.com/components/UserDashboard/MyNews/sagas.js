import {
  call, put,
  takeLatest,
} from 'redux-saga/effects';
import { MY_NEWS_FETCH_DATA, myNewsGotData } from './actions';
import { initialState } from './reducer';
import HttpService from '../../../utils/httpService';
import Logger from '../../../utils/logger';


export function* fetchData(action) {
  try {
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}/${action.url}`,
    );
    yield put(myNewsGotData(response.data));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_NEWS_SECTION', 'Failed to fetch content', e);
    yield put(myNewsGotData(initialState));
  }
}

export const myNewsSagas = [
  takeLatest(MY_NEWS_FETCH_DATA, fetchData),
];
