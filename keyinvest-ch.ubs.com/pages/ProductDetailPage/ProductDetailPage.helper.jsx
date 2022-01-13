import React from 'react';
import {
  pathOr, path,
} from 'ramda';
import { Button, UncontrolledTooltip } from 'reactstrap';
import i18n from '../../utils/i18n';
import Logger from '../../utils/logger';
import PushableDefault from '../../components/PushManager/PushableDefault';
import PushableSize from '../../components/PushManager/PushableSize';
import Notification from '../../components/ProductDetail/Notification';
import {
  sendCurrentBrowserLinkByEmail,
  bookmarkCurrentBrowserLink,
  printCurrentPage, decode,
} from '../../utils/utils';
import getAppConfig from '../../main/AppConfig';
import {
  TIMESPAN_5Y,
} from '../../components/Chart/Chart.helper';

export const DOCUMENTS_SECTION_KEY = 'documents';
export const BID_FIELD_NAME = 'bid';
export const ASK_FIELD_NAME = 'ask';
export const SELL_LABEL = 'sell';
export const BUY_LABEL = 'buy';
export const SIN_COLUMN = 'sin';
export const DISTANCE2BARRIER_COLUMN = 'distance2Barrier';
export const DISTANCE2BARRIER_RAW_COLUMN = 'distance2BarrierRaw';
export const DISTANCE2STRIKE_COLUMN = 'distance2Strike';
export const DISTANCE2STRIKE_RAW_COLUMN = 'distance2StrikeRaw';

export const EMAIL_TOOL_BUTTON = 'emailAction';
export const BOOKMARK_TOOL_BUTTON = 'bookmarkAction';
export const PRINT_TOOL_BUTTON = 'printAction';

export const PRODUCT_DETAILS_CHART_OPTIONS = {
  showTimespans: true,
  showScrollbar: true,
  showTooltip: true,
  defaultTimespan: TIMESPAN_5Y,
};

export const getProductName = (data) => decode(pathOr('', ['headerData', 'name', 'value'])(data));
export const getIdentifierValueFromProps = path(['match', 'params', 'identifierValue']);

export const getProductShortUrl = (isin) => {
  const appConfig = getAppConfig();
  if (appConfig.localesToUrl && appConfig.locale && appConfig.localesToUrl[appConfig.locale]) {
    return `${appConfig.localesToUrl[appConfig.locale]}${isin}`;
  }
  return `/${isin}`;
};

export const getUnderlyingsNames = pathOr(null, ['headerData', 'underlyingsNames']);

export const getProductDescription = (data = {}) => {
  const svspLabel = pathOr(null, ['headerData', 'svspEusipaProductType', 'label'])(data);
  const svspValue = pathOr(null, ['headerData', 'svspEusipaProductType', 'value'])(data);
  if (svspLabel && svspValue) {
    return `${svspLabel} ${svspValue}`;
  }

  const productTypeLabel = pathOr(null, ['headerData', 'instrumentGroupName', 'label'])(data);
  const productTypeValue = pathOr(null, ['headerData', 'instrumentGroupName', 'value'])(data);
  if (productTypeLabel && productTypeValue) {
    return `${productTypeLabel} ${productTypeValue}`;
  }
  return '';
};

export const getWkn = pathOr({}, ['identifiersData', 'wkn']);
export const getSymbol = pathOr({}, ['identifiersData', 'symbol']);
export const getValor = pathOr({}, ['identifiersData', 'valor']);
export const getIsin = pathOr({}, ['identifiersData', 'isin']);
export const getLifecycle = path(['lifeCycle']);

export const generateFullProductName = (data) => {
  if (data && getProductName(data)) {
    return `${getProductName(data)} (${getIsin(data).value}) ${i18n.t('on')} ${getUnderlyingsNames(data) ? getUnderlyingsNames(data).value : ''} - ${i18n.t('ubs_keyinvest_project_name')}`;
  }
  return '';
};

export const getProductPageTitle = (data) => decode(pathOr('', ['pageTitle'])(data));
export const getProductMetaDescription = (data) => decode(pathOr('', ['metaDescription'])(data));
export const getProductMetaKeywords = pathOr('', ['metaKeywords']);
export const getProductBhpChartUrl = path(['productChartUrls', 'bhp']);
export const getTenorWeightChartUrl = path(['productChartUrls', 'tenorWeights']);

export const getNews = pathOr([], ['newsForUnderlying']);
export const getInstrumentDataLeft = (data = {}) => data.instrumentDataLeft;
export const getInstrumentDataRight = (data = {}) => data.instrumentDataRight;
export const getAnnotations = pathOr({}, ['annotationsCombined']);
export const getWarnings = pathOr([], ['warningHigh']);
export const getProductDescriptionText = path(['description']);
export const getInstrumentGroupName = (data) => pathOr('', ['data', 'headerData', 'instrumentGroupNameEnglish', 'value'], data);

