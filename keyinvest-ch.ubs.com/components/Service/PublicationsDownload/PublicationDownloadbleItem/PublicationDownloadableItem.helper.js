import { pathOr } from 'ramda';

export const getPublicationName = (data) => pathOr('', ['name'])(data);
export const getPublicationThumbnail = (data) => pathOr('', ['thumbnail'])(data);
export const getPublicationType = (data) => pathOr('', ['type'])(data);
export const getPublicationUrl = (data) => pathOr('', ['url'])(data);
export const getIsPublicationOrderable = (data) => pathOr('', ['orderable'])(data);
