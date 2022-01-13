import { TIMESPAN_5Y } from '../../Chart/Chart.helper';
import { getAppLocale, getAppSiteVariant } from '../../../utils/utils';

export const MY_MARKET_INSTRUMENT_IDENTIFIER = 'sin';

export const MY_MARKETS_CHART_OPTIONS = {
  showTimespans: true,
  showScrollbar: true,
  showTooltip: true,
  defaultTimespan: TIMESPAN_5Y,
};

export const getMyMarketsUnderlyingSearchUrl = () => `/autocomplete.php?format=json&locale=${getAppLocale()}&siteVariant=${getAppSiteVariant()}&showUnderlyingsOnly=true`;
