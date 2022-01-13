export const GLOBAL_UPDATE_RESPONSIVE_MODE = 'Global/GLOBAL_UPDATE_RESPONSIVE_MODE';
export const GLOBAL_UPDATE_STATE_NAME = 'Global/GLOBAL_UPDATE_STATE_NAME';
export const GLOBAL_UPDATE_CURRENT_NAVIGATION_ITEM_DATA = 'Global/GLOBAL_UPDATE_CURRENT_NAVIGATION_ITEM_DATA';

export const GLOBAL_UPDATE_PROFILER_BANNER = 'Global/GLOBAL_UPDATE_PROFILER_BANNER';
export const GLOBAL_CLEAR_PROFILER_BANNER = 'Global/GLOBAL_CLEAR_PROFILER_BANNER';

export const GLOBAL_SET_DISCLAIMER_STATUS = 'Global/GLOBAL_SET_DISCLAIMER_STATUS';
export const GLOBAL_ACCEPT_DISCLAIMER = 'Global/GLOBAL_ACCEPT_DISCLAIMER';
export const GLOBAL_DISCLAIMER_ACCEPTED_ONCE_FOR_SESSION = 'Global/GLOBAL_DISCLAIMER_ACCEPTED_ONCE_FOR_SESSION';

export const GLOBAL_SET_DISPLAY_COOKIES_SETTINGS_POPUP = 'Global/GLOBAL_SET_DISPLAY_COOKIES_SETTINGS_POPUP';

export const GLOBAL_ERROR_OCCURRED = 'Global/GLOBAL_ERROR_OCCURRED';
export const GLOBAL_ERROR_CLEAR = 'Global/GLOBAL_ERROR_CLEAR';
export const GLOBAL_HTTP_ERROR = 'Global/GLOBAL_HTTP_ERROR';

export const GLOBAL_SCROLL_TO_TOP = 'Global/GLOBAL_SCROLL_TO_TOP';

export function globalUpdateResponsiveMode(responsiveMode) {
  return {
    type: GLOBAL_UPDATE_RESPONSIVE_MODE,
    responsiveMode,
  };
}

export function globalUpdateStateName(stateName) {
  return {
    type: GLOBAL_UPDATE_STATE_NAME,
    stateName,
  };
}

export function globalUpdateCurrentNavigationItemData(
  navigationItemData,
  shouldMergeIntoCurrentData = false,
) {
  return {
    type: GLOBAL_UPDATE_CURRENT_NAVIGATION_ITEM_DATA,
    navigationItemData,
    shouldMergeIntoCurrentData,
  };
}

export function globalUpdateProfilerBanner(data) {
  return {
    type: GLOBAL_UPDATE_PROFILER_BANNER,
    data,
  };
}

export function globalSetDisclaimerStatus(showDisclaimer) {
  return {
    type: GLOBAL_SET_DISCLAIMER_STATUS,
    showDisclaimer,
  };
}

export function globalAcceptDisclaimer(longTerm) {
  return {
    type: GLOBAL_ACCEPT_DISCLAIMER,
    longTerm,
  };
}

export function globalDisclaimerAcceptedOnceForSession() {
  return {
    type: GLOBAL_DISCLAIMER_ACCEPTED_ONCE_FOR_SESSION,
  };
}

export function globalClearProfilerBanner() {
  return {
    type: GLOBAL_CLEAR_PROFILER_BANNER,
  };
}

export function globalErrorOccurred(errorCode, message) {
  return {
    type: GLOBAL_ERROR_OCCURRED,
    errorCode,
    message,
  };
}

export function globalErrorClear() {
  return {
    type: GLOBAL_ERROR_CLEAR,
  };
}

export function globalSetHttpError(url, params, response) {
  return {
    type: GLOBAL_HTTP_ERROR,
    url,
    params,
    response,
  };
}

export function globalSetDisplayCookiesSettingsPopup(showCookiesSettingsPopup) {
  return {
    type: GLOBAL_SET_DISPLAY_COOKIES_SETTINGS_POPUP,
    showCookiesSettingsPopup,
  };
}

export function globalScrollToTop() {
  return {
    type: GLOBAL_SCROLL_TO_TOP,
  };
}
