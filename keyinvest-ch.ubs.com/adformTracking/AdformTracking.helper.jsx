import { parse } from 'query-string';
import { clone } from 'ramda';
import { store } from '../main/configureStore';
import getAppConfig from '../main/AppConfig';
import { pathOrString } from '../utils/typeChecker';
import {
  adformTrackingPointsTrackEvent,
} from './actions';
import AdformTrackingVars from './AdformTrackingVars';
import {
  getMarketingInitialState,
  getUBSPrivacySettingsCookieValue,
} from '../components/DisclaimerPopup/DisclaimerPopup.helper';

export const ADFORM_TRACKING_POINT_EVENT_TYPE_CLICK = 'clicktrack';
export const ADFORM_TRACKING_POINT_EVENT_TYPE_PAGE_VIEW = 'track';
export const ADFORM_TRACKING_POINT_DIVIDER = encodeURIComponent('|');

const ADFORM_GLOBAL_VARIABLE = 'adf';
const ADFORM_TRACKING_ID = 1586921;

const ADFORM_VARIABLE_KEYS = {
  language: 'sv1',
  pageUrl: 'sv2',
  campaignId: 'sv3',
  country: 'sv4',
  isin: 'sv8',
  broker: 'sv9',
};

export const isAdformLoaded = () => !!(window && window[ADFORM_GLOBAL_VARIABLE]);
export const getLanguage = () => pathOrString('', ['locale'], getAppConfig()).substr(0, 2);
export const getCountry = () => pathOrString('', ['application'], getAppConfig());
export const getCurrentPageUrl = () => pathOrString('', ['location', 'href'], window);

const isMarketingOptionEnabledInDisclaimer = (
  siteVariant,
) => getMarketingInitialState(siteVariant, getUBSPrivacySettingsCookieValue());

export const shouldDoAdformTracking = () => {
  const { application: siteVariant } = getAppConfig();
  return isMarketingOptionEnabledInDisclaimer(siteVariant);
};

export const getAdformTracking = () => {
  if (!isAdformLoaded()) {
    return null;
  }
  return window[ADFORM_GLOBAL_VARIABLE];
};

export const getCampaignIdFromQueryParams = () => {
  let campaignID = '';
  const queryString = (window.location && window.location.search) ? window.location.search : '';
  if (queryString) {
    const parsed = parse(queryString);
    campaignID = parsed.campID || '';
  }
  return campaignID;
};

export const getTrackingVarsWithCampaignId = (trackingVars, campaignId = '') => {
  const trackingVarsCloned = clone(trackingVars);
  trackingVarsCloned.campaignId = campaignId;
  return trackingVarsCloned;
};

export const adformTrackEventClick = (
  event,
  trackingPointNameSegment,
  trackingVars = new AdformTrackingVars(),
) => {
  if (!isAdformLoaded()) {
    return;
  }
  const trackingVariables = getTrackingVarsWithCampaignId(
    trackingVars,
    getCampaignIdFromQueryParams(),
  );
  const divider = ADFORM_TRACKING_POINT_DIVIDER;
  const siteLanguage = getLanguage();
  const pageUrl = getCurrentPageUrl();
  const country = getCountry();

  store.dispatch(adformTrackingPointsTrackEvent(
    ADFORM_TRACKING_POINT_EVENT_TYPE_CLICK,
    ADFORM_TRACKING_ID,
    divider,
    {
      [ADFORM_VARIABLE_KEYS.language]: siteLanguage,
      [ADFORM_VARIABLE_KEYS.pageUrl]: pageUrl,
      [ADFORM_VARIABLE_KEYS.country]: country,
      [ADFORM_VARIABLE_KEYS.campaignId]: trackingVariables.campaignId,
      [ADFORM_VARIABLE_KEYS.isin]: trackingVariables.isin,
      [ADFORM_VARIABLE_KEYS.broker]: trackingVariables.broker,
    },
    trackingPointNameSegment,
  ));
};

export const addEventToTrackingList = (adformTrackingId, divider, pageName, order) => {
  // eslint-disable-next-line no-underscore-dangle,max-len,no-nested-ternary
  window._adftrack = Array.isArray(window._adftrack) ? window._adftrack : (window._adftrack ? [window._adftrack] : []);
  // eslint-disable-next-line no-underscore-dangle
  window._adftrack.push({
    pm: adformTrackingId,
    divider,
    pagename: pageName,
    order,
  });
};

export const createTrackingPointPath = (pageTitle = '', parentPageTitle = '') => {
  const TRACKING_POINT_SEGMENT_MAIN = 'KeyInvest';
  const TRACKING_POINT_SEGMENT_SEPARATOR = '|';
  let trackingPoint = TRACKING_POINT_SEGMENT_MAIN;
  if (parentPageTitle) {
    trackingPoint += `${TRACKING_POINT_SEGMENT_SEPARATOR}${parentPageTitle.trim()}`;
  }

  if (pageTitle) {
    trackingPoint += `${TRACKING_POINT_SEGMENT_SEPARATOR}${pageTitle.trim()}`;
  }

  return trackingPoint;
};

export const adformTrackEventPageView = (
  trackingVars = new AdformTrackingVars(),
  trackingPointPath = '',
) => {
  const trackingVariables = getTrackingVarsWithCampaignId(
    trackingVars,
    getCampaignIdFromQueryParams(),
  );
  const divider = ADFORM_TRACKING_POINT_DIVIDER;
  const siteLanguage = getLanguage();
  const pageUrl = getCurrentPageUrl();
  const country = getCountry();

  store.dispatch(adformTrackingPointsTrackEvent(
    ADFORM_TRACKING_POINT_EVENT_TYPE_PAGE_VIEW,
    ADFORM_TRACKING_ID,
    divider,
    {
      [ADFORM_VARIABLE_KEYS.language]: siteLanguage,
      [ADFORM_VARIABLE_KEYS.pageUrl]: pageUrl,
      [ADFORM_VARIABLE_KEYS.country]: country,
      [ADFORM_VARIABLE_KEYS.campaignId]: trackingVariables.campaignId,
      [ADFORM_VARIABLE_KEYS.isin]: trackingVariables.isin,
      [ADFORM_VARIABLE_KEYS.broker]: trackingVariables.broker,
    },
    '',
    trackingPointPath,
  ));
};
