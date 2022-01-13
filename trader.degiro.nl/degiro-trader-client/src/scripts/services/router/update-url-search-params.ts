import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import {History, Location} from 'history';

export interface UrlUpdateParams {
    [key: string]: any;
}

export interface UrlUpdateOptions {
    replace?: boolean;
    params?: UrlUpdateParams;
}

export default function updateUrlSearchParams(history: History, {params = {}, replace}: UrlUpdateOptions): Location {
    const newLocation: Location = {...history.location};
    const queryParams: Record<string, any> = replace
        ? params
        : {...parseUrlSearchParams(newLocation.search), ...params};
    const queryString: string = getQueryString(queryParams);

    newLocation.search = queryString ? `?${queryString}` : '';
    history.replace(newLocation);

    return {...newLocation};
}
