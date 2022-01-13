import {
  filter, pathOr, sort,
} from 'ramda';
import Cookies from 'js-cookie';
import moment from 'moment';
import getAppConfig from '../../main/AppConfig';
import {
  COUNTRY_CH,
  ENV_PRODUCTION,
  getNumberOfDaysBetweenTwoDates,
} from '../../utils/utils';
import { pathOrString } from '../../utils/typeChecker';
import { TIME_UNIT_MONTHS } from '../../utils/globals';
import { dispatchAnalyticsPageLoadTrack } from '../../analytics/Analytics.helper';
import Logger from '../../utils/logger';

export const COUNTRY_ID_OTHER_COUNTRY = 'otherCountry';

export const getDisclaimerAcceptUrl = () => pathOr('', ['disclaimer', 'accept-url'])(getAppConfig());
export const getDisclaimerCancelUrl = () => pathOr('', ['disclaimer', 'cancel-url'])(getAppConfig());
export const getDisclaimerCountries = () => pathOr([], ['disclaimer', 'countries'])(getAppConfig());

const isCurrentSiteVariantCh = (siteVariant) => (siteVariant === COUNTRY_CH);

export const getStatisticsCheckedDefaultState = (
  siteVariant,
) => !!isCurrentSiteVariantCh(siteVariant);

export const getUserPreferenceDefaultState = (
  siteVariant,
) => !!isCurrentSiteVariantCh(siteVariant);

export const getMarketingDefaultState = (
  siteVariant,
) => !!isCurrentSiteVariantCh(siteVariant);

export const getCurrentSelectedCountry = () => {
  let countryObj = null;
  getDisclaimerCountries().map((country) => {
    if (country.selected) {
      countryObj = country;
    }
    return false;
  });
  return countryObj;
};

export const isOtherCountrySelected = (
  currentSelectedCountryId,
) => currentSelectedCountryId === COUNTRY_ID_OTHER_COUNTRY;

export const getSelectedCountryId = (countryData) => pathOrString('', ['id'], countryData);

/** UBS Privacy settings cookie name with the current version of cookie settings * */
const UBS_PRIVACY_SETTINGS_COOKIE_NAME = 'ubs_cookie_settings_2.0.4';

const UBS_MAIN_DOMAIN = 'ubs.com';

/** Mapping for the values of each disclaimer checkbox as per documentation:
 * https://support.solvians.com/secure/attachment/25405/www.ubs.com-cookie-as-a-service-interface-developers-guide-for-standalone-solutions-microsites-v1.0.pdf
 */
export const USER_PREFERENCES_CHECKBOX_CATEGORY = 2;
export const STATISTICS_PERFORMANCE_TRACKING_CHECKBOX_CATEGORY = 3;
export const MARKETING_THIRD_PARTY_CHECKBOX_CATEGORY = 4;

export const privacyCheckboxesToValuesMapping = {
  isUserPreferenceChecked: USER_PREFERENCES_CHECKBOX_CATEGORY,
  isStatisticsChecked: STATISTICS_PERFORMANCE_TRACKING_CHECKBOX_CATEGORY,
  isMarketingChecked: MARKETING_THIRD_PARTY_CHECKBOX_CATEGORY,
};

export const filterAcceptedPrivacySettings = (privacySettings) => {
  if (!privacySettings) {
    return [];
  }
  const isAccepted = (privacySetting) => privacySetting === true;
  return Object.keys(filter(isAccepted, privacySettings));
};

export const sortNumbersListDescending = (list) => {
  const diff = (a, b) => b - a;
  return sort(diff, list);
};

export const getAcceptedPrivacySettingsValues = (
  acceptedPrivacySettings,
  checkboxStateToValueMapping,
) => {
  if (!acceptedPrivacySettings || !checkboxStateToValueMapping) {
    return [];
  }
  const privacySettingsValues = [];
  acceptedPrivacySettings.forEach((acceptedPrivacySetting) => {
    const privacySettingValue = checkboxStateToValueMapping[acceptedPrivacySetting];
    if (privacySettingValue) {
      privacySettingsValues.push(privacySettingValue);
    }
  });
  return sortNumbersListDescending(privacySettingsValues);
};

