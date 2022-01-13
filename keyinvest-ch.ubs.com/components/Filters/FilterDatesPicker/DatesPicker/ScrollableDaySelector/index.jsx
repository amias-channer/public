import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { times } from 'ramda';
import Scrollbars from 'react-custom-scrollbars';
import DaySelector from '../DaySelector';
import WeekDays from '../DaySelector/WeekDays';
import { START_WEEK_FROM } from '../DaySelector/DaySelector.helper';
import { getMoment } from '../../../Filters.helper';

const ScrollableDaySelector = ({
  activeDates, onSelect, className, year, month, disabledDates, enabledDates, numberOfVisibleMonths,
}) => {
  const generatedDaySelectors = times((m) => {
    const date = getMoment({ year, month }).add(m, 'month');
    return (
      <DaySelector
        key={`${date.year()}${date.month()}`}
        onSelect={onSelect}
        year={date.year()}
        month={date.month()}
        activeDates={activeDates}
        enabledDates={enabledDates}
        disabledDates={disabledDates}
      />
    );
  }, numberOfVisibleMonths);
  return (
    <div className={classNames('ScrollableDaySelector', className)}>
      <WeekDays startWeekFrom={START_WEEK_FROM} />
      <Scrollbars
        autoHeight
        autoHeightMin={190}
        autoHeightMax={248}
      >
        <div className="pr-1">
          {generatedDaySelectors}
        </div>
      </Scrollbars>
    </div>
  );
};

ScrollableDaySelector.propTypes = {
  activeDates: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  onSelect: PropTypes.func,
  year: PropTypes.number,
  month: PropTypes.number,
  enabledDates: PropTypes.arrayOf(PropTypes.any),
  disabledDates: PropTypes.arrayOf(PropTypes.any),
  numberOfVisibleMonths: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

ScrollableDaySelector.defaultProps = {
  activeDates: [],
  year: getMoment().year(),
  month: getMoment().month(),
  className: '',
  onSelect: () => {},
  enabledDates: null,
  disabledDates: null,
  numberOfVisibleMonths: 1,
};

export default React.memo(ScrollableDaySelector);
