import React from 'react';
import { clone, filter } from 'ramda';
import { produce } from 'immer';
import classNames from 'classnames';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../../../Button';
import ButtonsGroup from '../../../ButtonsGroup';
import { FilterAbstractComponent } from '../index';
import {
  getFilteredListByText,
} from '../../../../utils/utils';
import { FILTER_TYPE_DROPDOWN } from '../../Filters.helper';
import Logger from '../../../../utils/logger';
import { defaultListFilterableUpdateFilterListItem } from '../../../DefaultListFilterable/actions';
import TextInput from '../../../TextInput';
import FilterListItems from '../../../NestableListItems';
import i18n from '../../../../utils/i18n';
import {
  CHECKBOX_SELECTED_FALSE,
  CHECKBOX_SELECTED_TRUE,
  DEFAULT_LIST_TYPE,
  getActiveListItems,
  getItemIsChecked,
  getItemValue,
  getLabel,
  getList,
  isSingleItemInList, notEnterKeyPressed,
} from './FilterAbstractDropdown.helper';
import ArrowKeysListNavigation from '../../../ArrowKeysListNavigation';
import { filterAbstractResetAllListFilters } from '../actions';

const INITIAL_SEARCH_TEXT = '';

export default class FilterAbstractDropdown extends FilterAbstractComponent {
  constructor(props) {
    super(props);
    this.textInputElementRef = React.createRef();
    this.state = {
      list: {},
      searchText: INITIAL_SEARCH_TEXT,
      listItemRefs: [],
    };

    this.setListItemRef = this.setListItemRef.bind(this);
    this.onInputTextChange = this.onInputTextChange.bind(this);
    this.openFilterMenu = this.openFilterMenu.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.cancelFilters = this.cancelFilters.bind(this);
    this.closeFilterMenu = this.closeFilterMenu.bind(this);
    this.onTextInputKeyDown = this.onTextInputKeyDown.bind(this);
  }

  clearTextInput() {
    if (this.textInputElementRef && this.textInputElementRef.current) {
      this.textInputElementRef.current.value = '';
      this.textInputElementRef.current.blur();
    }
  }

  handleClickOutside(event) {
    if (this.filterRef
        && this.filterRef.current
        && !this.filterRef.current.contains(event.target)) {
      this.applyFilters();
    }
  }

  setListItemRef(ref) {
    if (ref) {
      this.setState(produce((draft) => {
        draft.listItemRefs.push(ref);
      }));
    }
  }

  onInputTextChange(e) {
    const { list } = this.state;
    const searchText = e.target.value;

    this.setState(produce((draft) => {
      draft.searchText = searchText;
    }));

    const listToFilter = clone(list);
    const filteredList = getFilteredListByText(e.target.value, listToFilter);
    const filteredItemsKeys = Object.keys(filteredList);
    Object.keys(list).forEach((item) => {
      if (filteredItemsKeys.indexOf(item) > -1) {
        this.setState(produce((draft) => {
          draft.list[item].hideItem = false;
        }));
      } else {
        this.setState(produce((draft) => {
          draft.list[item].hideItem = true;
        }));
      }
    });
  }

  openFilterMenu() {
    this.resetListItemsRefs();
    this.setState(produce((draft) => {
      draft.isActive = true;
    }));
    this.registerEventListener();
    if (this.textInputElementRef && this.textInputElementRef.current) {
      this.textInputElementRef.current.focus();
    }
  }

  closeFilterMenu() {
    this.setState(produce((draft) => {
      draft.isActive = false;
    }), () => {
      this.unregisterEventListener();
    });
  }

  onChange(event) {
    const {
      uniqDefaultListId, level, filterKey, dispatch, dataSource,
    } = this.props;
    const itemKey = getItemValue(event);
    const isChecked = getItemIsChecked(event);

    if (!itemKey) {
      Logger.error('CheckboxInput value is not set, please make sure to set it!');
      return;
    }

    const itemChecked = isChecked ? CHECKBOX_SELECTED_TRUE : CHECKBOX_SELECTED_FALSE;

    dispatch(defaultListFilterableUpdateFilterListItem(
      uniqDefaultListId,
      level,
      filterKey,
      DEFAULT_LIST_TYPE,
      itemKey,
      itemChecked,
      dataSource,
    ));
  }

  applyFilters() {
    const { list } = this.state;
    const { onFilterChange, filterKey, level } = this.props;
    const isSelected = (item) => !!item.selected;
    const selectedItems = filter(isSelected, list);
    const selectedListItems = Object.keys(selectedItems);
    onFilterChange(filterKey, selectedListItems, level);
    this.closeFilterMenu();
  }

  cancelFilters() {
    const { data } = this.props;
    this.setState(produce((draft) => {
      draft.list = data.list;
      draft.isActive = false;
    }));
  }

  resetListItemsRefs() {
    this.setState((draft) => {
      draft.listItemRefs = [];
    });
  }

  onTextInputKeyDown(e) {
    if (notEnterKeyPressed(e)) {
      return;
    }
    const {
      level, filterKey, data, onFilterChange, dispatch, uniqDefaultListId,
    } = this.props;
    const list = getList(data);
    const [itemKey] = list && Object.keys(list);
    if (itemKey && isSingleItemInList(list) && !list[itemKey].selected) {
      const activeItems = getActiveListItems(data);
      onFilterChange(filterKey, [...activeItems, itemKey], level);
      dispatch(filterAbstractResetAllListFilters(uniqDefaultListId));
      this.clearTextInput();
      this.closeFilterMenu();
    }
  }

  render() {
    const {
      filterKey,
      data,
      className,
      buttonsSize,
    } = this.props;

    const { isActive, listItemRefs } = this.state;
    return (
      <div
        ref={this.filterRef}
        className={classNames('Filter', 'FilterDropdown', this.filterClassName ? this.filterClassName : '', filterKey, className, isActive ? 'active' : '')}
      >
        <ArrowKeysListNavigation listItemRefs={listItemRefs}>
          <TextInput
            displayOutline={this.shouldDisplayFilterOutline()}
            placeholder={getLabel(data)}
            id={filterKey}
            name={filterKey}
            title={getLabel(data) || filterKey}
            onChange={this.onInputTextChange}
            showIcon
            isActive={isActive}
            onClick={this.openFilterMenu}
            textInputElementRef={this.textInputElementRef}
            onKeyDown={this.onTextInputKeyDown}
          />
          {isActive && (
          <div className="menu">
            <FilterListItems
              list={getList(data)}
              onChange={this.onChange}
              setListItemRef={this.setListItemRef}
            />
            <div className="row">
              <div className="col">
                <ButtonsGroup className="buttons">
                  <Button className="button-apply" color={BUTTON_COLOR.OLIVE} size={buttonsSize} onClick={this.applyFilters}>{i18n.t('Apply')}</Button>
                  <Button className="button-cancel" color={BUTTON_COLOR.STANDARD} size={buttonsSize} onClick={this.cancelFilters}>{i18n.t('Cancel')}</Button>
                </ButtonsGroup>
              </div>
            </div>
          </div>
          )}
        </ArrowKeysListNavigation>
      </div>

    );
  }
}

FilterAbstractDropdown.defaultProps = {
  type: FILTER_TYPE_DROPDOWN,
  buttonsSize: BUTTON_SIZE.MEDIUM,
  className: 'col-md-4 col-12',
};
