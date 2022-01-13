import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'boundless-utils-uuid';
import { splitEvery, includes } from 'ramda';
import { Row } from 'reactstrap';
import Month from './Month';
import './YearMonthsSection.scss';
import { isDateInList } from '../../FilterMonthsPicker.helper';

const YearMonthsSection = ({
  year, months, monthsPerRow, selectedMonths,
  enabledMonths, onMonthSelected, monthsShortToNumericMap,
}) => {
  const getMonths = (allMonths) => allMonths.map(
    (month) => {
      const monthYearDate = `${year}-${monthsShortToNumericMap[month]}`;
      const isSelected = includes(monthYearDate, selectedMonths);
      const isEnabled = isDateInList(monthYearDate, enabledMonths);
      return (
        <Month
          key={month}
          month={month}
          monthYearDate={monthYearDate}
          isSelected={isSelected}
          isEnabled={isEnabled}
          onMonthSelected={onMonthSelected}
        />
      );
    },
  );
  const getChunkedMonths = splitEvery(monthsPerRow, getMonths(months));
  return (
    <div className="YearMonthsSection">
      <div className="YearSection">
        {year}
      </div>
      <div className="MonthsSection">
        <Row>
          {getChunkedMonths.map((chunkedMonths) => (
            <div key={uuid()} className="col-12 months-group">{chunkedMonths}</div>
          ))}
        </Row>
      </div>
    </div>
  );
};

YearMonthsSection.propTypes = {
  year: PropTypes.number,
  monthsPerRow: PropTypes.number,
  months: PropTypes.arrayOf(PropTypes.any),
  selectedMonths: PropTypes.arrayOf(PropTypes.any),
  enabledMonths: PropTypes.arrayOf(PropTypes.any),
  onMonthSelected: PropTypes.func,
  monthsShortToNumericMap: PropTypes.objectOf(PropTypes.any),
};

YearMonthsSection.defaultProps = {
  year: 0,
  monthsPerRow: 6,
  months: [],
  selectedMonths: [],
  enabledMonths: [],
  onMonthSelected: () => {},
  monthsShortToNumericMap: {},
};

export default React.memo(YearMonthsSection);
