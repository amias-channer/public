export const ANALYTICS_PAGE_LOAD_TRACK = 'Analytics/ANALYTICS_PAGE_LOAD_TRACK';
export const ANALYTICS_CLICK_TRACK = 'Analytics/ANALYTICS_CLICK_TRACK';
export const ANALYTICS_CONTENT_CLICK_TRACK = 'Analytics/ANALYTICS_CONTENT_CLICK_TRACK';
export const ANALYTICS_SEARCH_TRACK = 'Analytics/ANALYTICS_SEARCH_TRACK';
export const ANALYTICS_PRODUCT_TRACK = 'Analytics/ANALYTICS_PRODUCT_TRACK';
export const ANALYTICS_DOC_DOWNLOAD_TRACK = 'Analytics/ANALYTICS_DOC_DOWNLOAD_TRACK';

export const ANALYTICS_FORM_TRACK = 'Analytics/ANALYTICS_FORM_TRACK';
export const ANALYTICS_FORM_TRACK_START = 'Analytics/ANALYTICS_FORM_TRACK_START';

export const ANALYTICS_RESET_FAILED_ATTEMPTS_COUNTER = 'Analytics/ANALYTICS_RESET_FAILED_ATTEMPTS_COUNTER';

export function analyticsResetFailedAttemptsCounter() {
  return {
    type: ANALYTICS_RESET_FAILED_ATTEMPTS_COUNTER,
  };
}

export function analyticsPageLoadTrack(functionName, params) {
  return {
    type: ANALYTICS_PAGE_LOAD_TRACK,
    functionName,
    params,
  };
}

export function analyticsClickTrack(functionName, params) {
  return {
    type: ANALYTICS_CLICK_TRACK,
    functionName,
    params,
  };
}

export function analyticsContentClickTrack(functionName, params) {
  return {
    type: ANALYTICS_CONTENT_CLICK_TRACK,
    functionName,
    params,
  };
}

export function analyticsSearchTrack(functionName, params) {
  return {
    type: ANALYTICS_SEARCH_TRACK,
    functionName,
    params,
  };
}

export function analyticsProductTrack(functionName, params) {
  return {
    type: ANALYTICS_PRODUCT_TRACK,
    functionName,
    params,
  };
}

export function analyticsDocDownloadTrack(functionName, params) {
  return {
    type: ANALYTICS_DOC_DOWNLOAD_TRACK,
    functionName,
    params,
  };
}

export function analyticsFormTrack(functionName, params) {
  return {
    type: ANALYTICS_FORM_TRACK,
    functionName,
    params,
  };
}

export function analyticsFormTrackStart(formName, formErrorMessage, formDocumentOrderSelected) {
  return {
    type: ANALYTICS_FORM_TRACK_START,
    formName,
    formErrorMessage,
    formDocumentOrderSelected,
  };
}
