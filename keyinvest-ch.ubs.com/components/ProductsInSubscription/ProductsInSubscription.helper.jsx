import {
  path, pathOr, head, has, keys, sort,
} from 'ramda';
import i18n from '../../utils/i18n';

export const PRODUCT_IN_SUBSCRIPTION_COMP_TRACKING_NAME = 'Products In Subscription Table';

const SORT_BY_GROUP_TEXT = 'brc';

const shouldNotSwapGroupsForSorting = (
  groupA,
  groupB,
  sortBy,
) => (String(groupA).toLowerCase().indexOf(sortBy) > -1
  && String(groupB).toLowerCase().indexOf(sortBy) > -1);

const groupNameContainsSortByText = (
  groupName,
  sortByText,
) => String(groupName).toLowerCase().indexOf(sortByText) > -1;

// Comparison sort in pairs
// Negative value = should swap order
// Positive value = should not swap order
// Zero value     = should not swap order
const sortGroupsBy = (sortBy) => (groupA, groupB) => {
  if (!sortBy) {
    return 0;
  }

  if (shouldNotSwapGroupsForSorting(groupA, groupB, sortBy)) {
    return 0;
  }
  if (groupNameContainsSortByText(groupA, sortBy)) {
    return -1;
  }
  if (groupNameContainsSortByText(groupB, sortBy)) {
    return 1;
  }
  return 0;
};

export const sortGroupTabs = (
  groups,
  sortBy,
) => {
  try {
    return sort(sortGroupsBy(String(sortBy).toLowerCase()), groups);
  } catch (e) {
    return groups;
  }
};

export const getGroupTabs = (data) => sortGroupTabs(keys(pathOr({}, ['rows'], data)), SORT_BY_GROUP_TEXT);
const getFirstTabItem = (data) => head(data);
export const getData = (data) => pathOr({}, ['rows'])(data);
export const getSelectedGroup = (data) => {
  const selectedGroup = path(['selectedGroup'])(data);
  return selectedGroup || getFirstTabItem(getGroupTabs(data));
};
export const getDataForProductGroup = (data, productGroup) => pathOr({ rows: [] }, ['rows', productGroup])(data);
export const getColumnsTranslations = (data, productGroup) => pathOr({}, ['rows', productGroup, 'columnsToRenderTranslatedLabels'])(data);
export const getProductListUrlForGroup = (data, group) => path([group, 'productListUrl', 'value'], data);
export const getProductName = (productData) => pathOr('', ['nameInSubscription', 'value'], productData);
export const getProductUnderlying = (productData) => pathOr('', ['underlying', 'value'], productData);
export const getProductRowTitle = (productRow) => {
  const underlying = getProductUnderlying(productRow);
  if (underlying) {
    return underlying.replace(/<br \/>/g, ' / ');
  }
  return getProductName(productRow);
};

export const getIsinForProduct = (productData) => pathOr('', ['isin', 'value'], productData);

export const getProductAnalyticsText = (product) => {
  const underlying = getProductUnderlying(product).replace(/<br \/>/g, ' / ');
  const productName = getProductName(product);

  if (underlying && productName) {
    return `${i18n.t('underlying')}:${underlying} | ${i18n.t('name')}:${productName}`;
  }

  if (underlying) {
    return `${i18n.t('underlying')}:${underlying}`;
  }

  if (productName) {
    return `${i18n.t('name')}:${productName}`;
  }

  return '';
};

export const hasDataForGroup = (groupName, data) => has(groupName, data);
