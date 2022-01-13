import {
  compose, filter, pluck, prop, sortBy, toLower, values,
} from 'ramda';

const filterByLetterMatch = (
  letter,
) => (item) => item.label[0].toLowerCase() === letter.toLowerCase();

export const getFilteredListForLetter = (
  letter,
  listToFilter,
) => filter(filterByLetterMatch(letter), listToFilter);

const filterByNumbersMatch = (numbers) => (
  item,
) => numbers.indexOf(item.label[0].toLowerCase()) > -1;

export const getFilteredListForNumbers = (
  numbers,
  listToFilter,
) => filter(filterByNumbersMatch(numbers), listToFilter);

const filterByFavoriteMatch = (item) => item.isFavourite;

export const getFilteredListForFavorite = (
  listToFilter,
) => filter(filterByFavoriteMatch, listToFilter);

export const getSortedList = (listItems, sortByPropName) => {
  const favoriteListArray = values(listItems);
  const sortByLabelCaseInsensitive = sortBy(compose(toLower, prop(sortByPropName)));
  return sortByLabelCaseInsensitive(favoriteListArray);
};

export const extractIdentifiersArray = (list, extractByPropName) => pluck(extractByPropName)(list);
