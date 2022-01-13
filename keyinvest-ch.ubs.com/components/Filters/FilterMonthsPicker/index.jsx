import React from 'react';
import classNames from 'classnames';
import { produce } from 'immer';
import {
  without, equals, pathOr, has,
} from 'ramda';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import './FilterMonthsPicker.scss';
import MonthsPicker from './MonthsPicker';
import ButtonsGroup from '../../ButtonsGroup';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../../Button';
import i18n from '../../../utils/i18n';
import {
  getCurrentYear,
  getEnabledMonths,
  getListOfYearsBetween,
  getMaxYearFromEnabledMonths,
  getMonthsShort,
  getMonthsShortToNumericMap,
  getSelectedMonths,
} from './FilterMonthsPicker.helper';
import RadioInput from '../../RadioInput';
import { isEmptyData } from '../../../utils/utils';

class FilterMonthsPicker extends FilterAbstractDropdown {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      selectedMonths: getSelectedMonths(data),
    };
    this.onMonthSelectionToggle = this.onMonthSelectionToggle.bind(this);
    this.selectOpenEnd = this.selectOpenEnd.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    const selectedMonths = getSelectedMonths(data);
    if (!equals(selectedMonths, getSelectedMonths(prevProps.data))) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(produce((draft) => {
        draft.selectedMonths = selectedMonths;
      }));
    }
  }

  onMonthSelectionToggle = (monthYearDate, isSelected) => {
    const { selectedMonths } = this.state;
    if (isSelected && selectedMonths.indexOf(monthYearDate) < 0) {
      this.setState(produce((draft) => {
        draft.selectedMonths.push(monthYearDate);
        draft.selectedMonths = without([this.getOpenEndTimestamp()], draft.selectedMonths);
      }));
    }

    if (!isSelected && selectedMonths.indexOf(monthYearDate) >= 0) {
      this.setState(produce((draft) => {
        draft.selectedMonths = without([monthYearDate], selectedMonths);
      }));
    }
  };

  applyFilters() {
    const { selectedMonths } = this.state;
    const {
      onFilterChange, filterKey, level, data,
    } = this.props;
    if (equals(selectedMonths, getSelectedMonths(data))) {
      this.closeFilterMenu();
      return;
    }
    onFilterChange(filterKey, selectedMonths, level);
    this.closeFilterMenu();
  }

  setSelectedMonths(selectedMonths) {
    this.setState(produce((draft) => {
      draft.selectedMonths = selectedMonths;
    }));
  }

  getOpenEndTimestamp() {
    return pathOr(null, ['data', 'openEndDate'], this.props);
  }

  selectOpenEnd() {
    this.setSelectedMonths([this.getOpenEndTimestamp()]);
  }

  shouldDisplayFilterOutline() {
    const { data } = this.props;
    const FILTER_DATA_ACTIVE_KEY = 'selected';
    const hasActive = has(FILTER_DATA_ACTIVE_KEY);
    return data && hasActive(data) && !isEmptyData(Object.keys(data[FILTER_DATA_ACTIVE_KEY]));
  }

  render() {
    const { className, data } = this.props;
    const { isActive, selectedMonths } = this.state;
    const enabledMonths = getEnabledMonths(data);
    const years = getListOfYearsBetween(
      getCurrentYear(), getMaxYearFromEnabledMonths(enabledMonths),
    );
    const months = getMonthsShort();
    const monthsShortToNumericMap = getMonthsShortToNumericMap(months);
    const openEndTimestamp = this.getOpenEndTimestamp();
    return (
      <div ref={this.filterRef} className={classNames('Filter', 'FilterDropdown', 'FilterMonthsPicker', className, isActive ? 'active' : '')}>
        <button
          type="button"
          className={classNames('btn btn-default filter-toggle-button', this.shouldDisplayFilterOutline() ? 'outline' : '')}
          onClick={this.openFilterMenu}
        >
          <span className="selected-item">{i18n.t('Expiry')}</span>
          <div className="dropdown-radio-icon">
            <i className="icon-triangle-down" />
          </div>
        </button>
        {isActive && (
          <div className="menu">
            {openEndTimestamp && (
            <div className="open-end">
              <RadioInput
                value={openEndTimestamp}
                label={i18n.t('Open End')}
                isChecked={openEndTimestamp === selectedMonths[0]}
                onClick={this.selectOpenEnd}
              />
            </div>
            )}
            <MonthsPicker
              years={years}
              months={months}
              monthsShortToNumericMap={monthsShortToNumericMap}
              selectedMonths={selectedMonths}
              enabledMonths={enabledMonths}
              onMonthSelected={this.onMonthSelectionToggle}
            />
            <div className="row">
              <div className="col">
                <ButtonsGroup className="buttons">
                  <Button className="button-apply" color={BUTTON_COLOR.OLIVE} size={BUTTON_SIZE.MEDIUM} onClick={this.applyFilters}>{i18n.t('Apply')}</Button>
                  <Button className="button-cancel" color={BUTTON_COLOR.STANDARD} size={BUTTON_SIZE.MEDIUM} onClick={this.cancelFilters}>{i18n.t('Cancel')}</Button>
                </ButtonsGroup>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default FilterMonthsPicker;
