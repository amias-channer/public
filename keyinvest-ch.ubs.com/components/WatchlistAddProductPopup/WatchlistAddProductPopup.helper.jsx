import Logger from '../../utils/logger';

export const INPUT_FIELD_NAME_POSITION = 'position';
export const INPUT_FIELD_NAME_PURCHASE_PRICE = 'purchasePrice';

export const isValidPositionValue = (value) => {
  if (!value) {
    return false;
  }
  return (value % 1 === 0);
};

export const isValidPurchasePriceValue = (value) => !(!value || Number.isNaN(Number(value)));
export const isCurrencyPercentage = (currency) => (currency && currency === '%');
export const isNotionalValueDefined = (notionalValue) => !!notionalValue;
export const isPositionDefined = (position) => !!position;
export const isPurchasePriceDefined = (purchasePrice) => !!purchasePrice;
export const calculateTotalSumForCurrencyPercentage = (purchasePrice, position, notionalValue) => {
  let totalSum = null;
  try {
    totalSum = (purchasePrice / 100) * notionalValue * position;
  } catch (e) {
    Logger.error('Error in WatchlistAddProductPopup.helper::calculateTotalSumForCurrencyPercentage()', e);
    return totalSum;
  }
  return Number.isNaN(totalSum) ? null : totalSum;
};

export const calculateTotalSumForNonPercentageCurrency = (purchasePrice, position) => {
  let totalSum = null;
  try {
    totalSum = position * purchasePrice;
  } catch (e) {
    Logger.error('Error in WatchlistAddProductPopup.helper::calculateTotalSumForNonPercentageCurrency()', e);
    return totalSum;
  }
  return Number.isNaN(totalSum) ? null : totalSum;
};
