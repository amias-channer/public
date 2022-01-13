/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { dissocPath } from 'ramda';
import TestPage from './TestPage';
import CmsPage from './CmsPage';
import ErrorPage from './ErrorPage';
import MarketPage from './MarketPage';
import LanguageChangePage from './LanguageChangePage';
import ProductListPage from './ProductListPage';
import ProductYieldMonitorPage from './ProductYieldMonitorPage';
import ProductDetailPage from './ProductDetailPage';
import ThemesListPage from './ThemesListPage';

import {
  STATE_NAME_CMS_PAGE,
  STATE_NAME_LANGUAGE_CHANGE,
  STATE_NAME_MARKET_COMMODITY_MONITOR,
  STATE_NAME_MARKET_MEMBERS,
  STATE_NAME_MARKET_DERI_RISK_INDICATOR,
  STATE_NAME_MARKET_DISCOUNT_BAROMETER,
  STATE_NAME_MARKET_FX_PRECIOUS_METALS,
  STATE_NAME_MARKET_OVERVIEW,
  STATE_NAME_MARKET_VOLATILITY_MONITOR,
  STATE_NAME_ERROR_PAGE,
  STATE_NAME_PRODUCT_LIST,
  STATE_NAME_PRODUCT_FLATEX_LIST,
  STATE_NAME_PRODUCT_YIELD_MONITOR_PAGE,
  STATE_NAME_PRODUCT_DETAIL,
  STATE_NAME_TEST_PAGE,
  STATE_NAME_SERVICE_PUBLICATIONS_DOWNLOAD,
  STATE_NAME_MAIN_REGISTER,
  STATE_NAME_TOOLS_ROOT_NAVIGATION_STATE,
  STATE_NAME_TOOLS_KNOCK_OUT_MAP,
  STATE_NAME_THEMES_MAIN_PAGE,
  STATE_NAME_USER_DASHBOARD_PAGE,
  STATE_NAME_USER_REGISTER_VERIFY,
  STATE_NAME_USER_RESET_PASSWORD,
  STATE_NAME_USER_PROFILE_EDIT_PAGE,
  STATE_NAME_TREND_RADAR_DETAILS_PAGE, STATE_NAME_TREND_RADAR_LIST_PAGE,
} from '../main/constants';
import { generateUniqId } from '../utils/utils';
import ErrorBoundary from '../components/ErrorBoundary';
import ToolsPage from './ToolsPage';
import UserDashboardPage from './UserDashboardPage';
import UserRegisterVerifyPage from './UserRegisterVerifyPage';
import UserResetPasswordPage from './UserResetPasswordPage';
import UserProfileEditPageCmp from './UserProfileEditPage';
import TrendRadarDetailsPage from './TrendRadarDetailsPage';
import TrendRadarListPage from './TrendRadarListPage';
import MainRegisterPage from './MainRegisterPage';
import ProductKnowledgePage from './ProductKnowlegePage';

export const pages = {
  [STATE_NAME_LANGUAGE_CHANGE]: LanguageChangePage,
  [STATE_NAME_TEST_PAGE]: TestPage,
  [STATE_NAME_CMS_PAGE]: CmsPage,
  [STATE_NAME_ERROR_PAGE]: ErrorPage,
  [STATE_NAME_MARKET_OVERVIEW]: MarketPage,
  [STATE_NAME_MARKET_DISCOUNT_BAROMETER]: MarketPage,
  [STATE_NAME_MARKET_VOLATILITY_MONITOR]: MarketPage,
  [STATE_NAME_MARKET_MEMBERS]: MarketPage,
  [STATE_NAME_MARKET_FX_PRECIOUS_METALS]: MarketPage,
  [STATE_NAME_MARKET_DERI_RISK_INDICATOR]: MarketPage,
  [STATE_NAME_MARKET_COMMODITY_MONITOR]: MarketPage,

  [STATE_NAME_PRODUCT_LIST]: ProductListPage,
  [STATE_NAME_PRODUCT_FLATEX_LIST]: ProductListPage,
  [STATE_NAME_PRODUCT_YIELD_MONITOR_PAGE]: ProductYieldMonitorPage,
  [STATE_NAME_PRODUCT_DETAIL]: ProductDetailPage,

  [STATE_NAME_SERVICE_PUBLICATIONS_DOWNLOAD]: ProductKnowledgePage,
  [STATE_NAME_MAIN_REGISTER]: MainRegisterPage,

  [STATE_NAME_THEMES_MAIN_PAGE]: ThemesListPage,

  [STATE_NAME_TOOLS_ROOT_NAVIGATION_STATE]: ToolsPage,
  [STATE_NAME_TOOLS_KNOCK_OUT_MAP]: ToolsPage,

  [STATE_NAME_USER_DASHBOARD_PAGE]: UserDashboardPage,
  [STATE_NAME_USER_REGISTER_VERIFY]: UserRegisterVerifyPage,
  [STATE_NAME_USER_RESET_PASSWORD]: UserResetPasswordPage,
  [STATE_NAME_USER_PROFILE_EDIT_PAGE]: UserProfileEditPageCmp,

  [STATE_NAME_TREND_RADAR_LIST_PAGE]: TrendRadarListPage,
  [STATE_NAME_TREND_RADAR_DETAILS_PAGE]: TrendRadarDetailsPage,

};

export const Wrapper = React.memo((props) => {
  let PageComp;
  const { stateName } = props;
  if (stateName && pages[stateName]) {
    PageComp = pages[stateName];
  } else {
    PageComp = pages[STATE_NAME_CMS_PAGE];
  }
  return (
    <ErrorBoundary>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <PageComp {...props} />
    </ErrorBoundary>
  );
});
Wrapper.propTypes = {
  stateName: PropTypes.string,
};
Wrapper.defaultProps = {
  stateName: '',
};

export const getMappedComponentByStateName = (stateName, navigationItemData) => (props) => {
  const sanitizedProps = dissocPath(['location', 'key'], props);
  return (
    <Wrapper
      stateName={stateName}
      uniqId={stateName || generateUniqId()}
      location={sanitizedProps.location}
      match={sanitizedProps.match}
      navigationItemData={navigationItemData}
    />
  );
};
