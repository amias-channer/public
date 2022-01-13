import {
  slice, last, head, includes,
} from 'ramda';
import Logger from '../../../../utils/logger';

export const getMonthShortName = (fullMonthName) => (fullMonthName && typeof (fullMonthName) === 'string' ? slice(0, 3, fullMonthName) : '');

export const isGivenYearGreaterThanCurrentYear = (
  givenYear,
) => {
  if (!givenYear) {
    return false;
  }
  return givenYear > new Date().getFullYear();
};

export const getLastXYearsList = (currentYear, numberOfLastYears) => {
  if (!currentYear || !numberOfLastYears) {
    Logger.error('getLastYears():: Invalid value provided for currentYear,numberOfLastYears; it should be an integer value');
    return [];
  }
  const startYear = (currentYear - numberOfLastYears) + 1;
  const years = [];

  // eslint-disable-next-line no-plusplus
  for (let x = 0; x < numberOfLastYears; x++) {
    const yearToAdd = startYear + x;
    if (isGivenYearGreaterThanCurrentYear(yearToAdd)) {
      return years;
    }
    years.push(startYear + x);
  }
  return years;
};

export const getAddedYears = (currentYear, numberOfYearsToAdd) => {
  if (!currentYear || !numberOfYearsToAdd) {
    Logger.error('getLastYears():: Invalid value provided for currentYear,numberOfLastYears; it should be an integer value');
    return currentYear || 0;
  }
  return currentYear + numberOfYearsToAdd - 1;
};

export const getLastYearInList = (yearsList) => (yearsList ? last(yearsList) : 0);
export const getFirstYearInList = (yearsList) => (yearsList ? head(yearsList) : 0);

export const getYearsRange = (yearsList) => `${getFirstYearInList(yearsList)} - ${getLastYearInList(yearsList)}`;

export const shouldDisplayNavRightArrow = (yearsList) => {
  if (!yearsList) {
    Logger.error('shouldDisplayNavRightArrow():: Invalid value provided for yearsList parameter, it should be an array');
    return true;
  }
  const currentYear = new Date().getFullYear();
  return !includes(currentYear, yearsList);
};
