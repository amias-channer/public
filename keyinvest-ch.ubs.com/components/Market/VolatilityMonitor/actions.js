export const VOLATILITY_MONITOR_FETCH_CONTENT = 'VolatilityMonitor/VOLATILITY_MONITOR_PAGE_FETCH_CONTENT';
export const VOLATILITY_MONITOR_GOT_CONTENT = 'VolatilityMonitor/VOLATILITY_MONITOR_PAGE_GOT_CONTENT';
export const VOLATILITY_MONITOR_WILL_UNMOUNT = 'VolatilityMonitor/VOLATILITY_MONITOR_PAGE_WILL_UNMOUNT';
export const VOLATILITY_MONITOR_SET_ACTIVE_CHART_SIN = 'VolatilityMonitor/VOLATILITY_MONITOR_SET_ACTIVE_CHART_SIN';
export const VOLATILITY_MONITOR_SET_ACTIVE_CHART_TIMESPAN = 'VolatilityMonitor/VOLATILITY_MONITOR_SET_ACTIVE_CHART_TIMESPAN';

export function volatilityMonitorFetchContent() {
  return {
    type: VOLATILITY_MONITOR_FETCH_CONTENT,
  };
}

export function volatilityMonitorGotContent(data) {
  return {
    type: VOLATILITY_MONITOR_GOT_CONTENT,
    response: data,
  };
}
export function volatilityMonitorWillUnmount() {
  return {
    type: VOLATILITY_MONITOR_WILL_UNMOUNT,
  };
}

export function volatilityMonitorSetActiveChartSin(sin) {
  return {
    type: VOLATILITY_MONITOR_SET_ACTIVE_CHART_SIN,
    sin,
  };
}

export function volatilityMonitorSetActiveChartTimespan(timespan) {
  return {
    type: VOLATILITY_MONITOR_SET_ACTIVE_CHART_TIMESPAN,
    timespan,
  };
}
