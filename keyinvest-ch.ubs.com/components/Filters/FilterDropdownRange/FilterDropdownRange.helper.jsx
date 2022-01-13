import { filter } from 'ramda';

const VALUE_SPLIT_SEPARATOR = '-';
const PARSE_INT_RADIX_VAL = 10;
const VALUE_GREATER_THAN = 'gt';
const VALUE_LESSER_THAN = 'lt';
const VALUE_GREATER_THAN_EQUAL = 'gte';
const VALUE_LESSER_THAN_EQUAL = 'lte';

const parseRangeValue = (value) => value.split(VALUE_SPLIT_SEPARATOR);
const isSingleRangeValue = (value) => value && value.length === 1;
const splitAlphabetsAndNumbersInString = (string) => string.match(/[a-zA-z]+|\d+/g) || [];
const shouldFilterOutSingleRangeValue = (userInputValue, listItemValue) => {
  const [alphabeticPart, numericPart] = splitAlphabetsAndNumbersInString(listItemValue);
  const parsedNumericPart = parseInt(numericPart, PARSE_INT_RADIX_VAL);

  switch (alphabeticPart) {
    case VALUE_GREATER_THAN:
      return (userInputValue > parsedNumericPart);
    case VALUE_LESSER_THAN:
      return (userInputValue < parsedNumericPart);
    case VALUE_GREATER_THAN_EQUAL:
      return (userInputValue >= parsedNumericPart);
    case VALUE_LESSER_THAN_EQUAL:
      return (userInputValue <= parsedNumericPart);
    default:
      return false;
  }
};
const filterByValue = (userInputValue) => (listItem) => {
  const parsedRangeValue = parseRangeValue(listItem.value);
  if (isSingleRangeValue(parsedRangeValue)) {
    return shouldFilterOutSingleRangeValue(userInputValue, listItem.value);
  }

  const [startValue, endValue] = parsedRangeValue;
  return (
    userInputValue >= parseInt(startValue, PARSE_INT_RADIX_VAL)
    && userInputValue < parseInt(endValue, PARSE_INT_RADIX_VAL));
};
// eslint-disable-next-line import/prefer-default-export
export const filterListByInputValue = (value, list) => filter(filterByValue(value), list);
