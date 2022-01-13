import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const ListItem = ({
  data, onItemClick, children, className,
}) => {
  const onItemClicked = (e) => {
    onItemClick(e, data);
  };
  return (
    <div className={classNames('ListItem', className)}>
      <Button color="outline" onClick={onItemClicked}>{children}</Button>
    </div>
  );
};

ListItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onItemClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

ListItem.defaultProps = {
  data: {},
  onItemClick: () => {},
  children: null,
  className: '',
};

export default ListItem;
