import { pathOr } from 'ramda';


export const getTitle = (data) => pathOr('', ['title'])(data);
export const getDisclaimerMessage = (data) => pathOr('', ['disclaimer', 'message'])(data);
export const getDisclaimerAcceptanceText = (data) => pathOr('', ['disclaimer', 'acceptanceText'])(data);
export const getInstrumentData = (data) => pathOr({}, ['instrumentData'])(data);
export const getNoInstrumentFoundMessage = (data) => pathOr('', ['noResultsText'])(data);
export const getColumnsToRender = (data) => pathOr([], ['columnsToRender'])(data);
