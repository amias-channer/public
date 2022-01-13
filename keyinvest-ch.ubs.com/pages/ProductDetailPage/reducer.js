import { produce } from 'immer';
import { clone } from 'ramda';
import {
  PRODUCT_DETAIL_PAGE_FETCH_CONTENT,
  PRODUCT_DETAIL_PAGE_GOT_CONTENT,
  PRODUCT_DETAIL_PAGE_TOGGLE_CHART_TYPE,
  PRODUCT_DETAIL_PAGE_TOGGLE_CHART_SIN,
  PRODUCT_DETAIL_PAGE_WILL_UNMOUNT,
  PRODUCT_DETAIL_PAGE_FETCH_ERROR,
  PRODUCT_DETAIL_PAGE_TOGGLE_ADD_PRODUCT_TO_WATCHLIST_POPUP,
} from './actions';
import {
  CHART_TYPE_PRODUCT,
  CHART_TYPE_UNDERLYINGS,
  DEFAULT_PRODUCT_DETAILS_CHART_TIMESPAN,
  getChartTypeByProductInSubscription,
  getChartUrlByTypeAndTimespanAndVisibility,
  getInitialChartStatus,
  getIsProductInSubscription,
} from './ProductChart.helper';

export const defaultChartStatus = {
  type: CHART_TYPE_PRODUCT,
  timespan: DEFAULT_PRODUCT_DETAILS_CHART_TIMESPAN,
  hiddenUnderlyings: {},
  url: '',
};
const initialState = {
  addProductPopup: {
    shouldDisplay: false,
    productIsin: null,
  },
};
const productDetailPageReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case PRODUCT_DETAIL_PAGE_FETCH_CONTENT:
      if (!draft[action.uniqId]) {
        draft[action.uniqId] = {};
      }
      draft[action.uniqId].isLoading = true;
      draft[action.uniqId].data = {};
      break;

    case PRODUCT_DETAIL_PAGE_GOT_CONTENT:
      if (!draft[action.uniqId]) {
        draft[action.uniqId] = {};
      }
      if (action.data && action.data.data) {
        draft[action.uniqId].data = action.data.data;
        const isProductInSubscription = getIsProductInSubscription(action.data.data);
        // Setting ChartSwitcher Status
        draft[action.uniqId].currentChartStatus = getInitialChartStatus(
          defaultChartStatus,
          isProductInSubscription,
        );
        draft[action.uniqId].currentChartStatus.url = getChartUrlByTypeAndTimespanAndVisibility(
          action.data,
          getChartTypeByProductInSubscription(isProductInSubscription),
          action.timespan,
        );
      } else {
        draft[action.uniqId].data = { failed: true, ...action.data };
      }
      draft[action.uniqId].isLoading = false;
      break;


    case PRODUCT_DETAIL_PAGE_FETCH_ERROR:
      if (!draft[action.uniqId]) {
        draft[action.uniqId] = {};
      }

      draft[action.uniqId].data = { failed: true, ...action.data };
      draft[action.uniqId].isLoading = false;
      break;

    case PRODUCT_DETAIL_PAGE_TOGGLE_CHART_TYPE: {
      const productData = draft[action.uniqId];
      if (!productData.currentChartStatus) {
        productData.currentChartStatus = clone(defaultChartStatus);
      }
      productData.currentChartStatus.type = action.chartType;
      if (action.timespan) {
        productData.currentChartStatus.timespan = action.timespan;
      }
      productData.currentChartStatus.url = getChartUrlByTypeAndTimespanAndVisibility(
        productData, action.chartType, action.timespan,
      );
      if (action.chartType === CHART_TYPE_PRODUCT) {
        productData.currentChartStatus.hiddenUnderlyings = {};
      }
      break;
    }
    case PRODUCT_DETAIL_PAGE_TOGGLE_CHART_SIN: {
      const productData = draft[action.uniqId];
      if (!productData.currentChartStatus) {
        productData.currentChartStatus = clone(defaultChartStatus);
      }

      if (action.chartType !== productData.currentChartStatus.type) {
        // Reset All underlyings visibility to TRUE when switching between chart type
        productData.currentChartStatus.hiddenUnderlyings = {};
      } else if (action.chartType === CHART_TYPE_UNDERLYINGS) {
        productData.currentChartStatus.hiddenUnderlyings[
          action.sin
        ] = !productData.currentChartStatus.hiddenUnderlyings[action.sin];
      }

      productData.currentChartStatus.type = action.chartType;

      productData.currentChartStatus.url = getChartUrlByTypeAndTimespanAndVisibility(
        productData, action.chartType, action.timespan,
      );
      break;
    }
    case PRODUCT_DETAIL_PAGE_WILL_UNMOUNT:
      if (draft[action.uniqId]) {
        delete draft[action.uniqId];
      }
      break;
    case PRODUCT_DETAIL_PAGE_TOGGLE_ADD_PRODUCT_TO_WATCHLIST_POPUP:
      draft.addProductPopup.shouldDisplay = !draft.addProductPopup.shouldDisplay;
      break;
    default:
      break;
  }
});

export default productDetailPageReducer;
