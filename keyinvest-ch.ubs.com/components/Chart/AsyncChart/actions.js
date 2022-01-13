export const ASYNC_CHART_FETCH_CONTENT = 'AsyncChart/ASYNC_CHART_FETCH_CONTENT';
export const ASYNC_CHART_GOT_CONTENT = 'AsyncChart/ASYNC_CHART_GOT_CONTENT';
export const ASYNC_CHART_WILL_UNMOUNT = 'AsyncChart/ASYNC_CHART_WILL_UNMOUNT';

export function asyncChartFetchContent(uniqKey, url) {
  return {
    type: ASYNC_CHART_FETCH_CONTENT,
    uniqKey,
    url,
  };
}

export function asyncChartGotContent(uniqKey, data) {
  return {
    type: ASYNC_CHART_GOT_CONTENT,
    uniqKey,
    data,
  };
}
export function asyncChartWillUnmount(uniqKey) {
  return {
    type: ASYNC_CHART_WILL_UNMOUNT,
    uniqKey,
  };
}
