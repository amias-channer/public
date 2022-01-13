import { pathOr } from 'ramda';

export const EXPORT_TYPE_XLSX = 'xlsx';
export const EXPORT_TYPE_XLS = 'xls';
export const EXPORT_TYPE_CSV = 'csv';
export const EXPORT_TYPE_PDF = 'pdf';

export const FILE_DOWNLOAD_ERROR = 'error';
export const FILE_DOWNLOAD_RUNNING = 'running';
export const FILE_DOWNLOAD_COMPLETED = 'completed';

export const FILE_DOWNLOAD_PROGRESS_INTERVAL = 3000; // in milliseconds

export const FILE_DOWNLOAD_STATUS_MAPPING = {
  failed: FILE_DOWNLOAD_ERROR,
  killed: FILE_DOWNLOAD_ERROR,
  canceled: FILE_DOWNLOAD_ERROR,
  error: FILE_DOWNLOAD_ERROR,
  completed: FILE_DOWNLOAD_COMPLETED,
  new: FILE_DOWNLOAD_RUNNING,
  running: FILE_DOWNLOAD_RUNNING,
  saving: FILE_DOWNLOAD_RUNNING,
};

export const getMappedJobStatus = (status) => pathOr(
  FILE_DOWNLOAD_ERROR, [status],
)(FILE_DOWNLOAD_STATUS_MAPPING);
