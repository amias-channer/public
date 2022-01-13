import {
  takeLatest, put, call,
} from 'redux-saga/effects';

import Logger from '../../../utils/logger';
import HttpService from '../../../utils/httpService';
import { STATE_NAME_MARKET_MEMBERS } from '../../../main/constants';
import { MARKET_MEMBERS_FETCH_CONTENT, marketMembersGotContent } from './actions';


export function* fetchContent() {
  try {
    const response = yield call(HttpService.fetch, `${HttpService.getBackendUrlByStateName(STATE_NAME_MARKET_MEMBERS)}`);
    yield put(marketMembersGotContent(response.data));
  } catch (e) {
    Logger.error('MARKET_MEMBERS_PAGE', 'Failed to fetch content', e);
    yield put(marketMembersGotContent([]));
  }
}

export const marketMembersSagas = [
  takeLatest(MARKET_MEMBERS_FETCH_CONTENT, fetchContent),
];
