import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DayCell from '../DayCell';

const WeekRow = ({
  activeDates, onSelect, className, days, disabledDates, enabledDates,
}) => (
  <div className={classNames('WeekRow', className)}>
    {days.map((day, k) => (
      <DayCell
        key={day || k + 1}
        day={day}
        className="col-xs-1 grid-cell"
        activeDates={activeDates}
        onSelect={onSelect}
        disabledDates={disabledDates}
        enabledDates={enabledDates}
      />
    ))}
  </div>
);

WeekRow.propTypes = {
  activeDates: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  onSelect: PropTypes.func,
  days: PropTypes.arrayOf(PropTypes.any),
  enabledDates: PropTypes.arrayOf(PropTypes.any),
  disabledDates: PropTypes.arrayOf(PropTypes.any),
};

WeekRow.defaultProps = {
  activeDates: [],
  days: [],
  className: '',
  onSelect: () => {},
  enabledDates: null,
  disabledDates: null,
};

export default React.memo(WeekRow);
