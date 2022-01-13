import React, { useMemo } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './WeekDays.scss';
import ClickableItem from '../../ClickableItem';
import { generateWeekDays } from './WeekDays.helper';

const WeekDays = ({ className, startWeekFrom }) => {
  const days = useMemo(() => generateWeekDays(startWeekFrom), [startWeekFrom]);
  return (
    <div className={classNames('WeekDays', className)}>
      <div className="grid-calendar">
        <div className="row calendar-week-header">
          {days.map((day, k) => (
            <ClickableItem
              key={`${day + k}`}
              className="col-xs-1 grid-cell day"
              label={day ? day.substring(0, 1) : k}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

WeekDays.propTypes = {
  className: PropTypes.string,
  startWeekFrom: PropTypes.number,
};

WeekDays.defaultProps = {
  className: '',
  startWeekFrom: 1,
};

export default React.memo(WeekDays);
