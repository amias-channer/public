import { produce } from 'immer';
import {
  MY_WATCH_LIST_ADD_PRODUCT,
  MY_WATCH_LIST_ASK_PRICE_ERROR,
  MY_WATCH_LIST_GET_ASK_PRICE_FOR_PRODUCT,
  MY_WATCH_LIST_GOT_ASK_PRICE_FOR_PRODUCT,
  MY_WATCH_LIST_PRODUCT_ADD_FAILED,
  MY_WATCH_LIST_PRODUCT_ADDED,
  MY_WATCH_LIST_PRODUCT_POPUP_CALCULATE_TOTAL_SUM,
  MY_WATCH_LIST_PRODUCT_POPUP_VALIDATE_INPUT_FIELD,
  MY_WATCH_LIST_RESET_ADD_PRODUCT_POPUP,
  MY_WATCH_LIST_SET_PRODUCT_TO_ADD,
  MY_WATCH_LIST_TOGGLE_ADD_PRODUCT_POPUP,
} from './actions';
import {
  INPUT_FIELD_NAME_POSITION,
  INPUT_FIELD_NAME_PURCHASE_PRICE,
  isValidPositionValue,
  isValidPurchasePriceValue,
  calculateTotalSumForCurrencyPercentage,
  calculateTotalSumForNonPercentageCurrency,
  isCurrencyPercentage,
  isNotionalValueDefined,
  isPositionDefined,
  isPurchasePriceDefined,
} from './WatchlistAddProductPopup.helper';
import i18n from '../../utils/i18n';

export const ADD_PRODUCT_POPUP_INITIAL_POSITION = 1;
export const ADD_PRODUCT_POPUP_INITIAL_PURCHASE_PRICE = null;
export const ADD_PRODUCT_POPUP_INITIAL_ISIN = null;
export const ADD_PRODUCT_POPUP_INITIAL_TOTAL_SUM = 0.00;
export const ADD_PRODUCT_POPUP_INITIAL_IS_LOADING = false;
export const ADD_PRODUCT_POPUP_INITIAL_CURRENCY = null;
export const ADD_PRODUCT_POPUP_INITIAL_NOTIONAL_VALUE = null;
export const ADD_PRODUCT_POPUP_INITIAL_TOTAL_SUM_CALCULATION_ERROR = null;

export const initialState = {
  productIsin: ADD_PRODUCT_POPUP_INITIAL_ISIN,
  position: ADD_PRODUCT_POPUP_INITIAL_POSITION,
  purchasePrice: ADD_PRODUCT_POPUP_INITIAL_PURCHASE_PRICE,
  totalSum: ADD_PRODUCT_POPUP_INITIAL_TOTAL_SUM,
  invalidPositionError: null,
  invalidPurchasePriceError: null,
  isLoading: ADD_PRODUCT_POPUP_INITIAL_IS_LOADING,
  currency: ADD_PRODUCT_POPUP_INITIAL_CURRENCY,
  notionalValue: ADD_PRODUCT_POPUP_INITIAL_NOTIONAL_VALUE,
  totalSumCalculationError: ADD_PRODUCT_POPUP_INITIAL_TOTAL_SUM_CALCULATION_ERROR,
};
const watchListAddProductPopupReducer = (
  state = initialState,
  action,
) => produce(state, (draft) => {
  switch (action.type) {
    case MY_WATCH_LIST_RESET_ADD_PRODUCT_POPUP:
      draft.productIsin = initialState.productIsin;
      draft.position = initialState.position;
      draft.purchasePrice = initialState.purchasePrice;
      draft.totalSum = initialState.totalSum;
      break;
    case MY_WATCH_LIST_TOGGLE_ADD_PRODUCT_POPUP:
      draft.shouldDisplay = !draft.shouldDisplay;
      break;
    case MY_WATCH_LIST_SET_PRODUCT_TO_ADD:
      draft.productIsin = action.productData.isin;
      draft.productName = action.productData.name;
      draft.purchasePrice = action.productData.purchasePrice;
      draft.currency = action.productData.currency;
      draft.notionalValue = action.productData.notionalValue;
      break;
    case MY_WATCH_LIST_GET_ASK_PRICE_FOR_PRODUCT:
      draft.isLoading = true;
      break;
    case MY_WATCH_LIST_GOT_ASK_PRICE_FOR_PRODUCT:
      draft.isLoading = false;
      break;
    case MY_WATCH_LIST_ADD_PRODUCT:
      draft.isLoading = true;
      break;
    case MY_WATCH_LIST_PRODUCT_ADDED:
      draft.isLoading = false;
      break;
    case MY_WATCH_LIST_PRODUCT_ADD_FAILED:
      draft.isLoading = false;
      draft.failure = action.response;
      break;
    case MY_WATCH_LIST_PRODUCT_POPUP_CALCULATE_TOTAL_SUM: {
      draft.totalSumCalculationError = ADD_PRODUCT_POPUP_INITIAL_TOTAL_SUM_CALCULATION_ERROR;
      if (action.fieldName) {
        draft[action.fieldName] = action.value;
      }

      if (!draft.position || !draft.purchasePrice) {
        draft.totalSum = ADD_PRODUCT_POPUP_INITIAL_TOTAL_SUM;
      }

      const positionParsed = parseFloat(draft.position);
      const purchasePriceParsed = parseFloat(draft.purchasePrice);

      if (isCurrencyPercentage(draft.currency) && isNotionalValueDefined(draft.notionalValue)) {
        const notionalValueParsed = parseFloat(draft.notionalValue);
        draft.totalSum = calculateTotalSumForCurrencyPercentage(
          purchasePriceParsed,
          positionParsed,
          notionalValueParsed,
        );
      } else if (isPositionDefined(positionParsed)
          && isPurchasePriceDefined(purchasePriceParsed)
      ) {
        draft.totalSum = calculateTotalSumForNonPercentageCurrency(
          purchasePriceParsed,
          positionParsed,
        );
      }

      if (draft.totalSum === null) {
        draft.totalSumCalculationError = i18n.t('total_sum_calculation_failed');
      }
    }
      break;
    case MY_WATCH_LIST_ASK_PRICE_ERROR:
      draft.isLoading = false;
      draft.failure = action.error;
      break;
    case MY_WATCH_LIST_PRODUCT_POPUP_VALIDATE_INPUT_FIELD:
      if (action.fieldName && action.fieldValue) {
        switch (action.fieldName) {
          case INPUT_FIELD_NAME_POSITION:
            draft.invalidPositionError = isValidPositionValue(action.fieldValue) ? null : i18n.t('invalid_position_value');
            break;
          case INPUT_FIELD_NAME_PURCHASE_PRICE:
            draft.invalidPurchasePriceError = isValidPurchasePriceValue(action.fieldValue) ? null : i18n.t('invalid_purchase_price_value');
            break;
          default:
            break;
        }
      }
      break;
    default:
      break;
  }
});

export default watchListAddProductPopupReducer;
