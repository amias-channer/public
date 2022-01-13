import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Row } from 'reactstrap';
import { equals } from 'ramda';
import TextInput from '../../TextInput';
import FilterCharacters from './FilterCharacters';
import './FilterUnderlyingsDropdown.scss';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import FilterList from './FilterList';
import i18n from '../../../utils/i18n';
import {
  FILTER_TYPE_UNDERLYINGS_DROPDOWN,
  SUB_FILTER_TYPE_CHECKBOXES,
  SUB_FILTER_TYPE_INPUT_TEXT,
} from '../Filters.helper';
import dataSelector, { getAppliedFilters, getData } from './selectors';
import {
  DEFAULT_LIST_TYPE,
  DEFAULT_SELECTED_CHAR_ALL,
  getActiveItems,
  getAppliedFilterValueByType,
  getLabel,
  getSelectedListItems,
  MULTI_LIST_TYPE,
  SUB_FILTER_TYPE_CHARACTER,
  SUB_FILTER_TYPE_LIST_TYPE,
} from './FilterUnderlyingsDropdown.helper';
import Radio from '../../RadioInput';
import Logger from '../../../utils/logger';
import {
  filterAbstractResetAllListFilters,
  filterAbstractSetAppliedFilter,
} from '../FilterAbstract/actions';
import { defaultListFilterableUpdateFilterListItem } from '../../DefaultListFilterable/actions';
import ArrowKeysListNavigation from '../../ArrowKeysListNavigation';
import {
  isSingleItemInList,
  notEnterKeyPressed,
} from '../FilterAbstract/FilterAbstractDropdown/FilterAbstractDropdown.helper';
import ButtonsGroup from '../../ButtonsGroup';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../../Button';

