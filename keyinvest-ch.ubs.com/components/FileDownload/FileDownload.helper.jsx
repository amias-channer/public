import { pathOr } from 'ramda';

export const getTitle = (data) => pathOr('', ['fileData', 'title'])(data);
export const getHref = (data) => pathOr('', ['fileData', 'href'])(data);
