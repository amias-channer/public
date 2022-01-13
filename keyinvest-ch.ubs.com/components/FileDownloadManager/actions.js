export const FILE_DOWNLOAD_MANAGER_ADD_JOB = 'FileDownloadManager/FILE_DOWNLOAD_MANAGER_ADD_JOB';
export const FILE_DOWNLOAD_MANAGER_UPDATE_JOB = 'FileDownloadManager/FILE_DOWNLOAD_MANAGER_UPDATE_JOB';
export const FILE_DOWNLOAD_MANAGER_REMOVE_JOB = 'FileDownloadManager/FILE_DOWNLOAD_MANAGER_REMOVE_JOB';
export const FILE_DOWNLOAD_MANAGER_CANCEL_JOB = 'FileDownloadManager/FILE_DOWNLOAD_MANAGER_CANCEL_JOB';
export const FILE_DOWNLOAD_MANAGER_STOP_JOB = 'FileDownloadManager/FILE_DOWNLOAD_MANAGER_STOP_JOB';

export function fileDownloadManagerAddJob(payload) {
  return {
    type: FILE_DOWNLOAD_MANAGER_ADD_JOB,
    payload,
  };
}

export function fileDownloadManagerUpdateJob(jobId, jobData) {
  return {
    type: FILE_DOWNLOAD_MANAGER_UPDATE_JOB,
    jobId,
    jobData,
  };
}

export function fileDownloadManagerRemoveJob(payload) {
  return {
    type: FILE_DOWNLOAD_MANAGER_REMOVE_JOB,
    payload,
  };
}

export const fileDownloadManagerCancelJob = (payload) => ({
  type: FILE_DOWNLOAD_MANAGER_CANCEL_JOB,
  payload,
});

export const fileDownloadManagerStopJob = (payload) => ({
  type: FILE_DOWNLOAD_MANAGER_STOP_JOB,
  payload,
});