export const generatePrivacySettingsCookieValue = (acceptedPrivacySettingsValues) => {
  const COOKIE_VALUE_PREFIX = 0;
  const COOKIE_VALUE_DELIMITER = '-';
  const COOKIE_VALUE_SUFFIX = 1;
  let privacySettingsCookieValue = `${COOKIE_VALUE_PREFIX}${COOKIE_VALUE_DELIMITER}`;
  if (acceptedPrivacySettingsValues) {
    acceptedPrivacySettingsValues.forEach((privacySettingsValue) => {
      privacySettingsCookieValue = `${privacySettingsCookieValue}${privacySettingsValue}${COOKIE_VALUE_DELIMITER}`;
    });
  }
  privacySettingsCookieValue = `${privacySettingsCookieValue}${COOKIE_VALUE_SUFFIX}`;
  return privacySettingsCookieValue;
};

export const calculateNumberOfDaysInNextSixMonths = () => {
  const today = moment();
  const dateInSixMonthsFromToday = moment().add(6, TIME_UNIT_MONTHS);
  return getNumberOfDaysBetweenTwoDates(today, dateInSixMonthsFromToday);
};

export const setUBSPrivacySettingsCookie = (privacySettings) => {
  const acceptedPrivacySettings = filterAcceptedPrivacySettings(privacySettings);
  const acceptedPrivacySettingsValues = getAcceptedPrivacySettingsValues(
    acceptedPrivacySettings,
    privacyCheckboxesToValuesMapping,
  );
  const privacySettingCookieValue = generatePrivacySettingsCookieValue(
    acceptedPrivacySettingsValues,
  );
  try {
    const { environment } = getAppConfig();
    if (environment !== ENV_PRODUCTION) {
      Logger.warn(
        'Setting shared cookie only works from the same parent domain of a subdomain (key-invest.ubs.com, ubs.com) therefore cookie wont be set for (ubs.com) from localhost development environment!, cookie name and value that would be set on production:',
        UBS_PRIVACY_SETTINGS_COOKIE_NAME,
        privacySettingCookieValue,
      );
    }
    Cookies.set(
      UBS_PRIVACY_SETTINGS_COOKIE_NAME,
      privacySettingCookieValue,
      {
        domain: UBS_MAIN_DOMAIN,
        path: '/',
        expires: calculateNumberOfDaysInNextSixMonths(),
      },
    );
  } catch (e) {
    Logger.error(`setUBSPrivacySettingsCookie(): Failed to set cookie: ${UBS_PRIVACY_SETTINGS_COOKIE_NAME}`, e);
  }
};

export const getUBSPrivacySettingsCookieValue = () => {
  try {
    return Cookies.get(UBS_PRIVACY_SETTINGS_COOKIE_NAME) || '';
  } catch (e) {
    Logger.error(`getUBSPrivacySettingsCookieValue(): Failed to get cookie: ${UBS_PRIVACY_SETTINGS_COOKIE_NAME}`, e);
  }
  return '';
};

export const isPrivacySettingCheckboxAccepted = (
  privacySettingCheckbox,
  ubsPrivacySettingsCookieValue = '',
) => {
  if (!privacySettingCheckbox) {
    return false;
  }
  return String(ubsPrivacySettingsCookieValue).indexOf(privacySettingCheckbox) > -1;
};

export const getStatisticsInitialState = (siteVariant, ubsPrivacySettingsCookie) => {
  if (ubsPrivacySettingsCookie) {
    return isPrivacySettingCheckboxAccepted(
      STATISTICS_PERFORMANCE_TRACKING_CHECKBOX_CATEGORY,
      ubsPrivacySettingsCookie,
    );
  }
  return getStatisticsCheckedDefaultState(siteVariant);
};

export const getUserPreferencesInitialState = (siteVariant, ubsPrivacySettingsCookie) => {
  if (ubsPrivacySettingsCookie) {
    return isPrivacySettingCheckboxAccepted(
      USER_PREFERENCES_CHECKBOX_CATEGORY,
      ubsPrivacySettingsCookie,
    );
  }
  return getUserPreferenceDefaultState(siteVariant);
};

export const getMarketingInitialState = (siteVariant, ubsPrivacySettingsCookie) => {
  if (ubsPrivacySettingsCookie) {
    return isPrivacySettingCheckboxAccepted(
      MARKETING_THIRD_PARTY_CHECKBOX_CATEGORY,
      ubsPrivacySettingsCookie,
    );
  }
  return getMarketingDefaultState(siteVariant);
};

export const trackCurrentPageView = (location) => {
  try {
    const pathname = pathOr('', ['pathname'])(location);
    const search = pathOr('', ['search'])(location);
    dispatchAnalyticsPageLoadTrack(
      pathname + search,
      pathname,
      '',
    );
  } catch (e) {
    Logger.error(
      'DisclaimerPopup',
      'Could not track the current page view just after accepting the disclaimer',
      e,
    );
  }
};
