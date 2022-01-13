import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { inverseSortDirection, SORT_ASC } from '../../../../../utils/utils';

function MarketGenericTableColumnHeader(props) {
  const [sortBy, setSortBy] = useState(SORT_ASC);
  const {
    columnName, onItemClick, children,
  } = props;
  const onItemClicked = () => {
    setSortBy(inverseSortDirection(sortBy));
    onItemClick(columnName, sortBy);
  };
  return (
    <span
      key={columnName}
      id={columnName}
      onClick={onItemClicked}
      role="button"
      onKeyDown={onItemClicked}
      tabIndex="-1"
    >
      {children}
    </span>
  );
}

MarketGenericTableColumnHeader.propTypes = {
  columnName: PropTypes.string,
  onItemClick: PropTypes.func,
  children: PropTypes.oneOfType(
    [

      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ],
  ),
};

MarketGenericTableColumnHeader.defaultProps = {
  columnName: '',
  onItemClick: () => {},
  children: {},
};

export default MarketGenericTableColumnHeader;
