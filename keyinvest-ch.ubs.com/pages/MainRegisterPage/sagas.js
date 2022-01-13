import { call, put, takeLatest } from 'redux-saga/effects';
import {
  MAIN_REGISTER_FETCH_CONTENT,
  MAIN_REGISTER_POST_FORM_DATA,
  mainRegisterBeforeFormSubmit,
  mainRegisterFormSubmitError,
  mainRegisterFormSubmitSuccess,
  mainRegisterGotContent,
} from './actions';
import HttpService from '../../utils/httpService';
import { STATE_NAME_MAIN_REGISTER } from '../../main/constants';
import Logger from '../../utils/logger';

export function* fetchMainRegisterContent() {
  try {
    const response = yield call(
      HttpService.fetch,
      HttpService.getBackendUrlByStateName(STATE_NAME_MAIN_REGISTER),
    );
    yield put(mainRegisterGotContent(response.data));
  } catch (e) {
    Logger.error('SERVICE_MAIN_REGISTER_PAGE', 'Failed to fetch content', e);
  }
}

export function* postMainRegisterFormData(action) {
  try {
    yield put(mainRegisterBeforeFormSubmit());
    const response = yield call(
      HttpService.postFormData,
      HttpService.getBackendUrlByStateName(STATE_NAME_MAIN_REGISTER),
      {
        data: action.data,
      },
    );
    if (response) {
      if (response.state === 'OK') {
        yield put(mainRegisterFormSubmitSuccess(response.data));
      }

      if (response.state === 'Error') {
        yield put(mainRegisterFormSubmitError(response));
      }
    }
  } catch (e) {
    Logger.error('SERVICE_MAIN_REGISTER_PAGE', 'Failed to POST form data', e);
    yield put(mainRegisterFormSubmitError(e));
  }
}


export const mainRegisterSagas = [
  takeLatest(MAIN_REGISTER_FETCH_CONTENT, fetchMainRegisterContent),
  takeLatest(MAIN_REGISTER_POST_FORM_DATA, postMainRegisterFormData),
];
