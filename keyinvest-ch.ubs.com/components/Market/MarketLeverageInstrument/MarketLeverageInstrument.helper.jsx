import { drop, head, pathOr } from 'ramda';

export const getFieldLabel = pathOr('', ['label']);
export const getAllColumns = (data) => drop(1, pathOr([null], ['columns'])(data));
export const getSplittedColumns = (data) => {
  const columns = getAllColumns(data);
  return {
    fieldsPart1: [head(columns)],
    fieldsPart2: drop(1, columns),
  };
};
export const getPriceColumns = pathOr([], ['priceColumns']);
export const getInfoColumns = pathOr([], ['infoColumns']);
export const getIsin = pathOr('', ['isin']);

export const getLastUpdateField = (data) => {
  const filteredFields = getInfoColumns(data).filter((field) => field.renderAs === 'pushable-timestamp');
  if (filteredFields && filteredFields.length > 0) {
    const [firstItem] = filteredFields;
    return firstItem;
  }
  return null;
};

export const getFilteredInfoColumns = (data) => getInfoColumns(data).filter((field) => field.renderAs !== 'pushable-timestamp');
