import { pathOr } from 'ramda';
import {
  bookmarkCurrentBrowserLink,
  printCurrentPage,
  sendCurrentBrowserLinkByEmail,
} from '../../utils/utils';
import Logger from '../../utils/logger';
import { PATTERN_ID_KEY } from '../../components/TrendRadar/TrendRadarListFilterable/TrendRadarSignal/TrendRadarSignal.helper';
import { pathOrArray, pathOrNumber, pathOrString } from '../../utils/typeChecker';

export const getPatternId = (data) => pathOr('', [PATTERN_ID_KEY], data);
export const getUnderlyingName = (data) => pathOrString('', ['underlying', 'name'], data);
export const getUnderlyingSin = (data) => pathOrNumber('', ['underlying', 'sin'], data);
export const getAddAlertUrl = (data) => pathOrString('', ['addAlertUrl'], data);
export const getDirectionOrientation = (data) => pathOrString('', ['directionOrientation'], data);
export const getInlineFields = (data) => pathOrArray([], ['fieldsLevel1'], data);
export const getKeyValueFields = (data) => pathOrArray([], ['fieldsLevel2'], data);
export const getSignalFieldsLeft = (data) => pathOrArray([], ['signalDataLeft'], data);
export const getSignalFieldsRight = (data) => pathOrArray([], ['signalDataRight'], data);
export const getProducts = (data) => pathOrArray([], ['products'], data);
export const getTermsText = (data) => pathOrArray([], ['basicInfo'], data);
export const getSaveSignalUrl = (data) => pathOrString('', ['addSignalUrl'], data);
export const getPatternTypeName = (data) => pathOrString('', ['patternTypeName'], data);

export const EMAIL_TOOL_BUTTON = 'emailAction';
export const BOOKMARK_TOOL_BUTTON = 'bookmarkAction';
export const PRINT_TOOL_BUTTON = 'printAction';

export const triggerToolButtonAction = (actionType, data) => {
  switch (actionType) {
    case EMAIL_TOOL_BUTTON:
      sendCurrentBrowserLinkByEmail(getUnderlyingName(data));
      break;
    case BOOKMARK_TOOL_BUTTON:
      bookmarkCurrentBrowserLink();
      break;
    case PRINT_TOOL_BUTTON:
      printCurrentPage();
      break;
    default:
      Logger.warn('TREND_RADAR_DETAIL_PAGE_HELPER', `Tool button action type ${actionType} not implemented`);
  }
};

export const getSaveSignalPopupData = (data) => ({
  saveSignalUrl: getSaveSignalUrl(data),
  underlyingName: getUnderlyingName(data),
  patternTypeName: getPatternTypeName(data),
});
