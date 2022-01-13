import { path, pathOr } from 'ramda';
import Cookies from 'js-cookie';
import { store } from '../main/configureStore';
import './library/keyinvest-tracking-v1.5';
import getAppConfig from '../main/AppConfig';
import {
  analyticsPageLoadTrack,
  analyticsClickTrack,
  analyticsContentClickTrack,
  analyticsSearchTrack,
  analyticsProductTrack,
  analyticsDocDownloadTrack,
  analyticsFormTrack,
  analyticsResetFailedAttemptsCounter,
} from './actions';
import { ENV_DEV } from '../utils/utils';
import i18n from '../utils/i18n';
import {
  getResponsiveModeByScreenWidth,
} from '../utils/responsive';

// ANALYTICS FUNCTIONS
export const NETCENTRIC_LOAD_PAGE_FUNC_NAME = 'lnpageloadTrack';
export const NETCENTRIC_CLICK_FUNC_NAME = 'lnclickTrack';
export const NETCENTRIC_CONTENT_CLICK_FUNC_NAME = 'lncontentTrack';
export const NETCENTRIC_SEARCH_FUNC_NAME = 'lnsearchTrack';
export const NETCENTRIC_PRODUCT_COPY_FUNC_NAME = 'lnprodTrack';
export const NETCENTRIC_DOC_DOWNLOAD_FUNC_NAME = 'lnddTrack';
export const NETCENTRIC_FORM_TRACK_FUNC_NAME = 'lnformTrack';

// ANALYTICS CLICK TYPES
export const NETCENTRIC_CTA_TYPE_LINK = 'Link';
export const NETCENTRIC_CTA_TYPE_HTML_TEXT = 'html text';
export const NETCENTRIC_CTA_TYPE_EXPAND_CLICK = 'Expand click';
export const NETCENTRIC_CTA_TYPE_PRIMARY_BUTTON = 'Primary Button';
export const NETCENTRIC_CTA_TYPE_SECONDARY_BUTTON = 'Secondary Button';

export const NETCENTRIC_YIELD_MONITOR_PARENT_CMP_NAME = 'Product Instrument Yield Table';
export const NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_PARENT_CMP_NAME = 'Product Instrument Table';
export const NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_MORE_PARENT_CMP_NAME = 'Product Instrument Table: More';

export const NETCENTRIC_CTA_TYPE_INDICATOR_TILE = 'Indicator Tile';
export const NETCENTRIC_CTA_TYPE_TEXT_LINK = 'text link';
export const NETCENTRIC_CTA_TYPE_IMAGE_LINK = 'image';

// ANALYTICS TRACK PRODUCT EVENTS
export const NETCENTRIC_PRODUCT_COPY_BUTTON = 'Copy button';
export const NETCENTRIC_PRODUCT_COPY_CTRL_C = 'CTRL+C';

// ANALYTICS FORM TRACK EVENT NAMES
export const NETCENTRIC_FORM_TRACK_EVENT_NAME_START = 'Form Start';
export const NETCENTRIC_FORM_TRACK_EVENT_NAME_ERROR = 'Form Error';
export const NETCENTRIC_FORM_TRACK_EVENT_NAME_SUCCESS = 'Form Success';

// ANALYTICS FORM NAMES TRACK
export const NETCENTRIC_FORM_TRACK_CONTACT = 'Contact Form';
export const NETCENTRIC_FORM_TRACK_DOCUMENT_ORDER = 'Document Order Form';
export const NETCENTRIC_FORM_TRACK_LOGIN = 'Login Form';
export const NETCENTRIC_FORM_TRACK_REGISTRATION = 'Registration Form';

// ANALYTICS SEARCH TYPES
export const NETCENTRIC_SEARCH_TYPE_GLOBAL = 'global';
export const NETCENTRIC_SEARCH_TYPE_QUICK = 'quick';
export const NETCENTRIC_SEARCH_TYPE_PRODUCT = 'product';
export const NETCENTRIC_SEARCH_TYPE_THEMES = 'themes';
export const NETCENTRIC_SEARCH_TYPE_YIELD = 'yield';
export const NETCENTRIC_SEARCH_TYPE_MAIN_REGISTER = 'main_register';

