import { pathOr } from 'ramda';

export const EMPTY_LIST = {};
export const getListItems = (data) => pathOr(EMPTY_LIST, ['list'], data);
export const getParentItemData = (data) => ({
  label: pathOr('', ['label'], data),
  value: pathOr('', ['label'], data),
  selected: false,
});

export const getSelectedListItems = (itemsList) => {
  const selectedItems = [];
  Object.keys(itemsList).forEach((itemKey) => {
    if (itemsList[itemKey].selected) {
      selectedItems.push(itemKey);
    }
  });
  return selectedItems;
};
