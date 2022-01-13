import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { produce } from 'immer';
import { mergeLeft } from 'ramda';

import history from '../utils/history';
import navigationMenuReducer
  from '../components/MainHeader/NavigationMenu/navigationMenuReducer';
import authenticationReducer from '../components/Authentication/reducer';
import analyticsReducer from '../analytics/analyticsReducer';
import cmsComponentsReducer from '../pages/CmsPage/cmsPageReducer';
import pushManagerReducer from '../components/PushManager/reducer';
import fileDownloadManagerReducer
  from '../components/FileDownloadManager/reducer';
import searchBarReducer from '../components/MainHeader/SearchBar/reducer';
import marketGenericReducer
  from '../components/Market/MarketGenericLayout/reducer';
import discountBarometerReducer
  from '../components/Market/DiscountBarometer/reducer';
import marketMembersReducer
  from '../components/Market/MarketMembersTable/reducer';

import {
  GLOBAL_CLEAR_PROFILER_BANNER,
  GLOBAL_HTTP_ERROR,
  GLOBAL_SET_DISCLAIMER_STATUS,
  GLOBAL_UPDATE_PROFILER_BANNER,
  GLOBAL_UPDATE_RESPONSIVE_MODE,
  GLOBAL_UPDATE_STATE_NAME,
  GLOBAL_UPDATE_CURRENT_NAVIGATION_ITEM_DATA,
  GLOBAL_ERROR_OCCURRED,
  GLOBAL_ERROR_CLEAR,
  GLOBAL_SET_DISPLAY_COOKIES_SETTINGS_POPUP,
  GLOBAL_DISCLAIMER_ACCEPTED_ONCE_FOR_SESSION,
  GLOBAL_SCROLL_TO_TOP,
} from './actions';
import { DESKTOP_MODE } from '../utils/responsive';
import asyncChartReducer from '../components/Chart/AsyncChart/reducer';
import chartManagerReducer from '../components/Chart/ChartManager/reducer';
import volatilityMonitorReducer
  from '../components/Market/VolatilityMonitor/reducer';
import marketInstrumentTableReducer
  from '../components/Market/MarketInstrumentTable/reducer';
import deriRiskIndicatorReducer
  from '../components/Market/DeriRiskIndicator/reducer';
import defaultListFilterableReducer
  from '../components/DefaultListFilterable/reducer';
import quickTurboSearchReducer from '../components/QuickSearch/quickTurboSearchReducer';
import productDetailPageReducer from '../pages/ProductDetailPage/reducer';
import publicationsDownloadReducer
  from '../components/Service/PublicationsDownload/publicationsDownloadReducer';
import knockoutMapReducer from '../components/Tools/KnockoutMap/reducer';
import mySearchesReducer from '../components/UserDashboard/MySearches/reducer';
import mySavedItemsListReducer
  from '../components/UserDashboard/MyTrendRadar/MySavedItemsList/reducer';
import appliedFiltersReducer
  from '../components/Filters/FilterAbstract/appliedFiltersReducer';
import myWatchListReducer
  from '../components/UserDashboard/MyWatchList/reducer';
import myMarketReducer
  from '../components/UserDashboard/MyMarketsOverview/reducer';
import watchListAddProductPopupReducer
  from '../components/WatchlistAddProductPopup/reducer';
import myNewsReducer from '../components/UserDashboard/MyNews/reducer';
import userProfileEditPageReducer from '../pages/UserProfileEditPage/userProfileEditPageReducer';
import trendRadarDetailsPageReducer
  from '../pages/TrendRadarDetailsPage/reducer';
import trendRadarAlarmPopupReducer
  from '../components/TrendRadarAlarmPopup/trendRadarAlarmPopupReducer';
import backendSearchableDropdownReducer
  from '../components/BackendSearchableDropdownList/backendSearchableDropdownReducer';
import { STATE_KEY_BACKEND_SEARCHABLE_DROPDOWN_LIST } from '../components/BackendSearchableDropdownList/BackendSearchableDropdownList.helper';
import { STATE_KEY_TREND_RADAR_ALARM_POPUP } from '../components/TrendRadarAlarmPopup/TrendRadarAlarmPopup.helper';
import mainRegisterPageReducer from '../pages/MainRegisterPage/mainRegisterPageReducer';
import Logger from '../utils/logger';
import pushTickManagerReducer from '../components/PushManager/PushableDefault/PushTickManager/pushTickManagerReducer';

