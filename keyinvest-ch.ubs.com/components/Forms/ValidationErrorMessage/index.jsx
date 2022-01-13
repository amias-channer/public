import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ValidationErrorMessage.scss';

const ValidationErrorMessage = ({
  className, message,
}) => (
  <div className={classNames(className, 'ValidationErrorMessage', 'error-message')}>
    {message}
  </div>
);

ValidationErrorMessage.propTypes = {
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  className: PropTypes.string,
};
ValidationErrorMessage.defaultProps = {
  message: '',
  className: '',
};
export default React.memo(ValidationErrorMessage);
