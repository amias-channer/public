import { pathOrString } from '../../../../utils/typeChecker';

export const getSaveSignalUrl = (data) => pathOrString('', ['saveSignalUrl'], data);
export const getUnderlyingName = (data) => pathOrString('', ['underlyingName'], data);
export const getPatternTypeName = (data) => pathOrString('', ['patternTypeName'], data);

export const getResponseMessage = (response) => pathOrString('', ['message'], response);