export const NETCENTRIC_SEARCH_COMPONENT_GLOBAL = 'Global Search';
export const NETCENTRIC_SEARCH_COMPONENT_QUICK = 'Quick Search';
export const NETCENTRIC_SEARCH_COMPONENT_PRODUCT = 'Product Search';
export const NETCENTRIC_SEARCH_COMPONENT_THEMES = 'Topic Search';
export const NETCENTRIC_SEARCH_COMPONENT_YIELD = 'Yield Monitor Search';
export const NETCENTRIC_SEARCH_COMPONENT_REGISTER = 'Main Register Search';

// Filter Level Filters Mapping
export const NETCENTRIC_INVESTMENT_PRODUCTS = 'Investment products';
export const NETCENTRIC_LEVERAGE_PRODUCTS = 'Leverage products';
export const NETCENTRIC_IN_SUBSCRIPTION_PRODUCTS = 'Products in subscription';

export const NETCENTRIC_FIRST_LEVEL_FILTER_MAPPING = {
  inSubscription: 'Products in subscription',
  investmentproducts: NETCENTRIC_INVESTMENT_PRODUCTS,
  currentInvestmentProducts: NETCENTRIC_INVESTMENT_PRODUCTS,
  svsp1investmentproducts: NETCENTRIC_INVESTMENT_PRODUCTS,
  leverageproducts: NETCENTRIC_LEVERAGE_PRODUCTS,
  currentLeverageProducts: NETCENTRIC_LEVERAGE_PRODUCTS,
  svsp2leverageproducts: NETCENTRIC_LEVERAGE_PRODUCTS,
};

export const getAnalyticsFirstLevelLabelByValueFromMapping = (
  firstLevelFilterValue,
) => NETCENTRIC_FIRST_LEVEL_FILTER_MAPPING[firstLevelFilterValue] || i18n.t(firstLevelFilterValue);

const EMPTY_FUNC = () => {};

// ADOBE GLOBALS
export const ADOBE_SATELLITE = '_satellite';
export const ADOBE_SATELLITE_LOADED = '__satelliteLoaded';
export const ADOBE_ANALYTICS_COOKIE_SAT_TRACK_NAME = 'sat_track';

// KeyInvest analytics class (to be available in window)
export const NETCENTRIC_PATH_TO_LAUNCH = ['nn', 'launch', 'module', 'KeyInvest'];

// KeyInvest analytics instance (to be available in window)
export const KEYINVEST_ANALYTICS_INSTANCE_NAME = 'KeyInvestAnalyticsInstance';

/**
 * Get KeyInvest Analytics instance from window
 * @returns {any}
 */
export const getKeyInvestAnalyticsInstance = () => path(
  [KEYINVEST_ANALYTICS_INSTANCE_NAME],
)(window);

/**
 * Get the analytics function from KeyInvest Instance
 * @param functionName
 * @returns {any}
 */
export const getAnalyticsFunction = (functionName) => path(
  [functionName],
)(getKeyInvestAnalyticsInstance());

/**
 * Set ADOBE cookie after the user accepts it (for EU compliance)
 * @param flag
 * @param expiresAfter - number of days after which the cookie should expire
 */
export const setAnalyticsCookie = (flag, expiresAfter = { expires: 365 }) => {
  Cookies.set(ADOBE_ANALYTICS_COOKIE_SAT_TRACK_NAME, flag, expiresAfter);
};

/**
 * Get ADOBE cookie after the user accepts it (for EU compliance)
 */
export const getAnalyticsCookie = () => (String(Cookies.get(ADOBE_ANALYTICS_COOKIE_SAT_TRACK_NAME)) === 'true');

export const dispatchAnalyticsResetFailedAttemptsCounter = () => {
  store.dispatch(analyticsResetFailedAttemptsCounter());
};

/**
 * Instantiate KeyInvest Analytics and set it to window
 * @returns {null|*}
 */
export const initAnalytics = (checkCookiesPresence = true) => {
  if (!checkCookiesPresence || getAnalyticsCookie()) {
    const { analyticsPath } = getAppConfig();
    const KeyInvestAnalytics = path(NETCENTRIC_PATH_TO_LAUNCH)(window);
    if (analyticsPath && KeyInvestAnalytics) {
      window[KEYINVEST_ANALYTICS_INSTANCE_NAME] = new KeyInvestAnalytics(analyticsPath);
      dispatchAnalyticsResetFailedAttemptsCounter();
      return window[KEYINVEST_ANALYTICS_INSTANCE_NAME];
    }
  }
  return null;
};

/**
 * Check if ADOBE script are loaded, up and running
 * @returns {*|any}
 */
