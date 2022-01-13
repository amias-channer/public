import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Table = ({ children, className }) => (
  <table className={classNames(className, 'Table table table-default')}>
    {children}
  </table>
);

Table.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

Table.defaultProps = {
  className: '',
  children: '',
};

export default React.memo(Table);
