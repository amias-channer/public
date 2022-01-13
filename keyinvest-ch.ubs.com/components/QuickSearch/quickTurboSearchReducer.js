import { produce } from 'immer';
import {
  QUICK_SEARCH_COMPONENT_DID_UNMOUNT,
  QUICK_SEARCH_GOT_RESULT_DATA,
  QUICK_SEARCH_ON_DROPDOWN_CHANGE,
  QUICK_SEARCH_SET_INITIAL_DATA,
  QUICK_SEARCH_UPDATE_PRODUCT_TYPE_URLS,
  QUICK_SEARCH_UPDATE_RESET_PRODUCT_TYPE_URLS,
} from './actions';
import Logger from '../../utils/logger';
import { searchAndReplaceTextInString } from '../../utils/utils';
import {
  calculateEndByAdjustmentFormula,
  calculateMaxRangeLeverageFromLowRange,
  calculateMinRangeLeverageFromLowRange,
  calculateStartByAdjustmentFormula,
  getSelectedUnderlyingSin,
  getUnderlyingAdjustmentBySin,
  isLeverageOfTypeRange,
  SEARCH_TEXT_END,
  SEARCH_TEXT_START,
} from './QuickSearch.helper';

const INITIAL_STATE = {};

const quickTurboSearchReducer = (state = INITIAL_STATE, action) => produce(state, (draft) => {
  switch (action.type) {
    case QUICK_SEARCH_SET_INITIAL_DATA:
      if (action.data && action.uniqId) {
        draft[action.uniqId] = { data: action.data };
      }
      break;
    case QUICK_SEARCH_ON_DROPDOWN_CHANGE:
      if (action.uniqId) {
        draft[action.uniqId].isLoading = true;
      }
      break;
    case QUICK_SEARCH_GOT_RESULT_DATA:
      if (
        action.data
        && action.data.data
        && action.uniqId
        && draft[action.uniqId]
        && draft[action.uniqId].data
        && draft[action.uniqId].data.underlying
      ) {
        draft[action.uniqId].data.underlying.selected = action.selectedItem;
        draft[action.uniqId].data.productTypes = action.data.data.productTypes;
        if (action.data.data.value) {
          if (typeof action.data.data.value === 'string') {
            try {
              draft[action.uniqId].data.value = JSON.parse(action.data.data.value);
            } catch (e) {
              Logger.warn('quickTurboSearchReducer', e);
            }
          } else {
            draft[action.uniqId].data.value = action.data.data.value;
          }
          draft[action.uniqId].data.value.sin = action.selectedItem.sin;
        }
        draft[action.uniqId].isLoading = false;
      }
      break;
    case QUICK_SEARCH_UPDATE_PRODUCT_TYPE_URLS:
      if (action.uniqId && action.name) {
        if (draft[action.uniqId]
            && draft[action.uniqId].data
            && draft[action.uniqId].data.productTypes) {
          try {
            draft[action.uniqId].data.productTypes.forEach((productType) => {
              if (productType.urlStrike) {
                const selectedUnderlyingSin = getSelectedUnderlyingSin(draft[action.uniqId].data);
                const underlyingAdjustment = getUnderlyingAdjustmentBySin(
                  selectedUnderlyingSin,
                  draft[action.uniqId].data,
                );
                const strikeUrlWithStart = searchAndReplaceTextInString(
                  SEARCH_TEXT_START,
                  calculateStartByAdjustmentFormula(action.value, underlyingAdjustment),
                  productType.urlStrike,
                  '',
                );
                const strikeUrlWithStartEnd = searchAndReplaceTextInString(
                  SEARCH_TEXT_END,
                  calculateEndByAdjustmentFormula(action.value, underlyingAdjustment),
                  strikeUrlWithStart,
                  '',
                );
                productType.strike = strikeUrlWithStartEnd;
              }

              if (productType.urlLeverage) {
                let startLeverageValue = action.value;
                let endLeverageValue = action.value;
                if (isLeverageOfTypeRange(productType)) {
                  startLeverageValue = calculateMinRangeLeverageFromLowRange(action.value);
                  endLeverageValue = calculateMaxRangeLeverageFromLowRange(action.value);
                }

                const leverageUrlWithStart = searchAndReplaceTextInString(
                  SEARCH_TEXT_START,
                  startLeverageValue,
                  productType.urlLeverage,
                );
                const leverageUrlWithStartEnd = searchAndReplaceTextInString(
                  SEARCH_TEXT_END,
                  endLeverageValue,
                  leverageUrlWithStart,
                );
                productType.leverage = leverageUrlWithStartEnd;
              }
            });
          } catch (e) {
            Logger.error(e);
          }
        }
      }
      break;
    case QUICK_SEARCH_UPDATE_RESET_PRODUCT_TYPE_URLS:
      if (action.uniqId) {
        if (draft[action.uniqId]
            && draft[action.uniqId].data
            && draft[action.uniqId].data.productTypes) {
          draft[action.uniqId].data.productTypes.forEach((productType) => {
            if (productType.urlStrike) {
              productType.strike = searchAndReplaceTextInString('%s', '', productType.urlStrike);
            }

            if (productType.urlLeverage) {
              productType.leverage = searchAndReplaceTextInString('%s', '', productType.urlLeverage);
            }
          });
        }
      }
      break;
    case QUICK_SEARCH_COMPONENT_DID_UNMOUNT:
      if (action.uniqId && draft[action.uniqId]) {
        delete draft[action.uniqId];
      }
      break;
    default:
      break;
  }
});
export default quickTurboSearchReducer;
