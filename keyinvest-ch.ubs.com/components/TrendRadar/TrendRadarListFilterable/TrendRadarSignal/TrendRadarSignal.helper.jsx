import { path, pathOr } from 'ramda';
import {
  MOBILE_MODE,
  TABLET_MODE,
} from '../../../../utils/responsive';

export const PATTERN_ID_KEY = 'patternId';
export const BREAKOUT_ID_KEY = 'breakoutId';
export const TREND_RADAR_CHART_BASE_URL = '/patternImg/';

export const getSignalPatternTypeName = path(['patternTypeName']);
export const getSignalUnderlyingName = path(['underlyingName']);
export const getSignalPatternId = path([PATTERN_ID_KEY]);
export const getSignalBreakoutId = path([BREAKOUT_ID_KEY]);
export const getSignalUniqKey = (data) => `${getSignalPatternId(data)}-${getSignalBreakoutId(data) || ''}`;
export const getSignalDirectionOrientation = path(['directionOrientation']);
export const getSignalTopFields = pathOr([], ['topFields']);
export const getSignalBottomFields = pathOr([], ['bottomFields']);
export const getSignalGenericFields = pathOr([], ['columns']);
export const getSignalLeverageProducts = path(['products']);

export const getSignalChartPreviewByWidthHeight = (
  data,
  width = 354,
  height = 273,
) => `${TREND_RADAR_CHART_BASE_URL}${getSignalPatternId(data)}?height=${height}&width=${width}&lang=en`;

export const getSignalChartPreviewByResponsiveMode = (data, responsiveMode) => {
  switch (responsiveMode) {
    case MOBILE_MODE:
      return getSignalChartPreviewByWidthHeight(data, 281, 171);
    case TABLET_MODE:
      return getSignalChartPreviewByWidthHeight(data, 528, 190);
    default:
      return getSignalChartPreviewByWidthHeight(data, 354, 273);
  }
};
