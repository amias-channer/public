import {
  takeLatest, put, call, takeEvery, throttle,
} from 'redux-saga/effects';
import Logger from '../../utils/logger';
import HttpService from '../../utils/httpService';
import {
  DEFAULT_LIST_FILTERABLE_FETCH_DATA,
  DEFAULT_LIST_FILTERABLE_FETCH_MORE_DATA,
  DEFAULT_LIST_FILTERABLE_TRIGGER_EXPORT,
  defaultListFilterableGotData,
  defaultListFilterableGotMoreData,
} from './actions';
import {
  getProductListExcelExportCancelApiPath,
  getProductListExcelExportCheckProgressApiPath,
  getProductListExcelExportStartApiPath,
  getProductListJobDataFromResponse,
} from './DefaultListFilterable.helper';
import {
  fileDownloadManagerAddJob,
} from '../FileDownloadManager/actions';

export function* fetchContent(action) {
  try {
    const response = yield call(
      HttpService.fetch,
      HttpService.getBackendUrlByStateName(action.stateName),
    );
    if (response && response.data) {
      yield put(defaultListFilterableGotData(action.uniqDefaultListId, response.data));
    } else {
      yield put(defaultListFilterableGotData(
        action.uniqDefaultListId, { hasError: true, filterData: {} },
      ));
    }
    if (typeof action.onLoadFinishedFunc === 'function') {
      action.onLoadFinishedFunc(action, response);
    }
  } catch (e) {
    Logger.error('DefaultListFilterable_SAGAS', 'Failed to fetch content', e);
    yield put(defaultListFilterableGotData(
      action.uniqDefaultListId, { hasError: true, filterData: {} },
    ));
  }
}

export function* fetchMoreContent(action) {
  try {
    const response = yield call(
      HttpService.fetch,
      action.url,
    );
    if (!response || !response.data) {
      yield put(defaultListFilterableGotMoreData(
        action.uniqDefaultListId, null,
      ));
    }

    if (typeof action.onLoadMoreFinishedFunc === 'function') {
      yield action.onLoadMoreFinishedFunc(action, response);
    }
  } catch (e) {
    Logger.error('DefaultListFilterable_SAGAS', 'Failed to fetch more content', e);
    yield put(defaultListFilterableGotMoreData(
      action.uniqDefaultListId, null,
    ));
  }
}

export function* triggerExport(action) {
  try {
    const response = yield call(
      HttpService.fetch,
      getProductListExcelExportStartApiPath(action.fileType),
    );
    if (response) {
      const jobData = getProductListJobDataFromResponse(response);
      const payload = {
        checkProgressApiPath: getProductListExcelExportCheckProgressApiPath(jobData.id),
        cancelApiPath: getProductListExcelExportCancelApiPath(jobData.id),
        getDataFromResponseFunc: getProductListJobDataFromResponse,
        jobId: jobData.id,
        jobListKey: action.jobListKey,
        fileType: action.fileType,
        jobData,
      };

      yield put(fileDownloadManagerAddJob(payload));
    }
  } catch (e) {
    Logger.error('DefaultListFilterable_SAGAS', 'Failed to triggerExport', e);
  }
}

export const defaultListFilterableSagas = [
  takeLatest(DEFAULT_LIST_FILTERABLE_FETCH_DATA, fetchContent),
  throttle(1000, DEFAULT_LIST_FILTERABLE_FETCH_MORE_DATA, fetchMoreContent),
  takeEvery(DEFAULT_LIST_FILTERABLE_TRIGGER_EXPORT, triggerExport),
];
