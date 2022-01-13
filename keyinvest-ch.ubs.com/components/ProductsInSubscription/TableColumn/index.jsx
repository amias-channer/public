import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TableColumn = ({
  className, children, onClick, data,
}) => {
  const onClicked = (e) => {
    onClick(e, data);
  };
  return (<td className={classNames('TableColumn', className)} role="presentation" onClick={onClicked}>{children}</td>);
};

TableColumn.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
};

TableColumn.defaultProps = {
  className: '',
  children: undefined,
  onClick: () => {},
  data: {},
};

export default TableColumn;
