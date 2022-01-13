import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './ColoredValue.scss';

const ColoredValue = ({ className, field }) => {
  let color = 'positive';
  if (field && String(field).length && String(field).indexOf('-') === 0) {
    color = 'negative';
  }
  return (
    <span className={classNames('ColoredValue', className, color)}>
      {field}
    </span>
  );
};

ColoredValue.propTypes = {
  className: PropTypes.string,
  field: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
ColoredValue.defaultProps = {
  className: '',
  field: '',
};

export default React.memo(ColoredValue);
