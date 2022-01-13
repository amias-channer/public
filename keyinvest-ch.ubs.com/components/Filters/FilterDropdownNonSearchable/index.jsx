import React from 'react';
import classNames from 'classnames';
import { equals } from 'ramda';
import { connect } from 'react-redux';
import { produce } from 'immer';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import ArrowKeysListNavigation from '../../ArrowKeysListNavigation';
import {
  CHECKBOX_SELECTED_FALSE,
  CHECKBOX_SELECTED_TRUE,
  DEFAULT_LIST_TYPE,
  getLabel,
  getList,
  getSelectedListItems,
} from '../FilterAbstract/FilterAbstractDropdown/FilterAbstractDropdown.helper';
import FilterListItems from '../../NestableListItems';
import ButtonsGroup from '../../ButtonsGroup';
import Button, { BUTTON_COLOR } from '../../Button';
import i18n from '../../../utils/i18n';
import TextInput from '../../TextInput';
import Icon from '../../Icon';
import './FilterDropdownNonSearchable.scss';
import NestableListItem from '../../NestableListItems/NestableListItem';
import { defaultListFilterableUpdateFilterListItem } from '../../DefaultListFilterable/actions';

export class FilterDropdownNonSearchableComp extends FilterAbstractDropdown {
  constructor(props) {
    super(props);
    this.state = {
      allOption: { label: i18n.t('all'), value: 'all', selected: false },
      listItemRefs: [],
    };
    this.allOptionSelected = this.allOptionSelected.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!equals(getList(prevProps.data), getList(this.props.data))) {
      if (this.shouldSelectAllOption()) {
        this.setAllOptionSelected(true);
      } else {
        this.setAllOptionSelected(false);
      }
    }
  }

  applyFilters() {
    const {
      onFilterChange, filterKey, level, data,
    } = this.props;
    const selectedItems = getSelectedListItems(data);
    onFilterChange(filterKey, selectedItems, level);
    this.closeFilterMenu();
  }

  setAllOptionSelected(isSelected) {
    this.setState(produce((draft) => {
      draft.allOption.selected = isSelected;
    }));
  }

  toggleListItemsSelected(shouldSelectAllOptions) {
    const {
      data, uniqDefaultListId, level, filterKey, dispatch, dataSource,
    } = this.props;
    const list = getList(data);
    Object.keys(list).forEach((itemKey) => {
      const itemChecked = shouldSelectAllOptions ? CHECKBOX_SELECTED_TRUE : CHECKBOX_SELECTED_FALSE;

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

  allOptionSelected() {
    const { allOption } = this.state;

    const isAllOptionSelected = !allOption.selected;

    if (isAllOptionSelected) {
      this.toggleListItemsSelected(true);
    } else {
      this.toggleListItemsSelected(false);
    }
    this.setAllOptionSelected(isAllOptionSelected);
  }

  shouldSelectAllOption() {
    const { data } = this.props;
    let shouldSelectAllOption = true;
    const list = getList(data);
    Object.keys(list).forEach((item) => {
      if (!list[item].selected) {
        shouldSelectAllOption = false;
      }
    });
    return shouldSelectAllOption;
  }

  render() {
    const {
      filterKey,
      data,
      className,
      buttonsSize,
      uniqDefaultListId,
    } = this.props;

    const { isActive, listItemRefs, allOption } = this.state;

    return (
      <div
        ref={this.filterRef}
        className={classNames('Filter', 'FilterDropdown', 'FilterDropdownNonSearchable', filterKey, className, isActive ? 'active' : '')}
      >
        <h4>{getLabel(data)}</h4>
        <ArrowKeysListNavigation listItemRefs={listItemRefs}>
          {!isActive && (
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
          )}
          {isActive && (
          <div className="menu">
            <div className="row filter-label">
              <div className="col label-text">
                {i18n.t('Select')}
              </div>
              <div className="col col-auto ml-auto">
                <Icon type="triangle-up" />
              </div>
            </div>
            <NestableListItem
              className="all-option"
              data={allOption}
              onClick={this.allOptionSelected}
              key="all"
              listUniqId={uniqDefaultListId}
            />
            <FilterListItems
              list={getList(data)}
              onChange={this.onChange}
              setListItemRef={this.setListItemRef}
              uniqId={uniqDefaultListId}
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
FilterDropdownNonSearchableComp.defaultProps = {
  className: 'col-md-4 col-12',
};
const FilterDropdownNonSearchable = connect()(FilterDropdownNonSearchableComp);
export default FilterDropdownNonSearchable;
