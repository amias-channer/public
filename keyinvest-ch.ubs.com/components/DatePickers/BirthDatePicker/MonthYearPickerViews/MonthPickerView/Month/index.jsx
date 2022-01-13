import React from 'react';
import PropTypes from 'prop-types';
import { getMonthShortName } from '../../MonthYearPickerViews.helper';

const Month = ({ month, monthNumber, onMonthClick }) => {
  const onSingleMonthClick = () => {
    onMonthClick(month, monthNumber);
  };
  return (
    <span role="presentation" className="month" onClick={onSingleMonthClick}>
      {getMonthShortName(month)}
    </span>
  );
};

Month.propTypes = {
  month: PropTypes.objectOf(PropTypes.any),
  monthNumber: PropTypes.number,
  onMonthClick: PropTypes.func,
};

Month.defaultProps = {
  month: {},
  monthNumber: 0,
  onMonthClick: () => {},
};

export default React.memo(Month);