export const getProductDetailPageTrackingPoint = (productGroupName) => `KeyInvest|Product details|${productGroupName}`;

export const getBrokersData = (rawBrokers, bidAsk) => {
  if (rawBrokers && Object.keys(rawBrokers).length > 0) {
    return Object.keys(rawBrokers).map((brokerKey) => {
      let link = '';
      if (bidAsk === BID_FIELD_NAME) {
        link = rawBrokers[brokerKey].urlSell;
      }
      if (bidAsk === ASK_FIELD_NAME) {
        link = rawBrokers[brokerKey].urlBuy;
      }
      return {
        key: brokerKey,
        link,
        label: rawBrokers[brokerKey].label,
      };
    });
  }
  return [];
};

export const getLastBidChange = path(['sellBuyBoxData', 'lastBidChange', 'value']);
export const getPriceTileData = (fieldName, data = {}) => ({
  title: i18n.t(fieldName),
  showPriceTile: pathOr(false, ['sellBuyBoxData', `show${fieldName.replace(/^\w/, (c) => c.toUpperCase())}Box`])(data),
  price: (<PushableDefault field={pathOr({}, ['sellBuyBoxData', fieldName, 'value'])(data)} />),
  currency: pathOr('', ['sellBuyBoxData', 'realPriceCurrency', 'value'])(data),
  volume: (<PushableSize field={pathOr({}, ['sellBuyBoxData', `${fieldName}Size`, 'value'])(data)} />),
  brokers: getBrokersData(pathOr('', ['sellBuyBoxData', 'brokers'])(data), fieldName),
  buttonLabel: fieldName === BID_FIELD_NAME ? SELL_LABEL : BUY_LABEL,
});

export const getNotifications = (data) => getWarnings(data).map((notification) => (
  <Notification key={notification} type="warning" content={notification} />
));

export const triggerToolButtonAction = (actionType, data) => {
  switch (actionType) {
    case EMAIL_TOOL_BUTTON:
      sendCurrentBrowserLinkByEmail(generateFullProductName(data));
      break;
    case BOOKMARK_TOOL_BUTTON:
      bookmarkCurrentBrowserLink();
      break;
    case PRINT_TOOL_BUTTON:
      printCurrentPage();
      break;
    default:
      Logger.warn('PRODUCT_DETAIL_PAGE_HELPER', `Tool button action type ${actionType} not implemented`);
  }
};

const shouldShowSecMarketButton = (data) => pathOr(false, ['secondaryMarketButton', 'showButton'], data);
const getSecMarketButtonLabel = (data) => pathOr('', ['secondaryMarketButton', 'buttonLabel'], data);
const getSecMarketTooltipTitle = (data) => pathOr('', ['secondaryMarketButton', 'tooltipTitle'], data);
const getSecMarketTooltipText = (data) => pathOr('', ['secondaryMarketButton', 'tooltipText'], data);

export const getSecondaryMarketButton = (data) => {
  const showSecMarketButton = shouldShowSecMarketButton(data);
  if (!showSecMarketButton) {
    return null;
  }
  const secMarketButtonLabel = getSecMarketButtonLabel(data);
  const secMarketTooltipTitle = getSecMarketTooltipTitle(data);
  const secMarketTooltipText = getSecMarketTooltipText(data);

  return (
    <>
      <Button className="ml-auto" type="button" color="outline" id="secondaryMarketButton">{secMarketButtonLabel}</Button>
      <UncontrolledTooltip innerClassName="inner-content" popperClassName="secondaryMarketButtonTooltip" autohide={false} placement="left" target="secondaryMarketButton">
        <h5>{secMarketTooltipTitle}</h5>
        <p>{secMarketTooltipText}</p>
      </UncontrolledTooltip>
    </>
  );
};

export const getKeyInformationDocuments = (data) => {
  const kid = path(['kidDropdown'], data);
  if (kid && typeof kid === 'object' && !Array.isArray(kid)) {
    return kid;
  }
  return null;
};

export const getHistoryDataLink = (data) => path(['costHistory'], data);

export const getInSubscriptionButtonData = (data) => path(['subscribeButton'], data);
export const getAddToMyWatchlistButtonData = (data) => path(['addToMyWatchlistButton'], data);
export const getProductDataForAddToWatchlist = (data) => ({
  name: getProductName(data),
  isin: getIsin(data).value,
});

export const getTrackingPointNameByActionType = (actionType) => {
  switch (actionType) {
    case EMAIL_TOOL_BUTTON:
      return 'interaction-icon-email-click';
    case BOOKMARK_TOOL_BUTTON:
      return 'interaction-icon-bookmark-click';
    case PRINT_TOOL_BUTTON:
      return 'interaction-icon-print-click';
    default:
      return '';
  }
};
