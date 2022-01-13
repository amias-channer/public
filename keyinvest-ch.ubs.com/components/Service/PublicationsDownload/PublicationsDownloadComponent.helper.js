import { stringify } from 'query-string';
import { pathOr } from 'ramda';

export const preparePostData = (data, tokens) => {
  const formData = {};
  if (tokens && tokens.tokenName && tokens.tokenValue) {
    formData[tokens.tokenName] = tokens.tokenValue;
  }

  if (data && data.selectedPublicationsCheckboxes) {
    formData.orderPublications = Object.keys(data.selectedPublicationsCheckboxes);
  }

  Object.keys(data.publicationsForm).forEach((input) => {
    formData[input] = data.publicationsForm[input].value;
  });
  return stringify(formData, { arrayFormat: 'comma', encode: false });
};


export const getSalutationValue = (data) => pathOr('', ['salutation', 'value'])(data);
export const getUserTypeValue = (data) => pathOr('', ['iAm', 'value'])(data);
export const getCountryValue = (data) => pathOr('', ['country', 'value'])(data);
export const getIsValidated = (input) => (data) => pathOr(true, [input, 'isValidated'])(data);
