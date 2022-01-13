import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import {
  generateDatesAsRows, getMonthYearTile,
} from './DaySelector.helper';
import WeekRow from './WeekRow';
import { getMoment } from '../../../Filters.helper';

const DaySelector = ({
  activeDates, onSelect, className, year, month, disabledDates, enabledDates,
}) => {
  const datesAsRows = generateDatesAsRows(year, month);

  return (
    <div className={classNames('DaySelector', className)}>
      <div className="title">
        <div className="text-center">
          {getMonthYearTile(year, month)}
        </div>
        <div className="separator" />
      </div>
      <div className="grid-calendar">
        {datesAsRows.map((days, k) => (
          <WeekRow
            key={pathOr(k, [days.length - 1], days)}
            days={days}
            className="row calendar-week"
            activeDates={activeDates}
            onSelect={onSelect}
            disabledDates={disabledDates}
            enabledDates={enabledDates}
          />
        ))}
      </div>
    </div>
  );
};

DaySelector.propTypes = {
  activeDates: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  onSelect: PropTypes.func,
  year: PropTypes.number,
  month: PropTypes.number,
  enabledDates: PropTypes.arrayOf(PropTypes.any),
  disabledDates: PropTypes.arrayOf(PropTypes.any),
};

DaySelector.defaultProps = {
  activeDates: [],
  year: getMoment().year(),
  month: getMoment().month(),
  className: '',
  onSelect: () => {},
  enabledDates: null,
  disabledDates: null,
};

export default React.memo(DaySelector);
