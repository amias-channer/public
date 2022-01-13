import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import TextInput from '../../TextInput';
import FilterListItems from '../../NestableListItems';
import './FilterProductTypeDropdown.scss';
import {
  EMPTY_SEARCH_STRING,
  getFlattenedList,
  getLabel,
  getListData,
  getSelectedProductType, isSingleItemInList,
} from './FilterProductTypeDropdown.helper';
import {
  filterAbstractResetAllListFilters,
  filterAbstractSetAppliedFilter,
} from '../FilterAbstract/actions';
import { getVisibleItems, SUB_FILTER_TYPE_INPUT_TEXT } from '../Filters.helper';
import ArrowKeysListNavigation from '../../ArrowKeysListNavigation';
import { notEnterKeyPressed } from '../FilterAbstract/FilterAbstractDropdown/FilterAbstractDropdown.helper';
import { nestedListFilterDataSelector } from '../selectors';

export class FilterProductTypeDropdownComponent extends FilterAbstractDropdown {
  constructor(props) {
    super(props);
    this.onItemClick = this.onItemClick.bind(this);
  }

  handleClickOutside(event) {
    if (this.filterRef
      && this.filterRef.current
      && !this.filterRef.current.contains(event.target)) {
      const {
        uniqDefaultListId, filterKey, dispatch,
      } = this.props;
      dispatch(filterAbstractSetAppliedFilter(
        uniqDefaultListId,
        filterKey,
        SUB_FILTER_TYPE_INPUT_TEXT,
        EMPTY_SEARCH_STRING,
      ));
      this.clearTextInput();
      this.closeFilterMenu();
    }
  }

  onItemClick(e) {
    const value = e.target.dataset.itemValue;
    if (!value) {
      return;
    }

    const {
      uniqDefaultListId, onFilterChange, filterKey, level, dispatch,
    } = this.props;
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_INPUT_TEXT,
      EMPTY_SEARCH_STRING,
    ));
    onFilterChange(filterKey, value, level);
    this.clearTextInput();
    this.closeFilterMenu();
  }

  onInputTextChange(e) {
    const {
      uniqDefaultListId, filterKey, dispatch,
    } = this.props;
    this.resetListItemsRefs();
    const searchString = e.target.value;
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_INPUT_TEXT,
      searchString,
    ));
  }

  onTextInputKeyDown(e) {
    if (notEnterKeyPressed(e)) {
      return;
    }
    const {
      data, filterKey, level, onFilterChange, dispatch, uniqDefaultListId,
    } = this.props;
    const visibleItems = getFlattenedList(getVisibleItems(getListData(data)));
    if (isSingleItemInList(visibleItems)) {
      const [item] = visibleItems;
      onFilterChange(filterKey, item.value, level);
      dispatch(filterAbstractResetAllListFilters(uniqDefaultListId));
      this.clearTextInput();
      this.closeFilterMenu();
    }
  }

  render() {
    const {
      filterKey,
      className,
      data,
    } = this.props;

    const {
      isActive,
      listItemRefs,
    } = this.state;
    const selectedProductType = getSelectedProductType(data);
    return (
      <div
        ref={this.filterRef}
        className={classNames('Filter', 'FilterDropdown', 'FilterProductTypeDropdown', filterKey, className, isActive ? 'active' : '')}
      >
        <ArrowKeysListNavigation listItemRefs={listItemRefs}>
          <TextInput
            displayOutline={this.shouldDisplayFilterOutline()}
            placeholder={selectedProductType || getLabel(data)}
            id={filterKey}
            name={filterKey}
            title={getLabel(data)}
            onChange={this.onInputTextChange}
            onClick={this.openFilterMenu}
            showIcon
            isActive={isActive}
            textInputElementRef={this.textInputElementRef}
            onKeyDown={this.onTextInputKeyDown}
          />
          {isActive && (
          <div className="menu">
            <FilterListItems
              disableSort
              list={getListData(data)}
              onChange={this.onItemClick}
              displayStyle="columns"
              itemType="text"
              setListItemRef={this.setListItemRef}
            />
          </div>
          )}
        </ArrowKeysListNavigation>
      </div>

    );
  }
}
FilterProductTypeDropdownComponent.defaultProps = {
  className: 'col-md-4 col-12',
};

const mapStateToProps = (state, ownProps) => (
  { data: nestedListFilterDataSelector(state, ownProps) }
);
const FilterProductType = connect(mapStateToProps)(FilterProductTypeDropdownComponent);
export default FilterProductType;
