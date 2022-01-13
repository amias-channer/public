import {
  put, call, takeEvery,
} from 'redux-saga/effects';
import Logger from '../../utils/logger';
import HttpService from '../../utils/httpService';
import {
  fileDownloadManagerAddJob,
} from '../FileDownloadManager/actions';
import { YIELD_MONITOR_FILTERABLE_TRIGGER_EXPORT } from './actions';
import {
  getYieldMonitorExcelExportStartApiPath,
  getYieldMonitorExportCancelApiPath, getYieldMonitorExportCheckProgressApiPath,
  getYieldMonitorJobDataFromResponse
} from './ProductYieldMonitorFilterable.helper';


export function* triggerExport(action) {
  try {
    const response = yield call(
      HttpService.fetch,
      getYieldMonitorExcelExportStartApiPath(action.fileType),
    );
    if (response) {
      const jobData = getYieldMonitorJobDataFromResponse(response);
      const payload = {
        checkProgressApiPath: getYieldMonitorExportCheckProgressApiPath(jobData.id),
        cancelApiPath: getYieldMonitorExportCancelApiPath(jobData.id),
        getDataFromResponseFunc: getYieldMonitorJobDataFromResponse,
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

export const yieldMonitorFilterableSagas = [
  takeEvery(YIELD_MONITOR_FILTERABLE_TRIGGER_EXPORT, triggerExport),
];
