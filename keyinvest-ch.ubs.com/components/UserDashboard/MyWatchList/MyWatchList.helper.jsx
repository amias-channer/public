import { path } from 'ramda';
import { getAppLocale, getAppSiteVariant } from '../../../utils/utils';

export const MY_WATCHLIST_API_GET_PRODUCTS_ENDPOINT = 'user/my-watchlist';
export const MY_WATCHLIST_API_ADD_PRODUCT_ENDPOINT = 'user/my-watchlist/add';
export const MY_WATCHLIST_API_GET_PRODUCT_ASK_PRICE_ENDPOINT = 'product/price/ask/:isin';

export const MY_WATCHLIST_PRODUCT_SEARCH_URL = `/autocomplete.php?format=json&locale=${getAppLocale()}&siteVariant=${getAppSiteVariant()}&showProductsOnly=true`;

export const MY_WATCHLIST_PRODUCT_TYPE_SORT_KEY = 'productType';
export const MY_WATCHLIST_MATURITY_DATE_SORT_KEY = 'maturityDate';
export const MY_WATCHLIST_TOTAL_SORT_KEY = 'totalValue';
export const MY_WATCHLIST_RETURN_SORT_KEY = 'profit';

export const MY_WATCHLIST_SORT_DIRECTION_ASCENDING = 'asc';
export const MY_WATCHLIST_SORT_DIRECTION_DESCENDING = 'desc';

export const getProductTilesList = (data) => path(['watchlist'], data);

export const shouldGetTilesWithoutGroups = (data) => Array.isArray(data);

export const getEndPointToFetchSortedList = (url, sortBy, sortDirection) => {
  if (sortBy && sortDirection) {
    return `${url}?sort={"${sortBy}":"${sortDirection}"}`;
  }
  return url;
};

export const isSortDirectionAscending = (
  sortDirection,
) => sortDirection === MY_WATCHLIST_SORT_DIRECTION_ASCENDING;

export const isSortDirectionDescending = (
  sortDirection,
) => sortDirection === MY_WATCHLIST_SORT_DIRECTION_DESCENDING;

export const getSortDirection = (currentSortDirection) => {
  if (!currentSortDirection) {
    return MY_WATCHLIST_SORT_DIRECTION_ASCENDING;
  }

  if (isSortDirectionAscending(currentSortDirection)) {
    return MY_WATCHLIST_SORT_DIRECTION_DESCENDING;
  }

  return MY_WATCHLIST_SORT_DIRECTION_ASCENDING;
};
