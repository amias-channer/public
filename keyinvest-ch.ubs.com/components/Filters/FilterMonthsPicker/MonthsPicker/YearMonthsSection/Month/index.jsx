import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Month.scss';

const Month = ({
  month, monthYearDate, isSelected, isEnabled, onMonthSelected,
}) => {
  const onMonthClicked = () => {
    if (!isEnabled) {
      return;
    }
    const isMonthSelected = !isSelected;
    onMonthSelected(monthYearDate, isMonthSelected);
  };
  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onMonthClicked}
      onKeyDown={onMonthClicked}
      className={classNames('Month', isSelected ? 'selected' : '', isEnabled ? '' : 'disabled')}
    >
      { month }
    </div>
  );
};

Month.propTypes = {
  month: PropTypes.string,
  monthYearDate: PropTypes.string,
  isSelected: PropTypes.bool,
  isEnabled: PropTypes.bool,
  onMonthSelected: PropTypes.func,
};

Month.defaultProps = {
  month: '',
  monthYearDate: '',
  isSelected: false,
  isEnabled: false,
  onMonthSelected: () => {},
};

export default React.memo(Month);
