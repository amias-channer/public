import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ListItems = ({ children, className }) => (
  <div className={classNames('ListItems', className)}>
    {children}
  </div>
);

ListItems.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

ListItems.defaultProps = {
  children: null,
  className: '',
};

export default React.memo(ListItems);
