export const CHART_MANAGER_INIT_INSTANCE = 'ChartManager/CHART_MANAGER_INIT_INSTANCE';
export const CHART_MANAGER_DESTROY_INSTANCE = 'ChartManager/CHART_MANAGER_DESTROY_INSTANCE';

export const CHART_MANAGER_INSTANCE_READY = 'ChartManager/CHART_MANAGER_INSTANCE_READY';
export const CHART_MANAGER_PUSHABLE_CHART_UPDATE = 'ChartManager/CHART_MANAGER_PUSHABLE_CHART_UPDATE';
export const CHART_MANAGER_SET_CURRENT_TIMESPAN = 'ChartManager/CHART_MANAGER_SET_CURRENT_TIMESPAN';
export const CHART_MANAGER_EMIT_ZOOM_TO_EVENT = 'ChartManager/CHART_MANAGER_EMIT_ZOOM_TO_EVENT';
export const CHART_MANAGER_TOGGLE_CHART_BY_SIN = 'ChartManager/CHART_MANAGER_TOGGLE_CHART_BY_SIN';

export function chartManagerInitInstance(uniqId, chartProps, chartInstance, responsiveMode) {
  return {
    type: CHART_MANAGER_INIT_INSTANCE,
    uniqId,
    chartProps,
    chartInstance,
    responsiveMode,
  };
}

export function chartManagerInstanceReady(uniqId, status) {
  return {
    type: CHART_MANAGER_INSTANCE_READY,
    uniqId,
    status,
  };
}

export function chartManagerPushableChartUpdate(
  uniqId, pushResult, chartDataSetIndex, exportPushResultFunc,
) {
  return {
    type: CHART_MANAGER_PUSHABLE_CHART_UPDATE,
    uniqId,
    pushResult,
    chartDataSetIndex,
    exportPushResultFunc,
  };
}

export function chartManagerSetCurrentTimespan(uniqId, currentTimespan) {
  return {
    type: CHART_MANAGER_SET_CURRENT_TIMESPAN,
    uniqId,
    currentTimespan,
  };
}

export function chartManagerEmitZoomToEvent(uniqId, newTimespan) {
  return {
    type: CHART_MANAGER_EMIT_ZOOM_TO_EVENT,
    uniqId,
    newTimespan,
  };
}

export function chartManagerToggleChartBySin(uniqId, sin, status) {
  return {
    type: CHART_MANAGER_TOGGLE_CHART_BY_SIN,
    uniqId,
    sin,
    status,
  };
}

export function chartManagerDestroyInstance(uniqId) {
  return {
    type: CHART_MANAGER_DESTROY_INSTANCE,
    uniqId,
  };
}
