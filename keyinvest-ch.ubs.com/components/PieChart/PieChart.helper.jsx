import { pathOrString } from '../../utils/typeChecker';

// eslint-disable-next-line import/prefer-default-export
export const getLastUpdateDate = (data) => pathOrString('', ['constituents', 'update', 'value'], data);

export const getHeaderName = (data) => pathOrString('', ['constituents', 'components', 'headers', 'name', 'value'], data);
export const getHeaderWeight = (data) => pathOrString('', ['constituents', 'components', 'headers', 'weight', 'value'], data);
