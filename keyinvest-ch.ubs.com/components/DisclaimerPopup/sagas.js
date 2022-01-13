import {
  takeLatest, put, call,
} from 'redux-saga/effects';
import HttpService from '../../utils/httpService';
import { GLOBAL_ACCEPT_DISCLAIMER, globalSetDisclaimerStatus } from '../../main/actions';
import { getDisclaimerAcceptUrl } from './DisclaimerPopup.helper';

export function* acceptDisclaimer(action) {
  try {
    const queryParams = action.longTerm ? '?longTerm=1' : '';
    yield put(globalSetDisclaimerStatus(false));
    yield call(
      HttpService.fetch,
      HttpService.generateUrl(getDisclaimerAcceptUrl()) + queryParams,
    );
  } catch (e) {
    yield put(globalSetDisclaimerStatus(false));
  }
}

export const disclaimerPopupSagas = [
  takeLatest(GLOBAL_ACCEPT_DISCLAIMER, acceptDisclaimer),
];
