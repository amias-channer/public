export const TREND_RADAR_DETAILS_PAGE_FETCH_CONTENT = 'TrendRadarDetailsPage/TREND_RADAR_DETAILS_PAGE_FETCH_CONTENT';
export const TREND_RADAR_DETAILS_PAGE_GOT_CONTENT = 'TrendRadarDetailsPage/TREND_RADAR_DETAILS_PAGE_GOT_CONTENT';
export const TREND_RADAR_DETAILS_PAGE_GOT_BACKEND_ERROR = 'TrendRadarDetailsPage/TREND_RADAR_DETAILS_PAGE_GOT_BACKEND_ERROR';
export const TREND_RADAR_DETAILS_PAGE_SHOW_LOGIN_REGISTER_MESSAGE = 'TrendRadarDetailsPage/TREND_RADAR_DETAILS_PAGE_SHOW_LOGIN_REGISTER_MESSAGE';
export const TREND_RADAR_DETAILS_PAGE_HIDE_LOGIN_REGISTER_MESSAGE = 'TrendRadarDetailsPage/TREND_RADAR_DETAILS_PAGE_HIDE_LOGIN_REGISTER_MESSAGE';
export const TREND_RADAR_DETAILS_PAGE_TOGGLE_DISPLAY_ALARM_POPUP = 'TrendRadarDetailsPage/TREND_RADAR_DETAILS_PAGE_TOGGLE_DISPLAY_ALARM_POPUP';
export const TREND_RADAR_DETAILS_PAGE_TOGGLE_SAVE_SIGNAL_POPUP = 'TrendRadarDetailsPage/TREND_RADAR_DETAILS_PAGE_TOGGLE_SAVE_SIGNAL_POPUP';

export function trendRadarDetailsPageFetchContent(url, params) {
  return {
    type: TREND_RADAR_DETAILS_PAGE_FETCH_CONTENT,
    url,
    params,
  };
}

export function trendRadarDetailsPageGotContent(response) {
  return {
    type: TREND_RADAR_DETAILS_PAGE_GOT_CONTENT,
    response,
  };
}

export function trendRadarDetailsPageGotBackendError(error) {
  return {
    type: TREND_RADAR_DETAILS_PAGE_GOT_BACKEND_ERROR,
    error,
  };
}

export function trendRadarDetailsPageShowLoginRegisterMessage() {
  return {
    type: TREND_RADAR_DETAILS_PAGE_SHOW_LOGIN_REGISTER_MESSAGE,
  };
}

export function trendRadarDetailsPageHideLoginRegisterMessage() {
  return {
    type: TREND_RADAR_DETAILS_PAGE_HIDE_LOGIN_REGISTER_MESSAGE,
  };
}

export function trendRadarDetailsToggleDisplayAlarmPopup(shouldDisplayPopup) {
  return {
    type: TREND_RADAR_DETAILS_PAGE_TOGGLE_DISPLAY_ALARM_POPUP,
    shouldDisplayPopup,
  };
}

export function trendRadarDetailsToggleSaveSignalPopup(shouldDisplayPopup) {
  return {
    type: TREND_RADAR_DETAILS_PAGE_TOGGLE_SAVE_SIGNAL_POPUP,
    shouldDisplayPopup,
  };
}
