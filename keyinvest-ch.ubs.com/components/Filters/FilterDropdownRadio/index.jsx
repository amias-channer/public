import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import './FilterDropdownRadio.scss';
import TextInput from '../../TextInput';
import { dataSelector } from '../FilterDropdownRange/selector';
import {
  filterAbstractResetAllListFilters,
  filterAbstractSetAppliedFilter,
} from '../FilterAbstract/actions';
import { SUB_FILTER_TYPE_INPUT_TEXT } from '../Filters.helper';
import FilterList from './FilterList';
import ArrowKeysListNavigation from '../../ArrowKeysListNavigation';

export class FilterDropdownRadioComponent extends FilterAbstractDropdown {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  onItemSelect(e) {
    const dataSet = e.target.dataset;
    const {
      onFilterChange, filterKey, level, uniqDefaultListId, dispatch,
    } = this.props;
    onFilterChange(filterKey, dataSet.value, level);
    dispatch(filterAbstractResetAllListFilters(uniqDefaultListId));
    this.clearTextInput();
    this.closeFilterMenu();
  }

  handleClickOutside(event) {
    if (this.filterRef
      && this.filterRef.current
      && !this.filterRef.current.contains(event.target)) {
      this.closeFilterMenu();
    }
  }

  onInputTextChange(e) {
    const { dispatch, uniqDefaultListId, filterKey } = this.props;
    const searchText = e.target.value;

    this.resetListItemsRefs();
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_INPUT_TEXT,
      searchText,
    ));
  }

  render() {
    const {
      filterKey,
      className,
      data,
    } = this.props;
    const { isActive, listItemRefs } = this.state;
    const { list } = data;
    return (
      <div
        ref={this.filterRef}
        className={classNames('Filter', 'FilterDropdown', 'FilterDropdownRadio', filterKey, className, isActive ? 'active' : '')}
      >
        <ArrowKeysListNavigation listItemRefs={listItemRefs}>
          <TextInput
            placeholder={data.label || data.title || filterKey}
            id={filterKey}
            name={filterKey}
            title={data.label || filterKey}
            onChange={this.onInputTextChange}
            onClick={this.openFilterMenu}
            showIcon
            isActive={isActive}
            textInputElementRef={this.textInputElementRef}
          />
          {isActive && (
          <div className="menu">
            <FilterList
              list={list}
              onItemSelect={this.onItemSelect}
              selectedItem={data.selected}
              setListItemRef={this.setListItemRef}
            />
          </div>
          )}
        </ArrowKeysListNavigation>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: dataSelector(state, ownProps),
});
const FilterDropdownRadio = connect(mapStateToProps)(FilterDropdownRadioComponent);
export default FilterDropdownRadio;
