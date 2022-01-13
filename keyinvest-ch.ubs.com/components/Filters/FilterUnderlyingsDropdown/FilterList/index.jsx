import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'reactstrap';
import { getAlphabets, getNumbers } from '../../../../utils/utils';
import FilterListItem from './FilterListItem';
import i18n from '../../../../utils/i18n';
import { SUB_FILTER_TYPE_INPUT_TEXT } from '../../Filters.helper';
import {
  DEFAULT_SELECTED_CHAR_ALL,
  SELECTED_CHAR_NUMERIC,
} from '../FilterUnderlyingsDropdown.helper';
import {
  extractIdentifiersArray,
  getFilteredListForFavorite,
  getFilteredListForLetter,
  getFilteredListForNumbers, getSortedList,
} from './FilterList.helper';

function FilterList(props) {
  const {
    list, onItemSelect,
    selectedCharacter,
    setListItemRef,
    appliedListFilters,
  } = props;

  const setRef = (ref) => {
    if (ref && setListItemRef) {
      setListItemRef(ref);
      return ref;
    }
    return undefined;
  };

  const getFilterListItems = (listItems) => {
    if (!listItems) {
      return null;
    }

    const listOfItems = Array.isArray(listItems) ? listItems : Object.keys(listItems);

    return listOfItems.map(
      (item) => (
        <FilterListItem
          data={list[item]}
          key={list[item].value}
          onItemSelect={onItemSelect}
          isChecked={list[item].selected}
          ref={setRef}
        />
      ),
    );
  };

  const getRenderedListElements = (letter, listItems) => {
    if (listItems && listItems.length > 0) {
      return (
        <Fragment key={letter}>
          <span className="headingLetter">{letter}</span>
          <ul className="underlyingsGroup">{listItems}</ul>
        </Fragment>
      );
    }
    return null;
  };

  const getAlphabeticalLists = () => getAlphabets().split('').map((letter) => {
    const filteredListForLetter = getFilteredListForLetter(letter, list);
    const filterListItems = getFilterListItems(filteredListForLetter);
    return getRenderedListElements(letter, filterListItems);
  });

  const getNumericalList = () => {
    if (Object.keys(list).length > 0
      && (selectedCharacter === DEFAULT_SELECTED_CHAR_ALL
        || selectedCharacter === SELECTED_CHAR_NUMERIC)) {
      const filteredListForNumbers = getFilteredListForNumbers(getNumbers(), list);
      const filterListItems = getFilterListItems(filteredListForNumbers);
      return getRenderedListElements('0-9', filterListItems);
    }
    return null;
  };

  const isInputTextFilterApplied = () => !!(appliedListFilters[SUB_FILTER_TYPE_INPUT_TEXT] && appliedListFilters[SUB_FILTER_TYPE_INPUT_TEXT] !== '');

  const getFavoriteList = () => {
    if (isInputTextFilterApplied()) {
      return null;
    }
    if (Object.keys(list).length > 0 && selectedCharacter === DEFAULT_SELECTED_CHAR_ALL) {
      const filteredListForFavorite = getFilteredListForFavorite(list);
      const filterListItems = getFilterListItems(
        extractIdentifiersArray(getSortedList(filteredListForFavorite, 'label'), 'value'),
      );
      return getRenderedListElements(i18n.t('popular'), filterListItems);
    }
    return null;
  };

  return (
    <Col className="UnderlyingFilterList">
      {getFavoriteList()}
      {getAlphabeticalLists()}
      {getNumericalList()}
    </Col>
  );
}

FilterList.propTypes = {
  list: PropTypes.objectOf(PropTypes.any),
  appliedListFilters: PropTypes.objectOf(PropTypes.any),
  onItemSelect: PropTypes.func,
  setListItemRef: PropTypes.func,
  selectedCharacter: PropTypes.string,
};

FilterList.defaultProps = {
  list: {},
  appliedListFilters: {},
  onItemSelect: () => {},
  setListItemRef: () => {},
  selectedCharacter: 'all',
};
export default React.memo(FilterList);
