import { pathOr } from 'ramda';
import moment from 'moment';
import Logger from '../../utils/logger';
import { pathOrNumber } from '../../utils/typeChecker';

export const getUserProfileData = (data) => pathOr({}, ['userProfile'], data);
export const getUserLanguage = (data) => pathOr('', ['language'], data);
export const getUserSalutation = (data) => pathOr('', ['salutation'], data);
export const getUserFirstName = (data) => pathOr('', ['firstName'], data);
export const getUserLastName = (data) => pathOr('', ['lastName'], data);
export const getUserEmail = (data) => pathOr('', ['email'], data);
export const getUserBirthDate = (data) => {
  try {
    const birthDateTimestamp = parseInt(pathOrNumber(0, ['birthDate'], data), 10);
    return moment.unix(birthDateTimestamp);
  } catch (e) {
    Logger.error("Error getting user's date of birth", e);
    return '';
  }
};
export const getOldPassword = (data) => pathOr('', ['oldPassword'], data);
export const getNewPassword = (data) => pathOr('', ['newPassword'], data);
export const getConfirmedNewPassword = (data) => pathOr('', ['confirmNewPassword'], data);
