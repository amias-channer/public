export const TREND_RADAR_ALARM_POPUP_FETCH_ALERTS_DATA = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_FETCH_ALERTS_DATA';
export const TREND_RADAR_ALARM_POPUP_GOT_ALERTS_DATA = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_GOT_ALERTS_DATA';
export const TREND_RADAR_ALARM_POPUP_SET_ALERT_METHOD = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_SET_ALERT_METHOD';
export const TREND_RADAR_ALARM_POPUP_FORM_FIELD_CHANGE = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_FORM_FIELD_CHANGE';
export const TREND_RADAR_ALARM_POPUP_SUBMIT_FORM = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_SUBMIT_FORM';
export const TREND_RADAR_ALARM_POPUP_SET_FORM_ERRORS = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_SET_FORM_ERRORS';
export const TREND_RADAR_ALARM_POPUP_FORM_ALERT_DISMISS = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_FORM_ALERT_DISMISS';
export const TREND_RADAR_ALARM_POPUP_SET_BACKEND_ERROR = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_SET_BACKEND_ERROR';
export const TREND_RADAR_ALARM_POPUP_FORM_SUBMIT_SUCCESS = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_FORM_SUBMIT_SUCCESS';
export const TREND_RADAR_ALARM_POPUP_FORM_VALIDATION_ERROR_DISMISS = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_FORM_VALIDATION_ERROR_DISMISS';
export const TREND_RADAR_ALARM_POPUP_FORM_DID_UNMOUNT = 'TrendRadarAlarmPopup/TREND_RADAR_ALARM_POPUP_FORM_DID_UNMOUNT';

export function trendRadarAlarmPopupFetchAlertsData(url) {
  return {
    type: TREND_RADAR_ALARM_POPUP_FETCH_ALERTS_DATA,
    url,
  };
}

export function trendRadarAlarmPopupGotAlertsData(response) {
  return {
    type: TREND_RADAR_ALARM_POPUP_GOT_ALERTS_DATA,
    response,
  };
}

export function trendRadarAlarmPopupSetAlertType(method) {
  return {
    type: TREND_RADAR_ALARM_POPUP_SET_ALERT_METHOD,
    method,
  };
}

export function trendRadarAlarmPopupFormFieldChange(
  currentTarget, stateDataSource, fieldType, listItemIndex,
) {
  return {
    type: TREND_RADAR_ALARM_POPUP_FORM_FIELD_CHANGE,
    currentTarget,
    stateDataSource,
    fieldType,
    listItemIndex,
  };
}

export function trendRadarAlarmPopupSubmitForm(url, selectedAlertMethod, fetchFormsDataUrl) {
  return {
    type: TREND_RADAR_ALARM_POPUP_SUBMIT_FORM,
    url,
    selectedAlertMethod,
    fetchFormsDataUrl,
  };
}

export function trendRadarAlarmPopupSetFormErrors(errors) {
  return {
    type: TREND_RADAR_ALARM_POPUP_SET_FORM_ERRORS,
    errors,
  };
}

export function trendRadarAlarmPopupFormAlertDismiss(alertIndex) {
  return {
    type: TREND_RADAR_ALARM_POPUP_FORM_ALERT_DISMISS,
    alertIndex,
  };
}

export function trendRadarAlarmPopupSetBackendError(error) {
  return {
    type: TREND_RADAR_ALARM_POPUP_SET_BACKEND_ERROR,
    error,
  };
}

export function trendRadarAlarmPopupFormSubmitSuccess(success) {
  return {
    type: TREND_RADAR_ALARM_POPUP_FORM_SUBMIT_SUCCESS,
    success,
  };
}

export function trendRadarAlarmPopupFormValidationErrorDismiss(index) {
  return {
    type: TREND_RADAR_ALARM_POPUP_FORM_VALIDATION_ERROR_DISMISS,
    index,
  };
}

export function trendRadarAlarmPopupFormDidUnmount() {
  return {
    type: TREND_RADAR_ALARM_POPUP_FORM_DID_UNMOUNT,
  };
}
