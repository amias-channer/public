import React from 'react';
import PropTypes from 'prop-types';
import {
  getFirstYearInList,
  getLastXYearsList,
  getLastYearInList,
  getAddedYears,
  getYearsRange,
  shouldDisplayNavRightArrow,
} from '../MonthYearPickerViews.helper';
import Year from './Year';

const YearPickerView = ({ month, onYearSelected, numOfYearsEachView }) => {
  const yearsList = getLastXYearsList(month.year(), numOfYearsEachView);

  const onYearNavArrowLeftClick = () => {
    onYearSelected(getFirstYearInList(yearsList), true);
  };

  const onYearNavArrowRightClick = () => {
    onYearSelected(getAddedYears(getLastYearInList(yearsList), numOfYearsEachView), true);
  };

  const getYears = () => yearsList.map((year) => (
    <li key={year}>
      <Year
        year={year}
        onYearClick={onYearSelected}
      />
    </li>
  ));

  return (
    <div className="YearPickerView">
      <div className="arrows-navigation">
        <span role="presentation" className="arrow-left" onClick={onYearNavArrowLeftClick}>
          <svg
            className="DayPickerNavigation_svg__horizontal DayPickerNavigation_svg__horizontal_1"
            focusable="false"
            viewBox="0 0 1000 1000"
          >
            <path
              d="M336 275L126 485h806c13 0 23 10 23 23s-10 23-23 23H126l210 210c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7L55 524c-11-11-11-21 0-32l249-249c21-22 53 10 32 32z"
            />
          </svg>
        </span>
        <span>{getYearsRange(yearsList)}</span>
        {shouldDisplayNavRightArrow(yearsList) && (
        <span
          className="arrow-right"
          onClick={onYearNavArrowRightClick}
          role="presentation"
        >
          <svg
            className="DayPickerNavigation_svg__horizontal DayPickerNavigation_svg__horizontal_1"
            focusable="false"
            viewBox="0 0 1000 1000"
          >
            <path
              d="M694 242l249 250c12 11 12 21 1 32L694 773c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210-210H68c-13 0-23-10-23-23s10-23 23-23h806L662 275c-21-22 11-54 32-33z"
            />
          </svg>
        </span>
        )}
      </div>
      <div className="view-opened year-view">
        <ul>
          {getYears()}
        </ul>
      </div>
    </div>
  );
};

YearPickerView.propTypes = {
  month: PropTypes.objectOf(PropTypes.any),
  onYearSelected: PropTypes.func,
  numOfYearsEachView: PropTypes.number,
};

YearPickerView.defaultProps = {
  month: {
    year: () => new Date().getFullYear(),
  },
  onYearSelected: () => {},
  numOfYearsEachView: 10,
};

export default React.memo(YearPickerView);
