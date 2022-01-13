import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import TextInput from '../../TextInput';
import i18n from '../../../utils/i18n';
import ButtonsGroup from '../../ButtonsGroup';
import Button, { BUTTON_COLOR } from '../../Button';
import './FilterDropdownGroupedNested.scss';
import {
  getListData, getLabel, getData,
  FILTER_COLUMNS_LAYOUT_CONFIG,
  DEFAULT_LIST_TYPE,
  getAppliedFilterValueByType,
  SUB_FILTER_TYPE_LIST_TYPE,
  EMPTY_SEARCH_STRING,
} from './FilterDropdownGroupedNested.helper';
import {
  filterAbstractSetAppliedFilter,
} from '../FilterAbstract/actions';
import {
  FILTER_TYPE_DROPDOWN,
  SUB_FILTER_TYPE_INPUT_TEXT,
} from '../Filters.helper';
import Logger from '../../../utils/logger';
import { defaultListFilterableUpdateFilterListItem } from '../../DefaultListFilterable/actions';
import ArrowKeysListNavigation from '../../ArrowKeysListNavigation';
import { nestedListFilterDataSelector } from '../selectors';
import NestableListItems from '../../NestableListItems';

export class FilterDropdownGroupedNestedCmp extends FilterAbstractDropdown {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
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
      this.applyFilters();
    }
  }

  onItemSelect(e, innerPath) {
    try {
      const {
        appliedListFilters, dispatch, uniqDefaultListId, filterKey, level, dataSource,
      } = this.props;
      const itemKey = e.target.value;
      const { checked } = e.target;
      const { childof } = e.target.dataset;
      if (!itemKey) {
        Logger.error('CheckboxInput value is not set, please make sure to set it!');
        return;
      }

      const filterListType = getAppliedFilterValueByType(
        SUB_FILTER_TYPE_LIST_TYPE, DEFAULT_LIST_TYPE, appliedListFilters,
      );

      const itemChecked = checked ? { selected: true } : { selected: false };

      dispatch(defaultListFilterableUpdateFilterListItem(
        uniqDefaultListId,
        level,
        filterKey,
        filterListType,
        itemKey,
        itemChecked,
        dataSource,
        innerPath,
        childof,
      ));
    } catch (ex) {
      Logger.warn(ex);
    }
  }

  applyFilters() {
    const {
      onFilterChange, filterKey, level, syncedData,
    } = this.props;
    const selectedOptions = [];

    const getAllSelectedOptions = (list) => {
      Object.keys(list).forEach((item) => {
        if (list[item] && list[item].selected) {
          if (!list[item].list) {
            selectedOptions.push(list[item].value);
          }
        }
        if (list[item] && list[item].list && Object.keys(list[item].list).length > 0) {
          getAllSelectedOptions(list[item].list);
        }
      });

      return selectedOptions;
    };

    const selections = getAllSelectedOptions(syncedData && syncedData.list ? syncedData.list : {});

    onFilterChange(filterKey, selections, level);
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
        className={classNames(
          'Filter', 'FilterDropdown FilterDropdownGroupedNested',
          filterKey, className, isActive ? 'active' : '',
        )}
      >
        <ArrowKeysListNavigation listItemRefs={listItemRefs}>
          <TextInput
            displayOutline={this.shouldDisplayFilterOutline()}
            placeholder={getLabel(data) || filterKey}
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
            <NestableListItems
              uniqId={getLabel(data)}
              list={getListData(data)}
              onChange={this.onItemSelect}
              displayStyle="columns"
              setListItemRef={this.setListItemRef}
              breakpointColumnsConfigByNestingLevel={FILTER_COLUMNS_LAYOUT_CONFIG}
            />

            <div className="row">
              <div className="col-4 col-sm-12 col-lg-4 mx-auto">
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
FilterDropdownGroupedNestedCmp.defaultProps = {
  className: 'col-md-4 col-12',
  type: FILTER_TYPE_DROPDOWN,
};
const mapStateToProps = (state, ownProps) => ({
  data: nestedListFilterDataSelector(state, ownProps),
  syncedData: getData(state, ownProps),
});
export default connect(mapStateToProps)(FilterDropdownGroupedNestedCmp);
