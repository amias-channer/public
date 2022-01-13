import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import { pathOr } from 'ramda';
import moment from 'moment';
import {
  USER_PROFILE_EDIT_PAGE_FETCH_DATA,
  USER_PROFILE_EDIT_PAGE_SUBMIT_FORM,
  userProfileEditPageGotData,
  userProfileEditPageGotError,
  userProfileEditPageSubmitFormSuccess,
} from './actions';
import HttpService, { REQUEST_METHOD_POST } from '../../utils/httpService';
import Logger from '../../utils/logger';
import { DEFAULT_GENERATE_TOKEN_PATH } from '../../components/Forms/Forms.helper';
import i18n from '../../utils/i18n';

const getUpdatedFormData = (state) => pathOr({}, ['userProfileEditPage', 'data', 'userProfile'], state);

export function* fetchUserProfileData(action) {
  try {
    const response = yield call(
      HttpService.fetch,
      action.url,
    );
    yield put(userProfileEditPageGotData(response.data));
  } catch (e) {
    Logger.error(action.type, 'Failed to fetch data', e);
    yield put(userProfileEditPageGotError(pathOr(i18n.t('error_message_technical_problem'), ['message'], e)));
  }
}

export function getCsrfToken(url) {
  try {
    return call(
      HttpService.fetch,
      url + DEFAULT_GENERATE_TOKEN_PATH,
    );
  } catch (e) {
    Logger.error('Failed getCsrfToken for ', url, e);
    return e;
  }
}

export function* updateUserProfileData(action) {
  try {
    const updatedData = yield select(getUpdatedFormData);
    const { birthDate } = updatedData;
    const birthDateMoment = moment(birthDate);
    updatedData.birthDate = birthDateMoment.unix();
    const params = {
      method: REQUEST_METHOD_POST,
      data: updatedData,
    };
    yield getCsrfToken(action.url);
    const response = yield call(
      HttpService.fetch,
      action.url,
      params,
    );
    yield put(userProfileEditPageGotData(response.data));
    yield put(userProfileEditPageSubmitFormSuccess('user_profile_update_success'));
  } catch (e) {
    Logger.error(action.type, 'Failed to fetch data', e);
    yield put(userProfileEditPageGotError(pathOr(i18n.t('error_message_technical_problem'), ['message'], e)));
  }
}

export const userProfileEditPageSagas = [
  takeLatest(USER_PROFILE_EDIT_PAGE_FETCH_DATA, fetchUserProfileData),
  takeLatest(USER_PROFILE_EDIT_PAGE_SUBMIT_FORM, updateUserProfileData),
];
