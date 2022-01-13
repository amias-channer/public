import React from 'react';
import PropTypes from 'prop-types';
import './FlyoutSearchBox.scss';
import {
  Button, Input, InputGroup, InputGroupAddon, Row,
} from 'reactstrap';
import i18n from '../../utils/i18n';
import SearchList, { SEARCH_LIST_DISPLAY_PRODUCTS } from './SearchList';
import Logger from '../../utils/logger';

const FlyoutSearchBox = ({
  innerRef, searchInputRef, onSearch, searchResults,
  onSearchListItemClick, displayResultListOf, isSearchLoading,
}) => {
  const onInputTextChange = (e) => {
    onSearch(e.target.value);
  };
  const onClearTextClick = () => {
    try {
      searchInputRef.current.value = '';
      onSearch('');
      searchInputRef.current.focus();
    } catch (e) {
      Logger.warn('FlyoutSearchBox::onClearTextClick', e);
    }
  };
  return (
    <div className="FlyoutSearchBox" ref={innerRef}>
      <div className="flyout-search-box-wrapper">
        <Row>
          <div className="col">
            <InputGroup className="SearchBar">
              <InputGroupAddon addonType="append">
                <Button
                  color="light-gray"
                >
                  <i className="icon-glass" />
                </Button>
              </InputGroupAddon>
              <Input
                innerRef={searchInputRef}
                type="text"
                placeholder={i18n.t(`search_for_${displayResultListOf}`)}
                onChange={onInputTextChange}
              />
              {searchInputRef && searchInputRef.current && searchInputRef.current.value && (
                <InputGroupAddon addonType="append">
                  <Button color="light-gray" className="clear-button" onClick={onClearTextClick}>
                    <i className="icon-close-bold" />
                  </Button>
                </InputGroupAddon>
              )}
            </InputGroup>
          </div>
        </Row>
        <Row className="mt-4">
          {isSearchLoading && (
            <div className="is-loading" />
          )}
          {!isSearchLoading && (
            <SearchList
              displayResultListOf={displayResultListOf}
              data={searchResults}
              onSearchListItemClick={onSearchListItemClick}
            />
          )}
        </Row>
      </div>
    </div>
  );
};

FlyoutSearchBox.propTypes = {
  innerRef: PropTypes.objectOf(PropTypes.any),
  searchResults: PropTypes.objectOf(PropTypes.any),
  searchInputRef: PropTypes.objectOf(PropTypes.any),
  onSearch: PropTypes.func,
  onSearchListItemClick: PropTypes.func,
  displayResultListOf: PropTypes.string,
  isSearchLoading: PropTypes.bool,
};

FlyoutSearchBox.defaultProps = {
  innerRef: React.createRef(),
  searchResults: {},
  searchInputRef: React.createRef(),
  onSearch: () => {},
  onSearchListItemClick: () => {},
  displayResultListOf: SEARCH_LIST_DISPLAY_PRODUCTS,
  isSearchLoading: false,
};

export default React.memo(FlyoutSearchBox);
