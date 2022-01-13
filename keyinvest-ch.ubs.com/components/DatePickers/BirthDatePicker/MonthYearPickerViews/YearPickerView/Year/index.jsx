import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Year = ({ year, onYearClick }) => {
  const onSingleYearClicked = () => {
    onYearClick(year);
  };
  return (
    <span role="presentation" className={classNames('year')} onClick={onSingleYearClicked}>
      {year}
    </span>
  );
};

Year.propTypes = {
  year: PropTypes.number,
  onYearClick: PropTypes.func,
};

Year.defaultProps = {
  year: 0,
  onYearClick: () => {},
};

export default React.memo(Year);
