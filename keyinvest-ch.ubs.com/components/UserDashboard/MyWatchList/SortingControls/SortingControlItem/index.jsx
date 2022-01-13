import React from 'react';
import PropTypes from 'prop-types';
import {
  isSortDirectionAscending, isSortDirectionDescending,
} from '../../MyWatchList.helper';
import Icon from '../../../../Icon';
import './SortingControlItem.scss';

const SortingControlItem = ({
  label, sortByKey, onSortItemClick, currentSortedBy, currentSortDirection,
}) => {
  const onSortItemClicked = () => {
    onSortItemClick(sortByKey);
  };

  const isSortedItem = () => currentSortedBy === sortByKey;
  return (
    <span role="presentation" onClick={onSortItemClicked} className="SortingControlItem toolbar-item">
      {label}
      {currentSortedBy
      && isSortedItem()
      && isSortDirectionAscending(currentSortDirection)
      && (
        <Icon className="sort-icon" type="triangle-up" />
      )}

      {currentSortedBy
      && isSortedItem()
      && isSortDirectionDescending(currentSortDirection)
      && (
        <Icon className="sort-icon" type="triangle-down" />
      )}
    </span>
  );
};

SortingControlItem.propTypes = {
  label: PropTypes.string,
  currentSortedBy: PropTypes.string,
  currentSortDirection: PropTypes.string,
  sortByKey: PropTypes.string,
  onSortItemClick: PropTypes.func,
};

SortingControlItem.defaultProps = {
  label: '',
  sortByKey: '',
  currentSortedBy: '',
  currentSortDirection: '',
  onSortItemClick: () => {},
};

export default SortingControlItem;
