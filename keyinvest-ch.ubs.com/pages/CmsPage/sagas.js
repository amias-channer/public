import {
  takeLatest, put, call,
} from 'redux-saga/effects';
import scrollToElement from 'scroll-to-element';

import Logger from '../../utils/logger';
import {
  CMS_PAGE_FETCH_CONTENT,
  CMS_PAGE_GOT_CONTENT,
  cmsPageGotContent,
  cmsPageGotError,
} from './actions';
import HttpService from '../../utils/httpService';

export function scrollToElementByHash(action) {
  try {
    if (action && action.locationHash) {
      setTimeout(() => {
        const element = document.querySelector(action.locationHash);
        if (element) {
          scrollToElement(element, {
            offset: -80,
            ease: 'out-bounce',
            duration: 200,
          });
        }
      }, 0);
    }
  } catch (e) {
    Logger.warn('CMS_PAGE', 'Failed to scrollToElementById', action, e);
  }
}

export function* fetchContent() {
  const { pathname, search, hash } = window.location;
  try {
    const data = yield call(
      HttpService.fetch,
      HttpService.getPageApiUrl() + pathname + search, { pageRequest: true },
    );
    yield put(cmsPageGotContent(data, hash));
  } catch (e) {
    Logger.error('CMS_PAGE', 'Failed to fetch content', e);
    yield put(cmsPageGotError(e));
  }
}


export const cmsComponentsRendererSagas = [
  takeLatest(CMS_PAGE_FETCH_CONTENT, fetchContent),
  takeLatest(CMS_PAGE_GOT_CONTENT, scrollToElementByHash),
];
