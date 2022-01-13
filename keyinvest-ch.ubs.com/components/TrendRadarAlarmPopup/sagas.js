import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import {
  TREND_RADAR_ALARM_POPUP_FETCH_ALERTS_DATA,
  TREND_RADAR_ALARM_POPUP_SUBMIT_FORM,
  trendRadarAlarmPopupSetBackendError,
  trendRadarAlarmPopupGotAlertsData,
  trendRadarAlarmPopupSetFormErrors,
  trendRadarAlarmPopupFormSubmitSuccess,
} from './actions';
import HttpService from '../../utils/httpService';
import {
  trendRadarDetailsPageGotBackendError,
} from '../../pages/TrendRadarDetailsPage/actions';
import Logger from '../../utils/logger';
import {
  getBackendSearchableState,
  getFormFieldsByAlertMethodFromStore,
  getFormFieldsForLevels,
  getFormQueryParameters,
  getFormSelectedDataToSubmit,
  getPopupState,
  validateFormFields,
} from './TrendRadarAlarmPopup.helper';
import {
  DEFAULT_GENERATE_TOKEN_PATH,
  FORM_CONTENT_TYPE_APPLICATION_X_FORM,
  FORM_HEADER_KEY_CONTENT_TYPE,
  FORM_METHOD_POST,
} from '../Forms/Forms.helper';

function getCsrfToken(url) {
  try {
    return call(
      HttpService.fetch,
      HttpService.getPageApiUrl() + url + DEFAULT_GENERATE_TOKEN_PATH,
    );
  } catch (e) {
    Logger.error('Failed getCsrfToken for ', url, e);
    return e;
  }
}

export function* fetchAlertsData(action) {
  try {
    if (!action.url) {
      Logger.error(action.type, 'TrendRadarAlarmPopup/sagas::fetchAlertsData: URL to fetch Alert forms data not provided!');
      return;
    }
    const response = yield call(HttpService.fetch, `${HttpService.getPageApiUrl()}${action.url}`);
    yield put(trendRadarAlarmPopupGotAlertsData(response));
  } catch (e) {
    yield put(trendRadarDetailsPageGotBackendError(e));
    Logger.error(action.type, e);
  }
}

export function* submitAlertsForm(action) {
  const { selectedAlertMethod } = action;
  const popupState = yield select(getPopupState);
  const backendSearchableState = yield select(getBackendSearchableState);
  const formFieldsData = yield select(getFormFieldsByAlertMethodFromStore, selectedAlertMethod);
  const formQueryParameters = yield select(getFormQueryParameters);

  const formSelectedData = yield {
    ...getFormSelectedDataToSubmit(
      selectedAlertMethod,
      popupState,
      backendSearchableState,
    ),
    ...formQueryParameters,
  };

  try {
    const formErrors = yield validateFormFields(
      formSelectedData,
      getFormFieldsForLevels(formFieldsData),
    );
    if (formErrors.length > 0) {
      yield put(trendRadarAlarmPopupSetFormErrors(formErrors));
    } else {
      try {
        yield getCsrfToken(action.url);
        const response = yield call(HttpService.fetch, `${HttpService.getPageApiUrl()}${action.url}`, {
          method: FORM_METHOD_POST,
          headers: {
            [FORM_HEADER_KEY_CONTENT_TYPE]: FORM_CONTENT_TYPE_APPLICATION_X_FORM,
          },
          data: formSelectedData,
        });

        if (response.data && response.data.message) {
          const resp = yield call(HttpService.fetch, `${HttpService.getPageApiUrl()}${action.fetchFormsDataUrl}`);
          yield put(trendRadarAlarmPopupGotAlertsData(resp));
          yield put(trendRadarAlarmPopupFormSubmitSuccess(response.data.message));
        }
      } catch (e) {
        Logger.error(action.type, e.message);
        yield put(trendRadarAlarmPopupSetBackendError(e.message));
      }
    }
  } catch (e) {
    Logger.error('TrendRadarAlarmPopup::submitAlertsForm', 'Form validation error', e);
  }
}

export const trendRadarAlarmPopupSagas = [
  takeLatest(TREND_RADAR_ALARM_POPUP_FETCH_ALERTS_DATA, fetchAlertsData),
  takeLatest(TREND_RADAR_ALARM_POPUP_SUBMIT_FORM, submitAlertsForm),
];
