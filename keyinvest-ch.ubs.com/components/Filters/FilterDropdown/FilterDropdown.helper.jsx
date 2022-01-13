import { filter, pathOr } from 'ramda';

const labelContainsText = (text) => (item) => {
  const label = pathOr('', ['label'], item);
  return String(label).toLowerCase().indexOf(String(text).toLowerCase()) > -1;
};
// eslint-disable-next-line import/prefer-default-export
export const filterListByInputText = (text, list) => filter(labelContainsText(text), list);
