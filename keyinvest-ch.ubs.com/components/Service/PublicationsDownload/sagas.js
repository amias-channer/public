import {
  call, put,
  takeLatest,
} from 'redux-saga/effects';
import {
  PUBLICATIONS_DOWNLOAD_FETCH_CONTENT,
  PUBLICATIONS_DOWNLOAD_POST_FORM_DATA, publicationsDownloadFormSubmitSuccess,
  publicationsDownloadGotContent,
} from './actions';
import HttpService from '../../../utils/httpService';
import { STATE_NAME_SERVICE_PUBLICATIONS_DOWNLOAD } from '../../../main/constants';
import Logger from '../../../utils/logger';


export function* fetchPublicationsDownloadContent() {
  try {
    const response = yield call(
      HttpService.fetch,
      HttpService.getBackendUrlByStateName(STATE_NAME_SERVICE_PUBLICATIONS_DOWNLOAD),
    );
    yield put(publicationsDownloadGotContent(response.data));
  } catch (e) {
    Logger.error('SERVICE_PUBLICATIONS_DOWNLOAD_PAGE', 'Failed to fetch content', e);
  }
}

export function* postPublicationsDownloadFormData(action) {
  try {
    const response = yield call(
      HttpService.postFormData,
      HttpService.getBackendUrlByStateName(STATE_NAME_SERVICE_PUBLICATIONS_DOWNLOAD),
      {
        data: action.data,
      },
    );
    if (response && response.state === 'Ok') {
      yield put(publicationsDownloadFormSubmitSuccess(response.message));
    }
  } catch (e) {
    Logger.error('SERVICE_PUBLICATIONS_DOWNLOAD_PAGE', 'Failed to POST form data', e);
  }
}
export const publicationsDownloadSagas = [
  takeLatest(PUBLICATIONS_DOWNLOAD_FETCH_CONTENT, fetchPublicationsDownloadContent),
  takeLatest(PUBLICATIONS_DOWNLOAD_POST_FORM_DATA, postPublicationsDownloadFormData),
];
