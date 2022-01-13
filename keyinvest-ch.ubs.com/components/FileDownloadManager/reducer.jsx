import { produce } from 'immer';
import { mergeRight } from 'ramda';
import {
  FILE_DOWNLOAD_MANAGER_ADD_JOB,
  FILE_DOWNLOAD_MANAGER_REMOVE_JOB,
  FILE_DOWNLOAD_MANAGER_UPDATE_JOB,
} from './actions';

export const initialState = {};

const fileDownloadManagerReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case FILE_DOWNLOAD_MANAGER_ADD_JOB:
      draft[action.payload.jobId] = action.payload;
      break;
    case FILE_DOWNLOAD_MANAGER_UPDATE_JOB:
      if (draft[action.jobId]) {
        draft[action.jobId] = mergeRight(draft[action.jobId], action.jobData);
      } else {
        draft[action.jobId] = {
          jobListKey: action.jobListKey,
          fileType: action.fileType,
          ...action.jobData,
        };
      }
      break;
    case FILE_DOWNLOAD_MANAGER_REMOVE_JOB:
      if (action.payload && action.payload.jobId && draft[action.payload.jobId]) {
        delete draft[action.payload.jobId];
      }
      break;
    default:
      break;
  }
});

export default fileDownloadManagerReducer;