export class FilterUnderlyingsDropdownComponent extends FilterAbstractDropdown {
  constructor(props) {
    super(props);
    this.listItemRefs = [];
    this.onListTypeSelection = this.onListTypeSelection.bind(this);
    this.onCharClick = this.onCharClick.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  componentDidMount() {
    const {
      data, uniqDefaultListId, filterKey, dispatch,
    } = this.props;
    const activeItems = getActiveItems(data);
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_CHECKBOXES,
      activeItems,
    ));
  }

  onListTypeSelection(e) {
    const { value } = e.target;
    const {
      dispatch, uniqDefaultListId, filterKey,
    } = this.props;
    this.resetListItemsRefs();
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_LIST_TYPE,
      value,
    ));
  }

  onCharClick(e) {
    const {
      dispatch, uniqDefaultListId, filterKey,
    } = this.props;
    this.resetListItemsRefs();
    const { letter } = e.target.dataset;
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_CHARACTER,
      letter,
    ));
  }

  onItemSelect(e) {
    const {
      appliedListFilters, dispatch, uniqDefaultListId, filterKey, level, dataSource,
    } = this.props;
    const itemKey = e.target.value;
    const { checked } = e.target;

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
    ));
  }

  onInputTextChange(e) {
    const {
      dispatch, uniqDefaultListId, filterKey,
    } = this.props;
    this.resetListItemsRefs();
    const searchText = e.target.value;
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_INPUT_TEXT,
      searchText,
    ));
  }

  handleClickOutside(event) {
    if (this.filterRef
        && this.filterRef.current
        && !this.filterRef.current.contains(event.target)) {
      this.applyFilters();
    }
  }

  getSelectedListItems() {
    const { syncedData } = this.props;
    return [
      ...getSelectedListItems(syncedData[DEFAULT_LIST_TYPE]),
      ...getSelectedListItems(syncedData[MULTI_LIST_TYPE]),
    ];
  }

  applyFilters() {
    const {
      filterKey, onFilterChange, level, syncedData, dispatch, uniqDefaultListId,
    } = this.props;

    const selectedItems = this.getSelectedListItems();

    if (equals(getActiveItems(syncedData), selectedItems)) {
      this.closeFilterMenu();
      return;
    }

    onFilterChange(filterKey, selectedItems, level);
    dispatch(filterAbstractResetAllListFilters(uniqDefaultListId));
    this.clearTextInput();
    this.closeFilterMenu();
  }

  setListItemRef(ref) {
    if (ref) {
      this.listItemRefs.push(ref);
    }
  }

  resetListItemsRefs() {
    this.listItemRefs = [];
  }

  onTextInputKeyDown(e) {
    if (notEnterKeyPressed(e)) {
      return;
    }
    const {
      data,
      appliedListFilters,
      filterKey,
      level,
      onFilterChange,
      syncedData,
      dispatch,
      uniqDefaultListId,
    } = this.props;
    const filterListType = getAppliedFilterValueByType(
      SUB_FILTER_TYPE_LIST_TYPE, DEFAULT_LIST_TYPE, appliedListFilters,
    );
    const [itemKey] = data[filterListType] && Object.keys(data[filterListType]);

    if (itemKey
      && isSingleItemInList(data[filterListType])
      && !data[filterListType][itemKey].selected) {
      onFilterChange(filterKey, [...getActiveItems(syncedData), itemKey], level);
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
      appliedListFilters,
      buttonsSize,
    } = this.props;

    const {
      isActive,
    } = this.state;

    const filterListType = getAppliedFilterValueByType(
      SUB_FILTER_TYPE_LIST_TYPE, DEFAULT_LIST_TYPE, appliedListFilters,
    );

    const selectedCharacter = getAppliedFilterValueByType(
      SUB_FILTER_TYPE_CHARACTER,
      DEFAULT_SELECTED_CHAR_ALL,
      appliedListFilters,
    );

    const selectedListItems = getAppliedFilterValueByType(
      SUB_FILTER_TYPE_CHECKBOXES,
      [],
      appliedListFilters,
    );

    return (
      <div
        ref={this.filterRef}
        className={classNames('Filter', 'FilterDropdown', 'FilterUnderlyingsDropdown', filterKey, className, isActive ? 'active' : '')}
      >
        <ArrowKeysListNavigation listItemRefs={this.listItemRefs}>
          <TextInput
            displayOutline={this.shouldDisplayFilterOutline()}
            placeholder={getLabel(data)}
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
            <div className="list">
              <div className="row">
                <div className="col-auto">
                  <FilterCharacters
                    onCharacterClick={this.onCharClick}
                    selectedCharacter={selectedCharacter}
                  />
                </div>
                <div className="col">
                  <div className="listTypes">
                    <ul>
                      {data && data[DEFAULT_LIST_TYPE] && data[MULTI_LIST_TYPE] && (
                      <li>
                        <Radio
                          id="underlyingList"
                          label={i18n.t('Single')}
                          name={DEFAULT_LIST_TYPE}
                          value={DEFAULT_LIST_TYPE}
                          isChecked={filterListType === DEFAULT_LIST_TYPE}
                          onChange={this.onListTypeSelection}
                        />
                      </li>
                      )}
                      {data && data[MULTI_LIST_TYPE] && (
                      <li>
                        <Radio
                          id="underlyingMultiList"
                          label={i18n.t('Multi-Underlying')}
                          name={MULTI_LIST_TYPE}
                          value={MULTI_LIST_TYPE}
                          isChecked={filterListType === MULTI_LIST_TYPE}
                          onChange={this.onListTypeSelection}
                        />
                      </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <Row>
                {data && data[filterListType] && (
                <FilterList
                  list={data[filterListType]}
                  onItemSelect={this.onItemSelect}
                  selectedListItems={selectedListItems}
                  selectedCharacter={selectedCharacter}
                  setListItemRef={this.setListItemRef}
                  appliedListFilters={appliedListFilters}
                />
                )}
              </Row>
            </div>
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

FilterUnderlyingsDropdownComponent.defaultProps = {
  type: FILTER_TYPE_UNDERLYINGS_DROPDOWN,
  buttonsSize: BUTTON_SIZE.MEDIUM,
  className: 'col-md-4 col-12',
};
const mapStateToProps = (state, ownProps) => (
  {
    data: dataSelector(state, ownProps),
    appliedListFilters: getAppliedFilters(state, ownProps),
    syncedData: getData(state, ownProps),
  });
const FilterUnderlyingsDropdown = connect(mapStateToProps)(FilterUnderlyingsDropdownComponent);
export default FilterUnderlyingsDropdown;
