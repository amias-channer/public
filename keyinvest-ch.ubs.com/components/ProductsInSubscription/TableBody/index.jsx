import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TableBody = ({ children, className }) => (
  <tbody className={classNames('TableBody', className)}>
    {children}
  </tbody>
);

TableBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableBody.defaultProps = {
  children: '',
  className: '',
};
export default React.memo(TableBody);
