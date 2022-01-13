import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { produce } from 'immer';
import { equals } from 'ramda';
import { FilterAbstractComponent } from '../FilterAbstract';
import CheckboxListItems from './CheckboxListItems';
import {
  getListItems,
  getParentItemData, getSelectedListItems,
} from './FilterFlatOneLevelNested.helper';
import CheckboxListItem from './CheckboxListItems/CheckboxListItem';
import './FilterFlatOneLevelNested.scss';
import { defaultListFilterableUpdateFilterListItem } from '../../DefaultListFilterable/actions';
import {
  CHECKBOX_SELECTED_FALSE,
  CHECKBOX_SELECTED_TRUE,
  DEFAULT_LIST_TYPE, getItemIsChecked,
  getItemValue,
} from '../FilterAbstract/FilterAbstractDropdown/FilterAbstractDropdown.helper';

export class FilterFlatOneLevelNestedComp extends FilterAbstractComponent {
  constructor(props) {
    super(props);
    const { data } = props;
    this.state = { parentCheckboxData: getParentItemData(data) };
    this.onParentItemClick = this.onParentItemClick.bind(this);
    this.onNestedChildItemClick = this.onNestedChildItemClick.bind(this);
    this.selectAllChildren = this.selectAllChildren.bind(this);
    this.unSelectAllChildren = this.unSelectAllChildren.bind(this);
    this.toggleAllChildren = this.toggleAllChildren.bind(this);
    this.setParentSelectedStatus = this.setParentSelectedStatus.bind(this);
    this.updateParentSelectionStatus = this.updateParentSelectionStatus.bind(this);
    this.shouldSelectParent = this.shouldSelectParent.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!equals(prevProps.data, this.props.data)) {
      this.updateParentSelectionStatus();
      this.applyFilters();
    }
  }

  toggleAllChildren(shouldSelectAllChildren) {
    const {
      data, uniqDefaultListId, level, filterKey, dispatch, dataSource,
    } = this.props;
    const listItems = getListItems(data);
    Object.keys(listItems).forEach((itemKey) => {
      const itemChecked = shouldSelectAllChildren
        ? CHECKBOX_SELECTED_TRUE
        : CHECKBOX_SELECTED_FALSE;
      dispatch(defaultListFilterableUpdateFilterListItem(
        uniqDefaultListId,
        level,
        filterKey,
        DEFAULT_LIST_TYPE,
        itemKey,
        itemChecked,
        dataSource,
      ));
    });
  }

  setParentSelectedStatus(isSelected) {
    this.setState(produce((draft) => {
      draft.parentCheckboxData.selected = isSelected;
    }));
  }

  selectAllChildren() {
    this.toggleAllChildren(true);
  }

  unSelectAllChildren() {
    this.toggleAllChildren(false);
  }

  onParentItemClick(event) {
    const isChecked = getItemIsChecked(event);
    if (isChecked) {
      this.selectAllChildren();
    } else {
      this.unSelectAllChildren();
    }
    this.setParentSelectedStatus(isChecked);
  }

  shouldSelectParent() {
    const { data } = this.props;
    const listItems = getListItems(data);
    let shouldSelectParent = true;
    Object.keys(listItems).forEach((itemKey) => {
      if (!listItems[itemKey].selected) {
        shouldSelectParent = false;
      }
    });
    return shouldSelectParent;
  }

  updateParentSelectionStatus() {
    if (this.shouldSelectParent()) {
      this.setParentSelectedStatus(true);
    } else {
      this.setParentSelectedStatus(false);
    }
  }

  onNestedChildItemClick(event) {
    const {
      uniqDefaultListId, level, filterKey, dispatch, dataSource,
    } = this.props;
    const itemKey = getItemValue(event);
    const isChecked = getItemIsChecked(event);
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
    const {
      data,
      onFilterChange,
      filterKey,
      level,
    } = this.props;
    const selectedListItems = getSelectedListItems(getListItems(data));
    onFilterChange(filterKey, selectedListItems, level);
  }

  render() {
    const {
      filterKey, className, data, uniqDefaultListId,
    } = this.props;
    const { parentCheckboxData } = this.state;
    const uniqId = uniqDefaultListId + filterKey;
    return (
      <div
        className={classNames('Filter', 'FilterFlatOneLevelNested', filterKey, className)}
      >
        <CheckboxListItem
          listUniqId={uniqId}
          data={parentCheckboxData}
          onItemClick={this.onParentItemClick}
        />
        <CheckboxListItems
          listUniqId={uniqId}
          items={getListItems(data)}
          className="nested-list"
          onItemClick={this.onNestedChildItemClick}
        />
      </div>
    );
  }
}
FilterFlatOneLevelNestedComp.defaultProps = {
  className: 'col-md-4 col-12',
};
const FilterFlatOneLevelNested = connect()(FilterFlatOneLevelNestedComp);
export default FilterFlatOneLevelNested;
