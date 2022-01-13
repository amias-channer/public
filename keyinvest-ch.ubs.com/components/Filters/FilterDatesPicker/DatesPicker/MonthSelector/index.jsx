import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import {
  getChunkedMonths,
  getMonthIndex,
  isMonthInDates,
} from './MonthSelector.helper';
import ClickableItem from '../ClickableItem';
import './MonthSelector.scss';
import { getMoment } from '../../../Filters.helper';

const MonthSelector = ({
  active, onSelect, className, year, activeDates, enabledDates, disabledDates,
}) => {
  const chunkedMonths = getChunkedMonths();
  return (
    <div className={classNames('MonthSelector', className)}>
      <div className="grid-calendar">
        {chunkedMonths.map((chunk, indexInRow) => (
          <div key={pathOr(indexInRow, [0], chunk)} className="row calendar-week-header">
            {chunk.map((month, indexInChunk) => (
              <ClickableItem
                key={month || indexInChunk}
                className="col-xs-1 grid-cell month"
                onClick={onSelect}
                value={getMonthIndex(indexInRow, indexInChunk)}
                label={month ? month.substring(0, 3) : ''}
                isDisabled={isMonthInDates(
                  year,
                  getMonthIndex(indexInRow, indexInChunk),
                  disabledDates,
                ) || !isMonthInDates(
                  year,
                  getMonthIndex(indexInRow, indexInChunk),
                  enabledDates,
                )}
                isActive={active === getMonthIndex(indexInRow, indexInChunk)
                  || isMonthInDates(
                    year,
                    getMonthIndex(indexInRow, indexInChunk),
                    activeDates,
                  )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

MonthSelector.propTypes = {
  active: PropTypes.number,
  year: PropTypes.number,
  className: PropTypes.string,
  onSelect: PropTypes.func,
  activeDates: PropTypes.arrayOf(PropTypes.any),
  enabledDates: PropTypes.arrayOf(PropTypes.any),
  disabledDates: PropTypes.arrayOf(PropTypes.any),
};

MonthSelector.defaultProps = {
  active: getMoment().month(),
  year: getMoment().year(),
  className: '',
  onSelect: () => {},
  activeDates: [],
  enabledDates: [],
  disabledDates: [],
};

export default React.memo(MonthSelector);