export const isAnalyticsLoaded = () => (
  window[ADOBE_SATELLITE]
  && window[ADOBE_SATELLITE_LOADED]
  && getKeyInvestAnalyticsInstance()
);

/**
 * Set ADOBE to Debug Mode
 */
export const checkAnalyticsDebugMode = () => {
  if (getAppConfig().environment === ENV_DEV) {
    pathOr(EMPTY_FUNC, [ADOBE_SATELLITE, 'setDebug'])(window)(true);
  }
};

/**
 * Get Browser user agent
 * @returns {any}
 */
export const getUserAgent = () => path(['navigator', 'userAgent'])(window);

/**
 * Based on UBS Cookie 'internal-user', decide if the user is Internal or External
 * @returns {string}
 */
export const getNetworkType = () => (String(
  Cookies.get('internal-user'),
) === 'true' ? 'Internal' : 'External');

/**
 * Get Site Variant to use it as PageCountry param for analytics
 * @returns {any}
 */
export const getPageCountry = () => path(['application'])(getAppConfig());

/**
 * Get App Locale
 * @returns {any}
 */
export const getLanguage = () => path(['locale'])(getAppConfig());

/**
 * Convert a URL into a Channel (countrycode:url:separated)
 * @param url
 * @returns {*|string|string}
 */
