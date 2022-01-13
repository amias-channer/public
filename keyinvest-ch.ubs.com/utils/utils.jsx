import React from 'react';
import { Alert } from 'reactstrap';
import {
  filter, mergeRight, path, pathOr, replace,
} from 'ramda';
import { parseUrl, stringify } from 'query-string';
import Logger from './logger';
import getAppConfig from '../main/AppConfig';
import {
  STATE_NAME_PRODUCT_DETAIL,
  STATE_NAME_PRODUCT_FLATEX_LIST,
  STATE_NAME_PRODUCT_LIST, STATE_NAME_PRODUCT_YIELD_MONITOR_PAGE,
  STATE_NAME_TREND_RADAR_DETAILS_PAGE,
  STATE_NAME_TREND_RADAR_LIST_PAGE,
  STATE_NAME_USER_DASHBOARD_PAGE,
  TREND_RADAR_DETAILS_ID_PARAM,
} from '../main/constants';
import { pathOrString } from './typeChecker';
import {
  INSTRUMENT_IDENTIFIER_ISIN,
  INSTRUMENT_IDENTIFIER_SIN,
  INSTRUMENT_IDENTIFIER_VALOR, TIME_UNIT_DAYS,
} from './globals';

export const ENV_DEV = 'development';
export const ENV_PRODUCTION = 'production';

export const SORT_ASC = 'asc';
export const SORT_DESC = 'desc';
export const SORT_ASC_NUM = 1;
export const SORT_DESC_NUM = -1;

export const COUNTRY_DE = 'de';
export const COUNTRY_CH = 'ch';

export const KEYBOARD_KEY_SPACE = ' ';
export const KEYBOARD_KEY_ARROW_DOWN = 'ArrowDown';
export const KEYBOARD_KEY_ARROW_LEFT = 'ArrowLeft';
export const KEYBOARD_KEY_ARROW_RIGHT = 'ArrowRight';
export const KEYBOARD_KEY_ARROW_UP = 'ArrowUp';
export const KEYBOARD_KEY_ENTER = 'Enter';
export const KEYBOARD_KEY_ESCAPE = 'Escape';

export const KEYBOARD_KEY_ENTER_CODE = 13;

export const IDENTIFIER_TYPE_ISIN = 'isin';

