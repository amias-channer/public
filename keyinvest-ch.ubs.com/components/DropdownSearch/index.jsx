import React from 'react';
import { equals, filter } from 'ramda';
import PropTypes from 'prop-types';
import {
  Button, DropdownMenu, Input,
} from 'reactstrap';
import classNames from 'classnames';
import { produce } from 'immer';
import {
  getFilteredListByText,
  KEYBOARD_KEY_ARROW_DOWN,
  KEYBOARD_KEY_ENTER,
} from '../../utils/utils';
import i18n from '../../utils/i18n';

const INITIAL_SEARCH_TEXT = '';

const isSingleItemInList = (list) => !!(list && list.length === 1);
const isListEmpty = (list) => !!(list && list.length === 0);
const getListItemEventData = (listItem) => ({
  target: {
    innerText: listItem.label,
    value: listItem.sin,
  },
});
const isEnterKeyPressed = (event) => !!(event.key && event.key === KEYBOARD_KEY_ENTER);
const isArrowKeyDownPressed = (event) => !!(event.key && event.key === KEYBOARD_KEY_ARROW_DOWN);

class DropdownSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    const { list } = this.props;
    this.state = {
      filterList: list,
      searchText: INITIAL_SEARCH_TEXT,
    };
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
    this.onItemSelected = this.onItemSelected.bind(this);
    this.onKeyPressedOnInput = this.onKeyPressedOnInput.bind(this);
    this.dropdownFirstListItemRef = React.createRef();
    this.dropdownListRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { list, isDropdownOpen } = this.props;
    if (!equals(prevProps.list, list)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        filterList: list,
      });
    }

    if (prevProps.isDropdownOpen !== isDropdownOpen && isDropdownOpen === false) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        searchText: INITIAL_SEARCH_TEXT,
        filterList: list,
      });
    }
  }

  onSearchTextChange(e) {
    const text = e.target.value;
    const { list } = this.props;
    const filteredList = getFilteredListByText(text, list);
    this.setState({
      filterList: filteredList,
      searchText: text,
    }, () => {
      this.onKeyPressedOnInput(e);
    });
  }

  onItemSelected(e) {
    const { list, toggleDropdown } = this.props;
    e.persist();
    const { onItemSelect } = this.props;
    this.setState(produce((draft) => {
      draft.filterList = list;
      draft.searchText = INITIAL_SEARCH_TEXT;
    }), () => {
      onItemSelect(e);
      toggleDropdown();
    });
  }

  onKeyPressedOnInput(e) {
    const { filterList } = this.state;
    const { onItemSelect, toggleDropdown, list } = this.props;
    if (isEnterKeyPressed(e)) {
      if (isSingleItemInList(filterList)) {
        const [listItem] = filterList;
        const event = getListItemEventData(listItem);
        onItemSelect(event);
        toggleDropdown();
        this.setState(produce((draft) => {
          draft.filterList = list;
          draft.searchText = INITIAL_SEARCH_TEXT;
        }));
      }

      if (isListEmpty(filterList)) {
        this.setState(produce((draft) => {
          draft.filterList = list;
          draft.searchText = INITIAL_SEARCH_TEXT;
        }));
      }
    }

    if (isArrowKeyDownPressed(e)) {
      this.focusList();
    }
  }

  getFavoriteListItems() {
    const { filterList } = this.state;
    const filterByisFavorite = (item) => !!item.isFavourite;
    return filter(filterByisFavorite, filterList);
  }

  getListItemElements(list, isFavorite) {
    const { selectedDropdownItem } = this.props;
    const listItems = Object.keys(list);
    if (listItems.length === 0) {
      return null;
    }
    return listItems
      .map(
        (item, index) => (
          <Button
            tabIndex="0"
            role="menuitem"
            key={list[item].sin}
            value={list[item].sin}
            onClick={this.onItemSelected}
            className={classNames('dropdown-item', selectedDropdownItem === list[item].label ? 'selected' : '')}
            innerRef={this.getInnerRef(index, isFavorite)}
          >
            {list[item].label}
          </Button>
        ),
      );
  }

  getInnerRef(index, isFavoriteList) {
    const { searchText } = this.state;
    if (searchText && index === 0) {
      return this.dropdownFirstListItemRef;
    }
    if (isFavoriteList && index === 0) {
      return this.dropdownFirstListItemRef;
    }
    return undefined;
  }

  focusList() {
    if (this.dropdownFirstListItemRef.current) {
      this.dropdownFirstListItemRef.current.focus();
      this.scrollListToTop();
    }
  }

  scrollListToTop() {
    if (this.dropdownFirstListItemRef.current) {
      setTimeout(() => {
        this.dropdownListRef.current.scrollTo(0, 0);
      }, 50);
    }
  }

  render() {
    const {
      className, textInputPlaceHolder, searchInputRef,
    } = this.props;
    const { filterList, searchText } = this.state;
    const favoriteListItems = this.getListItemElements(this.getFavoriteListItems(), true);
    const listItems = this.getListItemElements(filterList);
    return (
      <div className={classNames('DropdownSearch', className)}>
        <DropdownMenu>
          <Input
            type="text"
            name="search-underlying"
            id="searchUnderlying"
            placeholder={textInputPlaceHolder}
            onChange={this.onSearchTextChange}
            value={searchText}
            innerRef={searchInputRef}
            onKeyDown={this.onKeyPressedOnInput}
          />
          <div ref={this.dropdownListRef} className="items-list">
            {searchText === '' && favoriteListItems && (
              <>
                <strong>{i18n.t('popular')}</strong>
                <hr />
                {favoriteListItems}
                <hr />
              </>
            )}
            {listItems}
          </div>
        </DropdownMenu>
      </div>
    );
  }
}

DropdownSearch.propTypes = {
  list: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  textInputPlaceHolder: PropTypes.string,
  onItemSelect: PropTypes.func,
  toggleDropdown: PropTypes.func,
  selectedDropdownItem: PropTypes.string,
  searchInputRef: PropTypes.objectOf(PropTypes.any),
  isDropdownOpen: PropTypes.bool,
};

DropdownSearch.defaultProps = {
  list: [],
  className: '',
  textInputPlaceHolder: '',
  onItemSelect: () => {},
  toggleDropdown: () => {},
  selectedDropdownItem: '',
  searchInputRef: {},
  isDropdownOpen: false,
};

export default DropdownSearch;
