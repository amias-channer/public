import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ClickableItem from '../../ClickableItem';
import {
  getCellDate,
  getCellDateLabel,
  isCellDateActive,
  isDateDisabled,
} from './DayCell.helper';

const DayCell = ({
  activeDates, onSelect, className, day, disabledDates, enabledDates,
}) => {
  const date = useMemo(() => getCellDate(day), [day]);
  const isDisabled = useMemo(
    () => isDateDisabled(date, disabledDates, enabledDates),
    [date, disabledDates, enabledDates],
  );
  const isActive = isCellDateActive(date, activeDates);
  const label = useMemo(() => (getCellDateLabel(date)), [date]);
  return (
    <div className={classNames('DayCell', className)}>
      {date && (
        <ClickableItem
          className="day"
          onClick={onSelect}
          value={date.unix()}
          label={label}
          isActive={isActive}
          isDisabled={isDisabled}
        />
      )}
      {!date && (
        <ClickableItem className="day" />
      )}
    </div>
  );
};

DayCell.propTypes = {
  activeDates: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  onSelect: PropTypes.func,
  day: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  enabledDates: PropTypes.arrayOf(PropTypes.any),
  disabledDates: PropTypes.arrayOf(PropTypes.any),
};

DayCell.defaultProps = {
  activeDates: [],
  day: null,
  className: '',
  onSelect: () => {},
  enabledDates: null,
  disabledDates: null,
};

export default React.memo(DayCell);
