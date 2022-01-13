export const DERI_RISK_INDICATOR_FETCH_CONTENT = 'DeriRiskIndicator/DERI_RISK_INDICATOR_FETCH_CONTENT';
export const DERI_RISK_INDICATOR_GOT_CONTENT = 'DeriRiskIndicator/DERI_RISK_INDICATOR_GOT_CONTENT';
export const DERI_RISK_INDICATOR_SET_ACTIVE_CHART_SIN = 'DeriRiskIndicator/DERI_RISK_INDICATOR_SET_ACTIVE_CHART_SIN';
export const DERI_RISK_INDICATOR_SET_ACTIVE_CHART_TIMESPAN = 'DeriRiskIndicator/DERI_RISK_INDICATOR_SET_ACTIVE_CHART_TIMESPAN';

export function deriRiskIndicatorFetchContent(tileType, trackingData) {
  return {
    type: DERI_RISK_INDICATOR_FETCH_CONTENT,
    tileType,
    trackingData,
  };
}

export function deriRiskIndicatorSetActiveChartSin(sin) {
  return {
    type: DERI_RISK_INDICATOR_SET_ACTIVE_CHART_SIN,
    sin,
  };
}

export function deriRiskIndicatorSetActiveChartTimespan(timespan) {
  return {
    type: DERI_RISK_INDICATOR_SET_ACTIVE_CHART_TIMESPAN,
    timespan,
  };
}

export function deriRiskIndicatorGotContent(data) {
  return {
    type: DERI_RISK_INDICATOR_GOT_CONTENT,
    response: data,
  };
}