export const getChannelFromUrl = (url) => (url && getPageCountry() + String(url).toLowerCase().replace(/\//g, ':')) || '';

/**
 * Get the first part of the url after splitting by '/'
 * @param url
 * @returns {*|string|string}
 */
export const getContentType = (url) => {
  if (url && url.length > 0) {
    if (url.indexOf('/') === 0) {
      return String(url).substring(1).toLowerCase().split('/')[0];
    }
    return String(url).toLowerCase().split('/')[0];
  }
  return '';
};

/**
 * Page Load Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Page+Load+Tracking+-+KeyInvest
 * lnpageloadTrack(pagePath, channel, userAgent, networkType,
 *                  pageCountry, language, productISIN,
 *                  deviceRendition, errorPage, ContentType
 *                  )
 * @param pagePath
 * @param channel
 * @param productISIN
 * @param deviceRendition
 * @param errorPage
 */
export const dispatchAnalyticsPageLoadTrack = (
  pagePath,
  channel,
  productISIN,
  deviceRendition,
  errorPage = '',
) => {
  store.dispatch(analyticsPageLoadTrack(NETCENTRIC_LOAD_PAGE_FUNC_NAME,
    [
      pagePath,
      getChannelFromUrl(channel || pagePath),
      getUserAgent(),
      getNetworkType(),
      getPageCountry(),
      getLanguage(),
      productISIN,
      getResponsiveModeByScreenWidth(),
      errorPage,
      getContentType(channel || pagePath),
    ]));
};

/**
 * Click Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+CTA+Clicks+Tracking+-+KeyInvest
 *
 * @param CTAText
 * @param CTAURL
 * @param CTAType
 * @param CTAParentComp
 */
export const dispatchAnalyticsClickTrack = (
  CTAText, CTAURL, CTAType, CTAParentComp,
) => {
  store.dispatch(analyticsClickTrack(NETCENTRIC_CLICK_FUNC_NAME,
    [
      CTAText, CTAURL, CTAType, CTAParentComp,
    ]));
};

/**
 * Content Click Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Content+Click+Tracking+-+KeyInvest
 *
 * @param CTAText
 * @param CTAURL
 * @param CTAType
 * @param CTAParentComp
 * @param ContentType
 * @param ContentID
 * @param ContentTitle
 * @param ContentURL
 * @param PublishingDate
 * @param ContentAuthor
 * @param ProductISIN
 */
export const dispatchAnalyticsContentClickTrack = (
  CTAText,
  CTAURL,
  CTAType,
  CTAParentComp,
  ContentType,
  ContentID,
  ContentTitle,
  ContentURL,
  PublishingDate,
  ContentAuthor,
  ProductISIN,
) => {
  store.dispatch(analyticsContentClickTrack(NETCENTRIC_CONTENT_CLICK_FUNC_NAME,
    [
      CTAText,
      CTAURL,
      CTAType,
      CTAParentComp,
      ContentType,
      ContentID,
      ContentTitle,
      ContentURL,
      PublishingDate,
      ContentAuthor,
      ProductISIN,
    ]));
};

/**
 * Product Click Track
 * and https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Product+Click+Tracking+-+KeyInvest
 *
 * @param CTAText
 * @param CTAURL
 * @param CTAType
 * @param CTAParentComp
 * @param ProductISIN
 */
export const dispatchAnalyticsProductClickTrack = (
  CTAText,
  CTAURL,
  CTAType,
  CTAParentComp,
  ProductISIN,
) => {
  dispatchAnalyticsContentClickTrack(
    CTAText,
    CTAURL,
    CTAType,
    CTAParentComp,
    '',
    '',
    '',
    '',
    '',
    '',
    ProductISIN,
  );
};

/**
 * Search Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Search+Tracking+-+KeyInvest
 *
 * @param searchType ['global' | 'quick' | 'product' | 'themes' | 'yield' | 'main_register' ]
 * @param searchPhrase
 * @param searchResultSelected
 * @param searchUnderlying
 * @param searchFilterSelected
 * @param searchValueEntered
 * @param searchProductType
 * @param searchFirstLevelFilter
 * @param searchInvestmentType
 * @param searchCurrency
 * @param searchMaturityType
 * @param searchTopic
 * @param searchRegion
 * @param searchSidewaysReturn
 * @param searchDistance2Barrier
 * @param searchUnderlyingType
 * @param searchBrcCategory
 * @param searchComponent
 */
export const dispatchAnalyticsSearchTrack = (
  searchType,
  searchPhrase,
  searchResultSelected,
  searchUnderlying,
  searchFilterSelected,
  searchValueEntered,
  searchProductType,
  searchFirstLevelFilter,
  searchInvestmentType,
  searchCurrency,
  searchMaturityType,
  searchTopic,
  searchRegion,
  searchSidewaysReturn,
  searchDistance2Barrier,
  searchUnderlyingType,
  searchBrcCategory,
  searchComponent,
) => {
  store.dispatch(analyticsSearchTrack(NETCENTRIC_SEARCH_FUNC_NAME,
    [
      searchType,
      searchPhrase,
      searchResultSelected,
      searchUnderlying,
      searchFilterSelected,
      searchValueEntered,
      searchProductType,
      searchFirstLevelFilter,
      searchInvestmentType,
      searchCurrency,
      searchMaturityType,
      searchTopic,
      searchRegion,
      searchSidewaysReturn,
      searchDistance2Barrier,
      searchUnderlyingType,
      searchBrcCategory,
      searchComponent,
    ]));
};

/**
 * Global Search Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Search+Tracking+-+KeyInvest
 *
 * @param searchPhrase
 * @param searchResultSelected
 */
export const dispatchAnalyticsGlobalSearchTrack = (
  searchPhrase,
  searchResultSelected,
) => {
  dispatchAnalyticsSearchTrack(
    NETCENTRIC_SEARCH_TYPE_GLOBAL,
    searchPhrase,
    searchResultSelected,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    NETCENTRIC_SEARCH_COMPONENT_GLOBAL,
  );
};

/**
 * Quick Turbo Search Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Search+Tracking+-+KeyInvest
 *
 * @param searchUnderlying
 * @param searchFilterSelected
 * @param searchValueEntered
 * @param searchProductType
 */
export const dispatchAnalyticsQuickSearchTrack = (
  searchUnderlying,
  searchFilterSelected,
  searchValueEntered,
  searchProductType,
) => {
  dispatchAnalyticsSearchTrack(
    NETCENTRIC_SEARCH_TYPE_QUICK,
    '',
    '',
    searchUnderlying,
    searchFilterSelected,
    searchValueEntered,
    searchProductType,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    NETCENTRIC_SEARCH_COMPONENT_QUICK,
  );
};

/**
 * Product List Filters Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Search+Tracking+-+KeyInvest
 *
 * @param searchUnderlying
 * @param searchFilterSelected
 * @param searchValueEntered
 * @param searchProductType
 * @param searchFirstLevelFilter
 * @param searchInvestmentType
 * @param searchCurrency
 */
export const dispatchAnalyticsProductSearchTrack = (
  searchUnderlying,
  searchFilterSelected,
  searchValueEntered,
  searchProductType,
  searchFirstLevelFilter,
  searchInvestmentType,
  searchCurrency,
) => {
  dispatchAnalyticsSearchTrack(
    NETCENTRIC_SEARCH_TYPE_PRODUCT,
    '',
    '',
    searchUnderlying,
    searchFilterSelected,
    searchValueEntered,
    searchProductType,
    searchFirstLevelFilter,
    searchInvestmentType,
    searchCurrency,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    NETCENTRIC_SEARCH_COMPONENT_PRODUCT,
  );
};

/**
 * Themes Search Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Search+Tracking+-+KeyInvest
 *
 * @param searchFilterSelected
 * @param searchCurrency
 * @param searchMaturityType
 * @param searchTopic
 * @param searchRegion
 */
export const dispatchAnalyticsThemesSearchTrack = (
  searchFilterSelected,
  searchCurrency,
  searchMaturityType,
  searchTopic,
  searchRegion,
) => {
  dispatchAnalyticsSearchTrack(
    NETCENTRIC_SEARCH_TYPE_THEMES,
    '',
    '',
    '',
    searchFilterSelected,
    '',
    '',
    '',
    '',
    searchCurrency,
    searchMaturityType,
    searchTopic,
    searchRegion,
    '',
    '',
    '',
    '',
    NETCENTRIC_SEARCH_COMPONENT_THEMES,
  );
};

/**
 * Yield Search Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Search+Tracking+-+KeyInvest
 *
 * @param searchUnderlying
 * @param searchFilterSelected
 * @param searchCurrency
 * @param searchSidewaysReturn
 * @param searchDistance2Barrier
 * @param searchUnderlyingType
 * @param searchBrcCategory
 */
export const dispatchAnalyticsYieldSearchTrack = (
  searchUnderlying,
  searchFilterSelected,
  searchCurrency,
  searchSidewaysReturn,
  searchDistance2Barrier,
  searchUnderlyingType,
  searchBrcCategory,
) => {
  dispatchAnalyticsSearchTrack(
    NETCENTRIC_SEARCH_TYPE_YIELD,
    '',
    '',
    searchUnderlying,
    searchFilterSelected,
    '',
    '',
    '',
    '',
    searchCurrency,
    '',
    '',
    '',
    searchSidewaysReturn,
    searchDistance2Barrier,
    searchUnderlyingType,
    searchBrcCategory,
    NETCENTRIC_SEARCH_COMPONENT_YIELD,
  );
};

/**
 * Main Register Search Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Search+Tracking+-+KeyInvest
 *
 * @param searchPhrase
 */
export const dispatchAnalyticsMainRegisterSearchTrack = (
  searchPhrase,
) => {
  dispatchAnalyticsSearchTrack(
    NETCENTRIC_SEARCH_TYPE_MAIN_REGISTER,
    searchPhrase,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    NETCENTRIC_SEARCH_COMPONENT_REGISTER,
  );
};

/**
 * Product Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Product+Interaction+Tracking+-+KeyInvest
 *
 * @param prodSIN
 * @param eventAct
 */
export const dispatchAnalyticsProductTrack = (
  prodSIN, eventAct,
) => {
  store.dispatch(analyticsProductTrack(NETCENTRIC_PRODUCT_COPY_FUNC_NAME,
    [
      prodSIN, eventAct,
    ]));
};

/**
 * DocDownload Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Product+Interaction+Tracking+-+KeyInvest
 *
 * @param docTitle
 * @param docName
 */
export const dispatchAnalyticsDocDownloadTrack = (
  docTitle, docName,
) => {
  store.dispatch(analyticsDocDownloadTrack(NETCENTRIC_DOC_DOWNLOAD_FUNC_NAME,
    [
      docTitle, docName,
    ]));
};

/**
 * Form Track
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Contact+Form+Tracking+-+KeyInvest
 *
 * @param formName
 * @param eventName
 * @param formErrorMessage
 * @param formDocumentOrderSelected
 */
export const dispatchAnalyticsFormTrack = (
  formName, eventName, formErrorMessage, formDocumentOrderSelected,
) => {
  store.dispatch(analyticsFormTrack(NETCENTRIC_FORM_TRACK_FUNC_NAME,
    [
      formName, eventName, formErrorMessage, formDocumentOrderSelected,
    ]));
};

/**
 * Form Track Start
 * Implementation of https://projects.netcentric.biz/wiki/display/UBSKEYINV/Launch+-+Contact+Form+Tracking+-+KeyInvest
 *
 * @param formName
 * @param formErrorMessage
 * @param formDocumentOrderSelected
 */
export const dispatchAnalyticsFormTrackStart = (
  formName, formErrorMessage, formDocumentOrderSelected,
) => {
  store.dispatch(analyticsFormTrack(NETCENTRIC_FORM_TRACK_FUNC_NAME,
    [
      formName, NETCENTRIC_FORM_TRACK_EVENT_NAME_START, formErrorMessage, formDocumentOrderSelected,
    ]));
};
