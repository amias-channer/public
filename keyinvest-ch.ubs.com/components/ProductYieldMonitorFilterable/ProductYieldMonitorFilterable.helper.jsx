import { pathOr } from 'ramda';
import HttpService from '../../utils/httpService';
import {
  EXPORT_TYPE_PDF, EXPORT_TYPE_XLSX,
} from '../FileDownloadManager/FileDownloadManager.helper';

export const EXPORT_YIELD_MONITOR_KEY = 'yieldMonitorExport';
export const YIELD_MONITOR_EXPORT_BUTTONS = [EXPORT_TYPE_XLSX, EXPORT_TYPE_PDF];

export const getYieldMonitorExcelExportStartApiPath = (
  exportFileType,
) => HttpService.getBackendUrlByStateName(
  'yieldMonitorExportStart',
  true,
  { exportFormat: exportFileType },
);

export const getYieldMonitorExportCheckProgressApiPath = (
  jobId,
) => HttpService.getBackendUrlByStateName(
  'yieldMonitorExportCheckProgress',
  false,
  { id: jobId },
);

export const getYieldMonitorExportCancelApiPath = (
  jobId,
) => HttpService.getBackendUrlByStateName(
  'yieldMonitorExportCancel',
  false,
  { id: jobId },
);

export const getYieldMonitorJobDataFromResponse = pathOr({}, [EXPORT_YIELD_MONITOR_KEY]);
