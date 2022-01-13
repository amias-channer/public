import {
  call, delay, fork, put, takeEvery, select,
} from 'redux-saga/effects';
import HttpService from '../../utils/httpService';
import Logger from '../../utils/logger';
import {
  FILE_DOWNLOAD_PROGRESS_INTERVAL,
  FILE_DOWNLOAD_RUNNING,
  getMappedJobStatus,
} from './FileDownloadManager.helper';
import {
  fileDownloadManagerStopJob,
  fileDownloadManagerRemoveJob,
  fileDownloadManagerUpdateJob,
  FILE_DOWNLOAD_MANAGER_ADD_JOB,
  FILE_DOWNLOAD_MANAGER_STOP_JOB,
  FILE_DOWNLOAD_MANAGER_CANCEL_JOB,
} from './actions';

const getJobs = (state) => state.fileDownloadManager;

export function* pollSaga(action) {
  while (true) {
    try {
      const { jobId } = action.payload;
      const jobs = yield select(getJobs);
      if (jobs && jobs[jobId]) {
        const response = yield call(
          HttpService.fetch, action.payload.checkProgressApiPath,
        );

        const jobUpdatedData = action.payload.getDataFromResponseFunc(response);

        yield put(fileDownloadManagerUpdateJob(action.payload.jobId, { jobData: jobUpdatedData }));
        if (jobUpdatedData && getMappedJobStatus(jobUpdatedData.status) !== FILE_DOWNLOAD_RUNNING) {
          yield put(fileDownloadManagerStopJob(action.payload));
        }

        yield delay(FILE_DOWNLOAD_PROGRESS_INTERVAL);
      } else {
        yield put(fileDownloadManagerStopJob(action.payload));
      }
    } catch (err) {
      Logger.debug(err);
      yield put(fileDownloadManagerStopJob(action.payload));
    }
  }
}

export function* jobSagaWatch(action) {
  const task = yield fork(pollSaga, action);
  yield put(fileDownloadManagerUpdateJob(action.payload.jobId, { task }));
}

export function* stopJobSaga(action) {
  try {
    const { jobId } = action.payload;
    const jobs = yield select(getJobs);
    if (jobs && jobs[jobId]) {
      const job = jobs[jobId];
      if (job && job.task) {
        job.task.cancel();
      }
    }
  } catch (err) {
    Logger.debug(err);
  }
}

export function* cancelJobSaga(action) {
  try {
    yield put(fileDownloadManagerStopJob(action.payload));
    yield put(fileDownloadManagerRemoveJob(action.payload));
    if (action.payload && action.payload.cancelApiPath) {
      yield call(HttpService.fetch, action.payload.cancelApiPath);
    }
  } catch (err) {
    Logger.debug(err);
  }
}

export const fileDownloadManagerSagas = [
  takeEvery(FILE_DOWNLOAD_MANAGER_ADD_JOB, jobSagaWatch),
  takeEvery(FILE_DOWNLOAD_MANAGER_STOP_JOB, stopJobSaga),
  takeEvery(FILE_DOWNLOAD_MANAGER_CANCEL_JOB, cancelJobSaga),
];
