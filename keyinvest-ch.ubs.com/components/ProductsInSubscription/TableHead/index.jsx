import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TableHead = ({ children, className }) => (
  <thead className={classNames('TableHead', className)}>
    {children}
  </thead>
);

TableHead.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

TableHead.defaultProps = {
  children: '',
  className: '',
};

export default React.memo(TableHead);
