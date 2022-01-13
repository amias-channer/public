import {
  takeLatest, takeEvery, put, call,
} from 'redux-saga/effects';
import Logger from '../../utils/logger';
import i18n from '../../utils/i18n';
import HttpService from '../../utils/httpService';
import {
  PRODUCT_DETAIL_PAGE_FETCH_CONTENT,
  PRODUCT_DETAIL_PAGE_TOGGLE_CHART_SIN,
  productDetailPageFetchError,
  productDetailPageGotContent,
} from './actions';
import {
  getProductLink,
  getProductListLink, replaceParamsInPath,
} from '../../utils/utils';
import {
  globalScrollToTop,
  globalUpdateCurrentNavigationItemData,
} from '../../main/actions';
import {
  getInstrumentGroupName, getProductDetailPageTrackingPoint,
  getProductShortUrl,
} from './ProductDetailPage.helper';
import {
  chartManagerToggleChartBySin,
} from '../../components/Chart/ChartManager/actions';
import { STATE_NAME_PRODUCT_DETAIL } from '../../main/constants';
import { adformTrackEventPageView } from '../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../adformTracking/AdformTrackingVars';

export const prepareBackendUrl = (params) => replaceParamsInPath(
  HttpService.getBackendUrlByStateName(STATE_NAME_PRODUCT_DETAIL), params,
);

export function* fetchContent(action) {
  try {
    const params = action.params || {};
    const productDetailBackendUrl = prepareBackendUrl(params);
    try {
      yield put(globalUpdateCurrentNavigationItemData(
        {
          pageTitle: params.identifierValue,
          url: getProductLink(params.identifierType, params.identifierValue),
          topMenuItemTitle: i18n.t('Products'),
          topMenuItemUrl: getProductListLink(),
          shortUrl: getProductShortUrl(params.identifierValue),
          additionalNavigationData: action.params,
        },
        true,
      ));
    } catch (e) {
      Logger.error(e);
    }

    if (productDetailBackendUrl) {
      const data = yield call(
        HttpService.fetch, productDetailBackendUrl, { pageRequest: true },
      );
      const instrumentGroupName = getInstrumentGroupName(data);
      const productDetailPageTrackingPoint = getProductDetailPageTrackingPoint(instrumentGroupName);
      adformTrackEventPageView(
        new AdformTrackingVars().setIsin(params.identifierValue),
        productDetailPageTrackingPoint,
      );

      yield put(productDetailPageGotContent(action.uniqId, data));
    }
    yield put(globalScrollToTop());
  } catch (e) {
    // yield put(fetchFailed(e));
    Logger.error('PRODUCT_DETAIL_PAGE', 'Failed to fetch content', e);
    yield put(productDetailPageFetchError(action.uniqId, e));
  }
}

export function* toggleChartSin(action) {
  try {
    yield put(chartManagerToggleChartBySin(action.uniqId, action.sin, action.status));
  } catch (e) {
    Logger.error('PRODUCT_DETAIL_PAGE', 'Failed to toggleChartSin', action, e);
  }
}

export const productDetailPageSagas = [
  takeLatest(PRODUCT_DETAIL_PAGE_FETCH_CONTENT, fetchContent),
  takeEvery(PRODUCT_DETAIL_PAGE_TOGGLE_CHART_SIN, toggleChartSin),
];
