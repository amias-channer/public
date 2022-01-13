import React from 'react';
import PropTypes from 'prop-types';
import Month from './Month';

const MonthPickerView = ({ months, onMonthSelected }) => {
  const getMonths = () => months.map((monthName, monthNumber) => (
    <li key={monthName}>
      <Month
        month={monthName}
        monthNumber={monthNumber}
        onMonthClick={onMonthSelected}
      />
    </li>
  ));
  return (
    <div className="MonthPickerView">
      <div className="view-opened">
        <ul>
          {getMonths()}
        </ul>
      </div>
    </div>
  );
};

MonthPickerView.propTypes = {
  months: PropTypes.arrayOf(PropTypes.any),
  onMonthSelected: PropTypes.func,
};

MonthPickerView.defaultProps = {
  months: [],
  onMonthSelected: () => {},
};

export default React.memo(MonthPickerView);
