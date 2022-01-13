import { pathOr } from 'ramda';

// eslint-disable-next-line import/prefer-default-export
export const getConcatenationValue = (groupItem) => pathOr(false, ['concatenationValue'], groupItem);