export const NUMBER_SEPARATOR = {
  [COUNTRY_DE]: {
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  [COUNTRY_CH]: {
    thousandsSeparator: '\'',
    decimalSeparator: '.',
  },
};

/* Unique ID util methods */
export function generateUniqId() {
  return `${Math.random()
    .toString(36)
    .substr(2, 9)}`;
}

export function injectUniqIds(list, key = 'id') {
  try {
    if (list) {
      return list.map((item) => {
        if (!item[key]) {
          return {
            ...item,
            [key]: generateUniqId(),
          };
        }
        return item;
      });
    }
  } catch (e) {
    Logger.warn('UTILS', 'injectUniqKeys', 'unable to inject uniq keys into', list, e);
  }
  return list;
}

export const decode = (html) => {
  try {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  } catch (e) {
    Logger.warn(e);
  }
  return html;
};

/* Formatting util methods */
export function formatTimeUnit(unit) {
  if (unit < 10) {
    return `0${unit}`;
  }
  return unit;
}

/**
 * Parse Number from Localized string into float
 * @param formattedNumber
 * @param applicationCountry
 * @returns {null|number}
 */
export const parseNumber = (formattedNumber, applicationCountry) => {
  const { application } = getAppConfig();
  let country = applicationCountry;
  if (!country) {
    country = application;
  }
  try {
    let result = String(formattedNumber);
    if (result) {
      if ([COUNTRY_DE, COUNTRY_CH].indexOf(country) > -1) {
        if (country === COUNTRY_DE
          && result.indexOf(NUMBER_SEPARATOR[COUNTRY_DE].decimalSeparator) > -1
        ) {
          result = result.split(NUMBER_SEPARATOR[COUNTRY_DE].thousandsSeparator).join('');
          result = result.split(NUMBER_SEPARATOR[COUNTRY_DE].decimalSeparator).join('.');
          return parseFloat(result);
        }

        if (country === COUNTRY_CH
          && result.indexOf(NUMBER_SEPARATOR[COUNTRY_CH].thousandsSeparator) > -1) {
          result = result.split(NUMBER_SEPARATOR[COUNTRY_CH].thousandsSeparator).join('');
        }
      }
      return parseFloat(result);
    }
  } catch (e) {
    Logger.warn('parseNumber', e, formattedNumber);
  }
  return null;
};

/**
 * Format number into localized number (taken from the legacy KeyInvest app)
 * @param raw
 * @param minPrecisionParam
 * @param maxPrecisionParam
 * @param decimalSeparatorParam
 * @param thousandSeparatorParam
 * @returns {string}
 */
export const formatNumber = (
  raw, minPrecisionParam, maxPrecisionParam, decimalSeparatorParam, thousandSeparatorParam,
) => {
  const appConfig = getAppConfig();
  let decimalSeparator = decimalSeparatorParam;
  let thousandSeparator = thousandSeparatorParam;
  let maxPrecision = maxPrecisionParam;
  let minPrecision = minPrecisionParam;

  if (decimalSeparator === undefined || decimalSeparator === '' || decimalSeparator === null) {
    decimalSeparator = appConfig.numberSeparator.decimalSeparator;
  }
  if (thousandSeparator === undefined || thousandSeparator === '' || thousandSeparator === null) {
    thousandSeparator = appConfig.numberSeparator.thousandsSeparator;
  }
  if (maxPrecision === undefined || maxPrecision === '' || maxPrecision === null) {
    maxPrecision = appConfig.numberSeparator.precisionMax;
  }
  if (minPrecision === undefined || minPrecision === '' || minPrecision === null) {
    minPrecision = appConfig.numberSeparator.precision;
  }

  let number;
  if (raw !== undefined && raw !== null && !Number.isNaN(parseFloat(raw)) && raw !== '--') {
    if (typeof raw === 'string' && (raw.indexOf('\'') >= 0 || raw.indexOf(',') >= 0)) {
      return raw;
    }
    number = parseFloat(raw);
  } else {
    return '--';
  }

  // as first step the precision formatting
  const max = Number(number.toFixed(maxPrecision));
  const min = Number(number.toFixed(minPrecision));
  const diff = max - min;
  let result = String(min + diff);
  const numberMin = number.toFixed(minPrecision);
  if (numberMin.length > result.length) {
    result = numberMin;
  }

  const resultParts = result.split('.');

  // prefix
  let formattedResult = '';
  let preDecimal = resultParts[0];

  if (resultParts[0].charAt(0) === '-') {
    formattedResult = '-';
    preDecimal = resultParts[0].slice(1);
  }

  // thousandSeparator in preDecimal
  let formattedPreDecimal = '';
  for (let i = (preDecimal.length - 1); i >= 0; i -= 1) {
    if (((preDecimal.length - i) % 3 === 1)
      && i !== preDecimal.length - 1) {
      formattedPreDecimal = thousandSeparator + formattedPreDecimal;
    }
    formattedPreDecimal = preDecimal.charAt(i) + formattedPreDecimal;
  }
  formattedResult += formattedPreDecimal;

  // postfix
  if (resultParts.length === 2) {
    formattedResult += decimalSeparator + resultParts[1];
  }

  return formattedResult;
};

/* Navigation/State util methods */
export const getNavigationTopNodesFromAppConfig = () => {
  const config = getAppConfig();
  const {
    unlinked, main, top, tools, flatex,
  } = config.navigation;
  return [].concat(unlinked || [], tools || [], main || [], top || [], flatex || []);
};

export const oneOrMoreVisibleNavigationItem = (items) => {
  const filteredList = items.filter((item) => item.isHidden !== true);
  return filteredList.length > 0;
};

export const searchStateNameInTree = (navigationNode, stateName) => {
  if (navigationNode.stateName === stateName) {
    return navigationNode;
  }

  if (navigationNode.submenu) {
    let i;
    let result = null;
    for (i = 0; result === null && i < navigationNode.submenu.length; i += 1) {
      result = searchStateNameInTree(navigationNode.submenu[i], stateName);
    }
    return result;
  }
  return null;
};

export const getSubNavigationByStateName = (stateName) => {
  try {
    const navigation = getNavigationTopNodesFromAppConfig();
    return navigation.filter((item) => item.stateName === stateName)[0].submenu;
  } catch (e) {
    Logger.error('PAGE', 'Unable to find submenu for the state', stateName, e);
    return [];
  }
};

export const mapPageStateNameToComponent = (stateName, stateNameToComponentConfig) => {
  if (stateName && stateNameToComponentConfig[stateName]) {
    return stateNameToComponentConfig[stateName];
  }
  return () => (
    <div>
      <Alert
        color="danger"
      >
        {`Page component ${stateName} is not setup`}
      </Alert>
    </div>
  );
};

export const getPathByStateName = (stateName) => searchStateNameInTree(
  { submenu: getNavigationTopNodesFromAppConfig() }, stateName,
);

/* URL util methods */
export const replaceParamsInPath = (uPath, params = {}) => {
  let result = uPath;
  try {
    if (params && Object.keys(params).length > 0) {
      Object.keys(params).map((paramKey) => {
        result = result.replace(`:${paramKey}`, params[paramKey]);
        return result;
      });
    }
  } catch (e) {
    Logger.warn('UTILS', 'replaceParamsInPath', e);
  }
  return result;
};

export const appendModeFlatex = (url) => {
  const MODE_FLATEX = 'mode=flatex';
  const parsedUrlData = parseUrl(url);
  if (parsedUrlData.query && typeof parsedUrlData.query === 'object' && Object.keys(parsedUrlData.query).length > 0) {
    return `${url}&${MODE_FLATEX}`;
  }
  return `${url}?${MODE_FLATEX}`;
};

export const isModeFlatex = () => {
  const appConfig = getAppConfig();
  return appConfig.isModeFlatex && appConfig.isModeFlatex === true;
};

export const getProductParams = (source) => ({
  ...source,
  identifierValue: path(['identifierValue'], source),
  identifierType: pathOr('isin', ['identifierType'], source),
  action: pathOr('index', ['action'], source),
});

/**
 * Generate Product Details Page link
 * @param identifierType
 * @param identifierValue
 * @returns {string}
 */
export const getProductLink = (identifierType, identifierValue) => {
  const action = 'index';
  let link = '';
  if (identifierType && identifierValue) {
    const productDetailPath = getPathByStateName(STATE_NAME_PRODUCT_DETAIL);
    if (productDetailPath && productDetailPath.url) {
      const productDetailUrl = productDetailPath.url;
      if (productDetailUrl) {
        link = replaceParamsInPath(
          productDetailUrl, { action, identifierType, identifierValue },
        );
        if (isModeFlatex()) {
          return appendModeFlatex(link);
        }
        return link;
      }
    } else {
      Logger.error(`Please set a page with the state name '${STATE_NAME_PRODUCT_DETAIL}' in CMS`);
    }
  }
  return link;
};

export const getProductListLink = () => {
  const currentPath = getPathByStateName(
    isModeFlatex() ? STATE_NAME_PRODUCT_FLATEX_LIST : STATE_NAME_PRODUCT_LIST,
  );
  if (currentPath && currentPath.url) {
    return currentPath.url;
  }
  return '';
};

export const getYieldMonitorLink = () => {
  const currentPath = getPathByStateName(
    STATE_NAME_PRODUCT_YIELD_MONITOR_PAGE,
  );
  if (currentPath && currentPath.url) {
    return currentPath.url;
  }
  return '';
};

export const getTrendRadarSignalListLink = () => getPathByStateName(
  STATE_NAME_TREND_RADAR_LIST_PAGE,
).url;

export const getMyKeyInvestDashboardLink = () => pathOrString('', ['url'], getPathByStateName(
  STATE_NAME_USER_DASHBOARD_PAGE,
));

export const getTrendRadarSignalDetailLink = (id) => {
  const pathByStateName = getPathByStateName(STATE_NAME_TREND_RADAR_DETAILS_PAGE);
  if (pathByStateName && pathByStateName.url) {
    return replaceParamsInPath(
      pathByStateName.url, { [TREND_RADAR_DETAILS_ID_PARAM]: id },
    );
  }
  Logger.error(`Please set a page with the state name '${STATE_NAME_TREND_RADAR_DETAILS_PAGE}' in CMS`);
  return '';
};

export const getFileNameFromUrl = (url) => {
  if (typeof url === 'string') {
    const splited = url.split('/');
    if (splited.length > 0) {
      return splited[splited.length - 1];
    }
  }
  return url;
};

export const sendCurrentBrowserLinkByEmail = (subject) => {
  const body = window.location.href;
  let uri = 'mailto:?subject=';
  uri += encodeURIComponent(decode(subject));
  uri += '&body=';
  uri += encodeURIComponent(body);
  window.open(uri);
};

export const bookmarkCurrentBrowserLink = () => {
  const pageTitle = document.title;
  const pageURL = document.location;
  try {
    // Internet Explorer solution
    window.external.AddFavorite(pageURL, pageTitle);
  } catch (e) {
    try {
      // Mozilla Firefox solution
      window.sidebar.addPanel(pageTitle, pageURL, '');
    } catch (ex) {
      // The rest browsers (i.e Chrome, Safari)
      // eslint-disable-next-line no-alert
      alert(`Press ${navigator.userAgent.toLowerCase().indexOf('mac') !== -1 ? 'Cmd' : 'Ctrl'}+D to bookmark this page.`);
    }
  }
  return false;
};

/* Filtering Util Methods */
const containsText = (textToCompare) => (item) => item.label.toString().toLowerCase()
  .indexOf(
    textToCompare.toLowerCase(),
  ) > -1;

export const getFilteredListByText = (text, list) => filter(containsText(text), list);

export const getAlphabets = () => 'abcdefghijklmnopqrstuvwxyz';
export const getNumbers = () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/* Other Util Methods */

export const printCurrentPage = () => {
  window.print();
};

export const searchAndReplaceTextInString = (searchText, replaceWith, str, flags = 'g') => {
  const regex = new RegExp(`${searchText}`, flags);
  return replace(regex, (typeof replaceWith !== 'undefined' && replaceWith !== null ? replaceWith : ''), str || '');
};

export const isEven = (n) => n % 2 === 0;

export const arrayContainsValue = (
  valueToSearch, subjectArray,
) => subjectArray.indexOf(valueToSearch) > -1;

const notEqual = (value) => (arrayItem) => arrayItem !== value;
export const removeItemFromArray = (
  valueToRemove, subjectArray,
) => filter(notEqual(valueToRemove), subjectArray);

export const getEmailValidationRegex = () => /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

export const isLocalDevEnv = () => {
  const appConfig = getAppConfig();
  const { location } = window;
  return appConfig.environment === ENV_DEV && location.hostname !== appConfig.hostname;
};

export const isProductionEnv = () => {
  const appConfig = getAppConfig();
  return appConfig.environment === ENV_PRODUCTION;
};

export const inverseSortDirection = (currentSort, asc = SORT_ASC, desc = SORT_DESC) => {
  if (currentSort === asc) {
    return desc;
  }
  return asc;
};

export const getErrorPageContentByStatusCode = (code = 404) => {
  const appConfig = getAppConfig();
  return pathOr(null, [`error-${code}`, 'data'])(appConfig);
};

export const isEmptyData = (data) => {
  if (Array.isArray(data)) {
    return !data.length > 0;
  }

  return !Object.keys(data || {}).length > 0;
};

/**
 * Check is the current useragent is a Bot or a Browser
 * @param userAgent
 * @returns {boolean}
 */
export const isUserAgentBot = (userAgent) => {
  try {
    // If userAgent is not set as pa
    const ua = userAgent || pathOr(undefined, ['navigator', 'userAgent'])(window);
    const botPattern = '(googlebot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)';
    const re = new RegExp(botPattern, 'i');

    if (ua && re.test(ua)) {
      return true;
    }
  } catch (e) {
    Logger.debug('An error occurred while checking isUserAgentBot', e);
  }

  // In case of failure, fallback to browser behavior
  return false;
};

export const stringifyParams = (data, options = { arrayFormat: 'bracket' }) => {
  try {
    return stringify(data, options);
  } catch (e) {
    Logger.debug('FILTER_HELPER', data, e);
  }
  return '';
};

/**
 * Set new or override existing query params in a url
 * @param url
 * @param newQueryParams
 * @returns {string}
 */
export const setQueryParamsToUrl = (url, newQueryParams = {}) => {
  const parsedUrl = parseUrl(url, { arrayFormat: 'bracket' });
  let resultUrl = '';
  if (parsedUrl && parsedUrl.url) {
    resultUrl += parsedUrl.url;
  }
  if (parsedUrl && parsedUrl.query) {
    resultUrl += `?${stringifyParams(mergeRight(parsedUrl.query, newQueryParams))}`;
  }
  return resultUrl;
};

export const notEmptyString = (string) => !!(string && string !== '');
export const isEmptyString = (string) => string === '';

export const addDocumentClickEventListeners = (callbackFunction) => {
  document.addEventListener('mousedown', callbackFunction);
  document.addEventListener('touchstart', callbackFunction);
};

export const removeDocumentClickEventListeners = (callbackFunction) => {
  document.removeEventListener('mousedown', callbackFunction);
  document.removeEventListener('touchstart', callbackFunction);
};

export const getAppLocale = () => path(['locale'])(getAppConfig());
export const getAppSiteVariant = () => path(['application'])(getAppConfig());

export const isOfTypeFunction = (variable) => typeof variable === 'function';

export const RELATED_PRODUCT_LONG = 'long';
export const RELATED_PRODUCT_SHORT = 'short';
export const RELATED_PRODUCT_CALL = 'call';
export const RELATED_PRODUCT_PUT = 'put';
export const isProductNameContainingType = (name, type) => {
  const upperName = name.toUpperCase();
  return upperName.indexOf(type.toUpperCase()) >= 0;
};
export const getRelatedProductType = (product, signalDirection) => {
  if (product && product.name) {
    const { name } = product;
    if (isProductNameContainingType(name, RELATED_PRODUCT_LONG)) {
      return RELATED_PRODUCT_LONG;
    }
    if (isProductNameContainingType(name, RELATED_PRODUCT_SHORT)) {
      return RELATED_PRODUCT_SHORT;
    }
    if (isProductNameContainingType(name, RELATED_PRODUCT_CALL)) {
      return RELATED_PRODUCT_CALL;
    }
    if (isProductNameContainingType(name, RELATED_PRODUCT_PUT)) {
      return RELATED_PRODUCT_PUT;
    }
  }
  // Fallback to check based on signal direction
  if (signalDirection === 'negative') {
    return RELATED_PRODUCT_SHORT;
  }
  return RELATED_PRODUCT_LONG;
};

export const getTileDataUrlForInstrument = (instrument) => {
  let tileDataUrlWithParams = '';
  const tileDataPath = '/tile-data?';
  if (instrument) {
    if (instrument[INSTRUMENT_IDENTIFIER_ISIN]) {
      tileDataUrlWithParams = `${tileDataPath}${INSTRUMENT_IDENTIFIER_ISIN}=${instrument[INSTRUMENT_IDENTIFIER_ISIN]}`;
    } else if (instrument[INSTRUMENT_IDENTIFIER_VALOR]) {
      tileDataUrlWithParams = `${tileDataPath}${INSTRUMENT_IDENTIFIER_VALOR}=${instrument[INSTRUMENT_IDENTIFIER_VALOR]}`;
    } else {
      tileDataUrlWithParams = instrument[INSTRUMENT_IDENTIFIER_SIN] ? `${tileDataPath}${INSTRUMENT_IDENTIFIER_SIN}=${instrument[INSTRUMENT_IDENTIFIER_SIN]}` : '';
    }
  }
  return tileDataUrlWithParams;
};

export const getNumberOfDaysBetweenTwoDates = (startMoment, endMoment) => {
  const DEFAULT_NUMBER_OF_DAYS_BETWEEN_DATES = 0;
  if (!(startMoment.isValid && startMoment.isValid())
    || !(endMoment.isValid && endMoment.isValid())) {
    Logger.error('getNumberOfDaysBetweenTwoDates(): momentA and momentB should be valid instances of moment');
    return DEFAULT_NUMBER_OF_DAYS_BETWEEN_DATES;
  }
  return endMoment.diff(startMoment, TIME_UNIT_DAYS);
};

export const FILE_CONTENT_TYPES = {
  termSheet: 'termsheet',
  factSheet: 'factsheet',
  flyer: 'flyer',
  finalProspectus: 'final_prospectus',
  finalTerms: 'final_terms',
  prospectusSupplement: 'prospectus_supplement',
  freeWritingProspectus: 'free_writing_prospectus',
  performanceUpdate: 'performanceUpdate',
  monthlyPerformanceUpdate: 'monthly_performance_update',
  performanceSupplement: 'product_supplement',
  pressRelease: 'press_release',
  issuerExtension: 'issuer_extension_option_exercise_notice',
  other: 'other',
  brochure: 'brochure',
  legalAnnouncement: 'legal_announcement',
  baseProspectus: 'base_prospectus',
};

export const getTrackingPointNameByContentType = (fileContentType) => {
  switch (fileContentType) {
    case FILE_CONTENT_TYPES.termSheet:
      return 'termsheet-pdf-download-click';
    case FILE_CONTENT_TYPES.factSheet:
      return 'factsheet-pdf-download-click';
    case FILE_CONTENT_TYPES.flyer:
      return 'flyer-pdf-download-click';
    case FILE_CONTENT_TYPES.finalProspectus:
      return 'final-prospectus-pdf-download-click';
    case FILE_CONTENT_TYPES.finalTerms:
      return 'final-terms-pdf-download-click';
    case FILE_CONTENT_TYPES.prospectusSupplement:
      return 'prospectus-supplement-pdf-download-click';
    case FILE_CONTENT_TYPES.freeWritingProspectus:
      return 'free-writing-prospectus-pdf-download-click';
    case FILE_CONTENT_TYPES.performanceUpdate:
      return 'performance-update-pdf-download-click';
    case FILE_CONTENT_TYPES.monthlyPerformanceUpdate:
      return 'monthly-performance-update-pdf-download-click';
    case FILE_CONTENT_TYPES.performanceSupplement:
      return 'performance-supplement-pdf-download-click';
    case FILE_CONTENT_TYPES.pressRelease:
      return 'press-release-pdf-download-click';
    case FILE_CONTENT_TYPES.issuerExtension:
      return 'issuer-extension-pdf-download-click';
    case FILE_CONTENT_TYPES.other:
      return 'other-pdf-download-click';
    case FILE_CONTENT_TYPES.brochure:
      return 'brochure-pdf-download-click';
    case FILE_CONTENT_TYPES.legalAnnouncement:
      return 'legal-announcement-pdf-download-click';
    case FILE_CONTENT_TYPES.baseProspectus:
      return 'base-prospectus-pdf-download-click';
    default:
      return 'pdf-download-click';
  }
};
