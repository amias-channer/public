import { pathOr } from 'ramda';

export const MY_SEARCHES_API_GET_URL = '/user/my-searches';
export const MY_SEARCHES_API_ADD_URL = '/user/my-searches/add';
export const getSaveSearchEndpointFromFiltersData = (filtersData) => pathOr(MY_SEARCHES_API_ADD_URL, ['saveSearchUrl'], filtersData);
export const getCurrentPageQueryString = () => window.location.search;
