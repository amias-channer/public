import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CheckboxListItem from './CheckboxListItem';

const CheckboxListItems = ({
  items, listUniqId, className, onItemClick,
}) => (
  <div className={classNames('CheckboxListItems', className)}>
    {Object.keys(items).map((itemKey) => (
      <CheckboxListItem
        key={itemKey}
        listUniqId={listUniqId}
        data={items[itemKey]}
        onItemClick={onItemClick}
      />
    ))}
  </div>
);

CheckboxListItems.propTypes = {
  items: PropTypes.objectOf(PropTypes.any),
  listUniqId: PropTypes.string.isRequired,
  className: PropTypes.string,
  onItemClick: PropTypes.func,
};

CheckboxListItems.defaultProps = {
  items: {},
  className: '',
  onItemClick: () => {},
};

export default React.memo(CheckboxListItems);
