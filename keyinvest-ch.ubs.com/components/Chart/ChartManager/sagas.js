import {
  takeEvery, put, throttle, delay,
} from 'redux-saga/effects';

import Logger from '../../../utils/logger';
import {
  CHART_MANAGER_INIT_INSTANCE,
  CHART_MANAGER_DESTROY_INSTANCE,
  chartManagerInstanceReady,
  CHART_MANAGER_PUSHABLE_CHART_UPDATE,
  CHART_MANAGER_EMIT_ZOOM_TO_EVENT,
  chartManagerEmitZoomToEvent, CHART_MANAGER_TOGGLE_CHART_BY_SIN,
} from './actions';
import {
  createChartistInstance,
  destroyChartInstance, getChartInstance, updateChartWithNewPushableValue,
} from './ChartManager.helper';
import { recalculateData } from '../Chart.helper';

export function* chartInitInstance(action) {
  try {
    Logger.debug('CHART_MANAGER_INIT_INSTANCE', action);
    if (action && action.uniqId && action.chartProps && action.chartInstance) {
      const {
        uniqId, chartProps, chartInstance, responsiveMode,
      } = action;
      const chartistInstance = yield createChartistInstance(
        uniqId, chartProps, chartInstance, responsiveMode,
      );
      if (chartistInstance) {
        yield put(chartManagerInstanceReady(uniqId, true));
        // Waiting for 1ms until instance is ready and correctly set in the store
        yield delay(1);
        yield put(chartManagerEmitZoomToEvent(uniqId, chartProps.timespan));
      }
    }
  } catch (e) {
    Logger.error('CHART_MANAGER_INIT_INSTANCE', action, e);
  }
}

export function* chartPushableShouldUpdate(action) {
  try {
    yield updateChartWithNewPushableValue(
      action.uniqId, action.pushResult, action.chartDataSetIndex,
    );
    if (typeof action.exportPushResultFunc === 'function') {
      action.exportPushResultFunc(action.pushResult, action.chartDataSetIndex);
    }
  } catch (e) {
    Logger.error('CHART_MANAGER_PUSHABLE_CHART_UPDATE', action, e);
  }
}

export function* chartEmitZoomToEvent(action) {
  try {
    const chartInstance = yield getChartInstance(action.uniqId);
    if (chartInstance
      && action.newTimespan
      && chartInstance.eventEmitter
      && typeof chartInstance.eventEmitter.emit === 'function'
    ) {
      chartInstance.eventEmitter.emit('zoomTo', {
        value: action.newTimespan,
      });
    } else {
      Logger.debug('CHART_MANAGER_EMIT_ZOOM_TO_EVENT', 'not yet available', action);
    }
  } catch (e) {
    Logger.error('CHART_MANAGER_EMIT_ZOOM_TO_EVENT', action, e);
  }
}

export function* toggleChartBySin(action) {
  try {
    const chartInstance = yield getChartInstance(action.uniqId);
    if (chartInstance
      && action.sin
      && chartInstance.data
      && chartInstance.data.series
      && chartInstance.eventEmitter
      && typeof chartInstance.eventEmitter.emit === 'function'
    ) {
      const dataSet = chartInstance.data.series.filter(
        (series) => String(series.sin) === String(action.sin),
      )[0];
      if (!dataSet) return;

      dataSet.visible = !action.status;
      const dataSetsVisible = chartInstance.data.series.filter((series) => series.visible).length;
      const chartMode = chartInstance.options.mode;
      if (dataSetsVisible === 1 || (dataSetsVisible > 1 && chartMode === 'abs')) {
        yield recalculateData(chartInstance);
      }
      yield chartInstance.eventEmitter.emit('updateTargetLines');
      yield chartInstance.eventEmitter.emit('updateYAxis');
      yield chartInstance.update(null, chartInstance.options);
    } else {
      Logger.error('CHART_MANAGER_TOGGLE_CHART_BY_SIN', 'not yet available', action);
    }
  } catch (e) {
    Logger.error('CHART_MANAGER_TOGGLE_CHART_BY_SIN', action, e);
  }
}

export function* chartDestroyInstance(action) {
  try {
    Logger.debug('CHART_MANAGER_DESTROY_INSTANCE', action);
    yield destroyChartInstance(action.uniqId);
  } catch (e) {
    Logger.error('CHART_MANAGER_DESTROY_INSTANCE', action, e);
  }
}

export const chartManagerSagas = [
  takeEvery(CHART_MANAGER_INIT_INSTANCE, chartInitInstance),
  throttle(5000, CHART_MANAGER_PUSHABLE_CHART_UPDATE, chartPushableShouldUpdate),
  takeEvery(CHART_MANAGER_DESTROY_INSTANCE, chartDestroyInstance),
  takeEvery(CHART_MANAGER_EMIT_ZOOM_TO_EVENT, chartEmitZoomToEvent),
  takeEvery(CHART_MANAGER_TOGGLE_CHART_BY_SIN, toggleChartBySin),
];
