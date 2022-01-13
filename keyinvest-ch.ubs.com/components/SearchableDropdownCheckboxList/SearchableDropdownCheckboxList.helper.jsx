import { pathOrObject } from '../../utils/typeChecker';

// eslint-disable-next-line import/prefer-default-export
export const getListData = (data) => pathOrObject({}, ['fieldValue'], data);
