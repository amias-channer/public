import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './DatesPicker.scss';
import YearSelector from './YearSelector';
import MonthSelector from './MonthSelector';
import ScrollableDaySelector from './ScrollableDaySelector';
import { momentFromTimestamp, getMoment } from '../../Filters.helper';
import { getInitialFocusDate } from './DatesPicker.helper';

const DatesPicker = ({
  className, activeDates, toggleDate, enabledDates, disabledDates, minDate, maxDate,
}) => {
  const initialFocusDate = getInitialFocusDate(activeDates, enabledDates);
  const [activeYear, setActiveYear] = useState(initialFocusDate.year());
  const [activeMonth, setActiveMonth] = useState(initialFocusDate.month());

  return (
    <div className={classNames('DatesPicker', className)}>
      <YearSelector
        onSelect={setActiveYear}
        active={activeYear}
        min={minDate && momentFromTimestamp(minDate).year()}
        max={maxDate && momentFromTimestamp(maxDate).year()}
        activeDates={activeDates}
        enabledDates={enabledDates}
        disabledDates={disabledDates}
      />
      <div className="separator" />
      <MonthSelector
        onSelect={setActiveMonth}
        active={activeMonth}
        year={activeYear}
        activeDates={activeDates}
        enabledDates={enabledDates}
        disabledDates={disabledDates}
      />
      <div className="separator" />
      <ScrollableDaySelector
        onSelect={toggleDate}
        year={activeYear}
        month={activeMonth}
        activeDates={activeDates}
        enabledDates={enabledDates}
        disabledDates={disabledDates}
        numberOfVisibleMonths="1"
      />
    </div>
  );
};
DatesPicker.propTypes = {
  className: PropTypes.string,
  toggleDate: PropTypes.func.isRequired,
  activeDates: PropTypes.arrayOf(PropTypes.any),
  enabledDates: PropTypes.arrayOf(PropTypes.any),
  disabledDates: PropTypes.arrayOf(PropTypes.any),
  minDate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  maxDate: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};
DatesPicker.defaultProps = {
  className: '',
  activeDates: [],
  enabledDates: null,
  disabledDates: null,
  minDate: getMoment().unix(),
  maxDate: null,
};

export default React.memo(DatesPicker);
