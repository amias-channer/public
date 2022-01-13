import {
  takeLatest, put, call,
} from 'redux-saga/effects';
import {
  TREND_RADAR_DETAILS_PAGE_FETCH_CONTENT,
  trendRadarDetailsPageGotBackendError,
  trendRadarDetailsPageGotContent,
} from './actions';
import Logger from '../../utils/logger';
import HttpService from '../../utils/httpService';
import {
  globalScrollToTop,
  globalUpdateCurrentNavigationItemData,
} from '../../main/actions';
import { getTrendRadarSignalDetailLink, getTrendRadarSignalListLink } from '../../utils/utils';
import i18n from '../../utils/i18n';
import { TREND_RADAR_DETAILS_ID_PARAM } from '../../main/constants';

export function* fetchContent(action) {
  try {
    const { params, url } = action;
    yield put(globalUpdateCurrentNavigationItemData(
      {
        pageTitle: params[TREND_RADAR_DETAILS_ID_PARAM],
        url: getTrendRadarSignalDetailLink(params[TREND_RADAR_DETAILS_ID_PARAM]),
        topMenuItemTitle: i18n.t('TrendRadar'),
        topMenuItemUrl: getTrendRadarSignalListLink(),
        additionalNavigationData: action.params,
      },
      true,
    ));
    const response = yield call(HttpService.fetch, url);
    yield put(trendRadarDetailsPageGotContent(response));
    yield put(globalScrollToTop());
  } catch (e) {
    yield put(trendRadarDetailsPageGotBackendError(e));
    Logger.error(action.type, e);
  }
}

export const trendRadarDetailsPageSagas = [
  takeLatest(TREND_RADAR_DETAILS_PAGE_FETCH_CONTENT, fetchContent),
];
