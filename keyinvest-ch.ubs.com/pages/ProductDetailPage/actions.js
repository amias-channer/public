export const PRODUCT_DETAIL_PAGE_FETCH_CONTENT = 'ProductDetailPage/PRODUCT_DETAIL_PAGE_FETCH_CONTENT';
export const PRODUCT_DETAIL_PAGE_GOT_CONTENT = 'ProductDetailPage/PRODUCT_DETAIL_PAGE_GOT_CONTENT';
export const PRODUCT_DETAIL_PAGE_FETCH_ERROR = 'ProductDetailPage/PRODUCT_DETAIL_PAGE_FETCH_ERROR';
export const PRODUCT_DETAIL_PAGE_TOGGLE_CHART_TYPE = 'ProductDetailPage/PRODUCT_DETAIL_PAGE_TOGGLE_CHART_TYPE';
export const PRODUCT_DETAIL_PAGE_TOGGLE_CHART_SIN = 'ProductDetailPage/PRODUCT_DETAIL_PAGE_TOGGLE_CHART_SIN';
export const PRODUCT_DETAIL_PAGE_WILL_UNMOUNT = 'ProductDetailPage/PRODUCT_DETAIL_PAGE_WILL_UNMOUNT';
export const PRODUCT_DETAIL_PAGE_TOGGLE_ADD_PRODUCT_TO_WATCHLIST_POPUP = 'ProductDetailPage/PRODUCT_DETAIL_PAGE_TOGGLE_ADD_PRODUCT_TO_WATCHLIST_POPUP';

export function productDetailPageFetchContent(uniqId, params) {
  return {
    type: PRODUCT_DETAIL_PAGE_FETCH_CONTENT,
    uniqId,
    params,
  };
}

export function productDetailPageGotContent(uniqId, data) {
  return {
    type: PRODUCT_DETAIL_PAGE_GOT_CONTENT,
    uniqId,
    data,
  };
}

export function productDetailPageFetchError(uniqId, data) {
  return {
    type: PRODUCT_DETAIL_PAGE_FETCH_ERROR,
    uniqId,
    data,
  };
}

export function productDetailPageToggleChartType(uniqId, chartType, timespan) {
  return {
    type: PRODUCT_DETAIL_PAGE_TOGGLE_CHART_TYPE,
    uniqId,
    chartType,
    timespan,
  };
}

export function productDetailPageToggleChartSin(uniqId, chartType, sin, timespan, status) {
  return {
    type: PRODUCT_DETAIL_PAGE_TOGGLE_CHART_SIN,
    uniqId,
    chartType,
    sin,
    timespan,
    status,
  };
}

export function productDetailPageWillUnmount(uniqId) {
  return {
    type: PRODUCT_DETAIL_PAGE_WILL_UNMOUNT,
    uniqId,
  };
}

export function productDetailPageToggleAddProductToWatchlistPopup() {
  return {
    type: PRODUCT_DETAIL_PAGE_TOGGLE_ADD_PRODUCT_TO_WATCHLIST_POPUP,
  };
}
