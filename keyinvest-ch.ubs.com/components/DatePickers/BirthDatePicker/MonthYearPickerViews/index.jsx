import React from 'react';
import PropTypes from 'prop-types';
import './MonthYearPickerViews.scss';
import moment from 'moment';
import MonthPickerView from './MonthPickerView';
import YearPickerView from './YearPickerView';

const MonthYearPickerViews = ({
  month,
  onMonthSelect,
  onYearSelect,
  isMonthViewOpen,
  isYearViewOpen,
  setIsOpenMonthView,
  setIsOpenYearView,
}) => {
  const openMonthView = () => {
    setIsOpenMonthView(true);
  };

  const openYearView = () => {
    setIsOpenYearView(true);
    setIsOpenMonthView(false);
  };

  const onMonthSelected = (clickedMonth, clickedMonthNumber) => {
    onMonthSelect(month, clickedMonthNumber);
    setIsOpenMonthView(false);
  };

  const onYearSelected = (clickedYear, shouldKeepYearViewOpened = false) => {
    onYearSelect(month, clickedYear);
    setIsOpenMonthView(false);
    setIsOpenYearView(shouldKeepYearViewOpened);
  };

  const months = moment.months();
  return (
    <div className="MonthYearPickerViews">
      {!isMonthViewOpen && !isYearViewOpen && (<span className="date-value" role="presentation" onClick={openMonthView}>{`${months[month.month()]} ${month.year()}`}</span>)}
      {isMonthViewOpen && (<span className="date-value" role="presentation" onClick={openYearView}>{month.year()}</span>)}
      {isMonthViewOpen && (<MonthPickerView onMonthSelected={onMonthSelected} months={months} />)}
      {isYearViewOpen && (
        <YearPickerView
          month={month}
          onYearSelected={onYearSelected}
          numOfYearsEachView={24}
        />
      )}
    </div>
  );
};

MonthYearPickerViews.propTypes = {
  month: PropTypes.objectOf(PropTypes.any),
  onMonthSelect: PropTypes.func,
  onYearSelect: PropTypes.func,
  setIsOpenMonthView: PropTypes.func,
  setIsOpenYearView: PropTypes.func,
  isMonthViewOpen: PropTypes.bool,
  isYearViewOpen: PropTypes.bool,
};

MonthYearPickerViews.defaultProps = {
  month: {
    month: () => {},
    year: () => 1234,
  },
  onMonthSelect: () => {},
  onYearSelect: () => {},
  setIsOpenMonthView: () => {},
  setIsOpenYearView: () => {},
  isMonthViewOpen: false,
  isYearViewOpen: false,
};

export default React.memo(MonthYearPickerViews);