const initialState = {
  responsiveMode: DESKTOP_MODE,
  profilerData: [],
  previousStateName: null,
};
export const appReducer = (state = initialState, action) => produce(
  state, (draft) => {
    switch (action.type) {
      case GLOBAL_UPDATE_RESPONSIVE_MODE:
        draft.responsiveMode = action.responsiveMode;
        break;
      case GLOBAL_UPDATE_STATE_NAME:
        if (draft.stateName) {
          draft.previousStateName = draft.stateName;
        }
        draft.stateName = action.stateName;
        break;
      case GLOBAL_UPDATE_CURRENT_NAVIGATION_ITEM_DATA:
        if (action.shouldMergeIntoCurrentData
          && draft.navigationItemData
          && action.navigationItemData
        ) {
          draft.navigationItemData = mergeLeft(action.navigationItemData, draft.navigationItemData);
        } else {
          draft.navigationItemData = action.navigationItemData;
        }
        break;
      case GLOBAL_UPDATE_PROFILER_BANNER:
        if (action.data) {
          draft.profilerData.unshift(action.data);
        }
        break;
      case GLOBAL_CLEAR_PROFILER_BANNER:
        draft.profilerData = [];
        break;
      case GLOBAL_SET_DISCLAIMER_STATUS:
        draft.showDisclaimer = action.showDisclaimer;
        break;
      case GLOBAL_SET_DISPLAY_COOKIES_SETTINGS_POPUP:
        draft.showCookiesSettingsPopup = action.showCookiesSettingsPopup;
        break;
      case GLOBAL_DISCLAIMER_ACCEPTED_ONCE_FOR_SESSION:
        draft.disclaimerAcceptedForSession = true;
        break;
      case GLOBAL_HTTP_ERROR:
        if (!draft.httpError) {
          draft.httpError = {};
        }
        draft.httpError[action.url] = {
          url: action.url,
          params: action.params,
          response: action.response,
        };
        break;
      case GLOBAL_ERROR_OCCURRED:
        draft.errorCode = action.errorCode;
        draft.message = action.message;
        break;
      case GLOBAL_ERROR_CLEAR:
        draft.errorCode = null;
        draft.message = null;
        break;
      case GLOBAL_SCROLL_TO_TOP:
        try {
          window.scrollTo(0, 20);
        } catch (e) {
          Logger.error('Error scrolling to top', e);
        }
        break;
      default:
        break;
    }
  },
);

export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    router: connectRouter(history),
    global: appReducer,
    auth: authenticationReducer,
    analytics: analyticsReducer,
    cms: cmsComponentsReducer,
    navigation: navigationMenuReducer,
    pushManager: pushManagerReducer,
    fileDownloadManager: fileDownloadManagerReducer,
    searchBar: searchBarReducer,
    marketGeneric: marketGenericReducer,
    marketMembers: marketMembersReducer,
    marketInstrumentTable: marketInstrumentTableReducer,
    discountBarometer: discountBarometerReducer,
    volatilityMonitor: volatilityMonitorReducer,
    deriRiskIndicator: deriRiskIndicatorReducer,
    chartsData: asyncChartReducer,
    chartManager: chartManagerReducer,
    defaultListFilterable: defaultListFilterableReducer,
    productDetailPage: productDetailPageReducer,
    quickTurboSearch: quickTurboSearchReducer,
    publicationsDownload: publicationsDownloadReducer,
    mainRegister: mainRegisterPageReducer,
    knockoutMap: knockoutMapReducer,
    appliedListFilters: appliedFiltersReducer,
    userDashboardPageMyWatchList: myWatchListReducer,
    userDashboardPageMyMarket: myMarketReducer,
    mySearches: mySearchesReducer,
    mySavedItemsList: mySavedItemsListReducer,
    watchListAddProductPopup: watchListAddProductPopupReducer,
    userDashboardPageMyNews: myNewsReducer,
    userProfileEditPage: userProfileEditPageReducer,
    trendRadarDetailsPage: trendRadarDetailsPageReducer,
    [STATE_KEY_TREND_RADAR_ALARM_POPUP]: trendRadarAlarmPopupReducer,
    [STATE_KEY_BACKEND_SEARCHABLE_DROPDOWN_LIST]: backendSearchableDropdownReducer,
    pushTickManager: pushTickManagerReducer,
    ...injectedReducers,
  });
}
