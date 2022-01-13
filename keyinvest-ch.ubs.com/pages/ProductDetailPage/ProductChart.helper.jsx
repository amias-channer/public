import {
  clone,
  filter, indexOf, keys, map, path, pathOr, has,
} from 'ramda';
import { stringify } from 'query-string';
import {
  TIMESPAN_1D,
  TIMESPAN_1W, TIMESPAN_MAX,
} from '../../components/Chart/Chart.helper';
import { pathOrObject, pathOrString } from '../../utils/typeChecker';

export const DEFAULT_PRODUCT_DETAILS_CHART_TIMESPAN = TIMESPAN_MAX;
export const getUnderlyingChartData = pathOr({}, ['chartUnderlyingTable']);
export const CHART_TYPE_PRODUCT = 'product';
export const CHART_TYPE_UNDERLYINGS = 'underlyings';
export const getUnderlyingSinFromChartTable = pathOr(null, ['head', 'sin', 'value']);
export const getUnderlyingMarketFromChartTable = pathOr(null, ['head', 'marketId', 'value']);
export const getUnderlyingColorFromChartTable = pathOr(null, ['head', 'color', 'value']);

export const getProductChartUrl = (productData, timespan) => {
  switch (timespan) {
    case TIMESPAN_1D:
    case TIMESPAN_1W:
      return path(['data', 'productChartUrls', `product_${timespan}`])(productData);
    default:
      return path(['data', 'productChartUrls', 'product'])(productData);
  }
};

export const getAllChartUnderlyings = (productData) => {
  const { data } = productData;
  const underlyingChartData = pathOr([], ['rows'], getUnderlyingChartData(data));
  const result = [];
  if (underlyingChartData) {
    underlyingChartData.forEach((item) => {
      const sin = getUnderlyingSinFromChartTable(item);
      const marketId = getUnderlyingMarketFromChartTable(item);
      const color = getUnderlyingColorFromChartTable(item);
      result.push({ sin, marketId, color });
    });
  }
  return result;
};

export const getVisibleUnderlyings = (productData) => {
  const stateUnderlyings = pathOr({}, ['currentChartStatus', 'hiddenUnderlyings'], productData);

  const allUnderlyings = getAllChartUnderlyings(productData);

  const hiddenUnderlyings = filter((item) => item === true, stateUnderlyings);
  const hiddenSins = map((item) => String(item), keys(hiddenUnderlyings));
  const result = filter(
    (item) => indexOf(String(item.sin), hiddenSins) === -1,
    allUnderlyings,
  );
  return result;
};

export const getVisibleUnderlyingsQueryParams = (productData) => {
  const visibleUnderlyingsData = getVisibleUnderlyings(productData);
  const benchmarkMarkets = [];
  const benchmarkSins = [];
  const benchmarkColors = [];
  visibleUnderlyingsData.forEach((underlying) => {
    benchmarkSins.push(underlying.sin);
    benchmarkMarkets.push(underlying.marketId);
    benchmarkColors.push(underlying.color);
  });

  return `&sin=${pathOr('', [0], benchmarkSins)
  }&marketId=${pathOr('', [0], benchmarkMarkets)
  }&${stringify({ benchmarkMarkets }, { arrayFormat: 'index' })
  }&${stringify({ benchmarkSins }, { arrayFormat: 'index' })
  }&${stringify({ benchmarkColors }, { arrayFormat: 'index' })}`;
};

export const getUnderlyingsChartUrl = (productData, timespan) => {
  let templateUrl = '';
  switch (timespan) {
    case TIMESPAN_1D:
    case TIMESPAN_1W:
      templateUrl = pathOr('', ['data', 'productChartUrls', `underlyingsTemplate_${timespan}`])(productData);
      break;
    default:
      templateUrl = pathOr('', ['data', 'productChartUrls', 'underlyingsTemplate'])(productData);
      break;
  }
  return templateUrl + getVisibleUnderlyingsQueryParams(productData);
};

export const getChartUrlByTypeAndTimespanAndVisibility = (
  productData,
  chartType = CHART_TYPE_PRODUCT,
  timespan = DEFAULT_PRODUCT_DETAILS_CHART_TIMESPAN,
) => {
  switch (chartType) {
    case CHART_TYPE_PRODUCT:
      return getProductChartUrl(productData, timespan);
    case CHART_TYPE_UNDERLYINGS:
      return getUnderlyingsChartUrl(productData, timespan);
    default:
      break;
  }
  return null;
};

export const getIsProductInSubscription = (data) => pathOr(false, ['isProductInSubscription'], data);
export const getPieChartData = (data) => pathOrObject({}, ['constituentsPieChart'], data);
export const hasPieChartData = (data) => has('components')(getPieChartData(data));
export const getTenorChartLastUpdate = (data) => pathOrString('', ['tenorWeightsChart', 'update', 'value'], data);
export const tenorWeightChartOptions = {
  high: 50,
  axisX: {
    showGrid: false,
  },
  axisY: {
    labelInterpolationFnc(value) {
      return `${value}%`;
    },
  },
};

export const getChartTypeByProductInSubscription = (
  isProductInSubscription,
) => (isProductInSubscription ? CHART_TYPE_UNDERLYINGS : CHART_TYPE_PRODUCT);

export const getInitialChartStatus = (defaultChartStatus, isProductInSubscription = false) => {
  if (isProductInSubscription) {
    return { ...defaultChartStatus, type: CHART_TYPE_UNDERLYINGS };
  }
  return clone(defaultChartStatus);
};
