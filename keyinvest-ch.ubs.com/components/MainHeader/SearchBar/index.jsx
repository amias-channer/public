import React from 'react';
import MediaQuery from 'react-responsive';
import {
  Button, Input, InputGroup, InputGroupAddon,
} from 'reactstrap';
import './SearchBar.scss';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { produce } from 'immer';
import { pathOr } from 'ramda';
import SearchResults from './SearchResults';
import {
  searchBarClearSearchResults,
  searchBarGetSearchResults,
  searchBarEnterPressed,
  searchBarAccessFirstResult,
  searchBarDismissBackendErrorMessage,
} from './actions';
import i18n from '../../../utils/i18n';
import Logger from '../../../utils/logger';
import mediaQueries from '../../../utils/mediaQueries';
import {
  KEYBOARD_KEY_ARROW_DOWN,
  KEYBOARD_KEY_ENTER,
} from '../../../utils/utils';
import Alert from '../../Alert';
import { ALERT_TYPE } from '../../Alert/Alert.helper';

export class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isInputEmpty: true,
      searchResultListRefs: [],
    };
    this.searchInputRef = React.createRef();
    this.wrapperRef = React.createRef();
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.clearSearchInputAndFocus = this.clearSearchInputAndFocus.bind(this);
    this.closeSearchBar = this.closeSearchBar.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.getSearchResultRef = this.getSearchResultRef.bind(this);
    this.setListItemRef = this.setListItemRef.bind(this);
    this.onBackendErrorDismiss = this.onBackendErrorDismiss.bind(this);
    this.searchResultRef = {};
  }

  componentDidMount() {
    const { isFocused } = this.props;
    if (isFocused) {
      this.setFocus();
    }
  }

  onKeyDown(e) {
    const { dispatch, loadingSearchResults } = this.props;
    const { searchResultListRefs } = this.state;
    if (loadingSearchResults) {
      return;
    }
    try {
      switch (e.key) {
        case KEYBOARD_KEY_ARROW_DOWN:
          setTimeout(() => {
            const [firstItemRef] = searchResultListRefs;
            if (firstItemRef) {
              firstItemRef.focus();
            }
          }, 100);
          break;
        case KEYBOARD_KEY_ENTER:
          dispatch(searchBarEnterPressed(true));
          if (loadingSearchResults === false) {
            dispatch(searchBarAccessFirstResult(true));
          }
          break;
        default:
          dispatch(searchBarEnterPressed(false));
      }
    } catch (ex) {
      Logger.debug(ex);
    }
  }

  onBackendErrorDismiss() {
    const { dispatch } = this.props;
    dispatch(searchBarDismissBackendErrorMessage());
  }

  setListItemRef(ref) {
    if (ref) {
      this.setState(produce((draft) => {
        draft.searchResultListRefs.push(ref);
      }));
    }
  }

  getSearchResultRef(ref) {
    this.searchResultRef = ref;
  }

  setFocus() {
    try {
      const self = this;
      setTimeout(() => {
        if (self.searchInputRef && self.searchInputRef.current) {
          const elem = self.searchInputRef.current;
          elem.focus();
        }
      }, 200);
    } catch (e) {
      Logger.debug(e);
    }
  }

  // eslint-disable-next-line react/sort-comp
  handleOnFocus() {
    const { onFocusChange } = this.props;
    onFocusChange(true);
    this.registerEventListener();
    this.setFocus();
  }

  handleClickOutside(event) {
    if (this.wrapperRef
        && this.wrapperRef.current
        && !this.wrapperRef.current.contains(event.target)) {
      this.closeSearchBar();
    }
  }

  handleOnChange(event) {
    const { dispatch } = this.props;
    const { isInputEmpty } = this.state;

    this.setState(produce((draft) => {
      draft.searchResultListRefs = [];
    }));

    if (event.target.value) {
      if (isInputEmpty) {
        this.setState(produce((draft) => {
          draft.isInputEmpty = false;
        }));
      }
      dispatch(searchBarGetSearchResults(event.target.value));
    } else if (!isInputEmpty) {
      this.setState(produce((draft) => {
        draft.isInputEmpty = true;
      }));
    }
  }

  clearSearchInputAndFocus() {
    this.clearSearch();
    this.setFocus();
  }

  /**
   * Clears search input and the the search data in store
   */
  clearSearch() {
    const { dispatch } = this.props;
    this.setState(produce((draft) => {
      draft.isInputEmpty = true;
    }));
    this.searchInputRef.current.value = '';
    dispatch(searchBarClearSearchResults());
  }

  closeSearchBar() {
    const { onFocusChange } = this.props;
    this.clearSearch();
    onFocusChange(false);
  }

  registerEventListener() {
    this.unregisterEventListener();
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleClickOutside);
  }

  unregisterEventListener() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  }

  render() {
    const {
      searchResults, isFocused, loadingSearchResults, isBackendError,
    } = this.props;
    const { isInputEmpty, searchResultListRefs } = this.state;
    const searchInput = (
      <Input
        type="text"
        placeholder={i18n.t('search')}
        onFocus={this.handleOnFocus}
        onChange={this.handleOnChange}
        innerRef={this.searchInputRef}
        onKeyDown={this.onKeyDown}
      />
    );
    return (
      <div ref={this.wrapperRef} className={`search-bar-wrapper d-print-none ${isFocused ? 'search-bar-focused' : ''}${searchResults !== null ? '' : ' empty-results'}`}>
        { isFocused && (
          <MediaQuery query={mediaQueries.mobileTabletOnly}>
            <Button type="button" color="outline" className="float-right close-search-bar" onClick={this.closeSearchBar}>
              <i className="icon-close" />
            </Button>
          </MediaQuery>
        )}
        <InputGroup className="SearchBar">
          { !isFocused && searchInput }
          <InputGroupAddon addonType="append">
            <Button
              color="light-gray"
              onClick={this.setFocus}
            >
              <i className="icon-glass" />
            </Button>
          </InputGroupAddon>
          { isFocused && searchInput }
          {!isInputEmpty && isFocused && (
            <InputGroupAddon addonType="append">
              <Button color="light-gray" className="clear-button" onClick={this.clearSearchInputAndFocus}>
                <i className="icon-close-bold" />
              </Button>
            </InputGroupAddon>
          )}

        </InputGroup>
        {isFocused && loadingSearchResults ? (<div className="is-loading mt-4" />) : ''}
        {isBackendError && (
        <Alert
          onDismiss={this.onBackendErrorDismiss}
          type={ALERT_TYPE.ERROR}
        >
          {isBackendError}
        </Alert>
        )}
        {/* eslint-disable-next-line max-len */}
        { isBackendError === null && isFocused && searchResults !== null && !loadingSearchResults && (
          <SearchResults
            searchPhrase={pathOr('', ['searchInputRef', 'current', 'value'], this)}
            syncSearchResultRef={this.getSearchResultRef}
            data={searchResults}
            searchResultListRefs={searchResultListRefs}
            setListItemRef={this.setListItemRef}
          />
        )}
      </div>
    );
  }
}

SearchBar.propTypes = {
  isFocused: PropTypes.bool,
  loadingSearchResults: PropTypes.bool,
  searchResults: PropTypes.objectOf(PropTypes.any),
  onFocusChange: PropTypes.func,
  dispatch: PropTypes.func,
  isBackendError: PropTypes.string,
};

SearchBar.defaultProps = {
  isFocused: false,
  loadingSearchResults: false,
  searchResults: null,
  onFocusChange: null,
  dispatch: null,
  isBackendError: null,
};

function mapStateToProps(state) {
  return {
    searchResults: state.searchBar.searchResults,
    loadingSearchResults: state.searchBar.loadingSearchResults,
    isEnterPressed: state.searchBar.isEnterPressed,
    isBackendError: state.searchBar.isBackendError,
  };
}

export default connect(mapStateToProps)(SearchBar);
