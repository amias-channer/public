import React from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import SearchListItem from './SearchListItem';
import i18n from '../../../utils/i18n';

export const SEARCH_LIST_DISPLAY_PRODUCTS = 'products';
export const SEARCH_LIST_DISPLAY_UNDERLYINGS = 'underlyings';
export const SEARCH_LIST_DISPLAY_DEFAULT = SEARCH_LIST_DISPLAY_PRODUCTS;

const SearchList = ({ data, displayResultListOf, onSearchListItemClick }) => {
  const getList = () => pathOr([], [displayResultListOf, 'entries'], data);
  const listItems = getList().map((item) => (
    <SearchListItem
      key={item.name}
      data={item}
      onItemClick={onSearchListItemClick}
    />
  ));
  return (
    <div className="SearchList col search-list-col">
      {listItems && listItems.length > 0 && (
      <>
        <h3>{i18n.t(`add_${displayResultListOf}`)}</h3>
        <ul>
          {listItems}
        </ul>
      </>
      )}
    </div>
  );
};

SearchList.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onSearchListItemClick: PropTypes.func,
  displayResultListOf: PropTypes.string,
};

SearchList.defaultProps = {
  data: [],
  displayResultListOf: SEARCH_LIST_DISPLAY_DEFAULT,
  onSearchListItemClick: () => {},
};

export default React.memo(SearchList);
