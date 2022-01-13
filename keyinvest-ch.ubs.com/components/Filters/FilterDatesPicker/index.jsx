import React from 'react';
import produce from 'immer';
import {
  has, pathOr, without, equals,
} from 'ramda';
import classNames from 'classnames';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import './FilterDatesPicker.scss';
import DatesPicker from './DatesPicker';
import ButtonsGroup from '../../ButtonsGroup';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../../Button';
import i18n from '../../../utils/i18n';
import { isDateInList } from '../Filters.helper';
import RadioInput from '../../RadioInput';
import { isEmptyData } from '../../../utils/utils';
import { getMaxTimestamp } from './FilterDatesPicker.helper';

class FilterDatesPicker extends FilterAbstractDropdown {
  constructor(props) {
    super(props);
    this.setSelectedDates = this.setSelectedDates.bind(this);
    this.toggleDate = this.toggleDate.bind(this);
    this.selectOpenEnd = this.selectOpenEnd.bind(this);
    this.state = {
      selectedDates: pathOr([], ['data', 'selected'], props),
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    const currentSelectedDates = pathOr([], ['selected'], data);
    const prevSelectedDates = pathOr([], ['selected'], prevProps.data);
    if (!equals(currentSelectedDates, prevSelectedDates)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(produce((draft) => {
        draft.selectedDates = currentSelectedDates;
      }));
    }
  }

  setSelectedDates(selectedDates) {
    this.setState(produce((draft) => {
      draft.selectedDates = selectedDates;
    }));
  }

  getOpenEndTimestamp() {
    return pathOr(null, ['data', 'openEndDate'], this.props);
  }

  selectOpenEnd() {
    this.setSelectedDates([this.getOpenEndTimestamp()]);
  }

  toggleDate(date) {
    const { selectedDates } = this.state;
    const { singleDatePicker } = this.props;

    // Remove Open End timestamp if it was added before
    const dates = without([this.getOpenEndTimestamp()], selectedDates);

    if (isDateInList(date, selectedDates)) {
      this.setSelectedDates(!singleDatePicker ? without([date], dates) : []);
    } else {
      this.setSelectedDates(!singleDatePicker ? [...dates, date] : [date]);
    }
  }

  applyFilters() {
    const { selectedDates } = this.state;
    const { onFilterChange, filterKey, level } = this.props;
    onFilterChange(filterKey, selectedDates, level);
    this.closeFilterMenu();
  }

  shouldDisplayFilterOutline() {
    const { data } = this.props;
    const FILTER_DATA_ACTIVE_KEY = 'selected';
    const hasActive = has(FILTER_DATA_ACTIVE_KEY);
    return data && hasActive(data) && !isEmptyData(Object.keys(data[FILTER_DATA_ACTIVE_KEY]));
  }

  render() {
    const { className, data } = this.props;
    const { isActive, selectedDates } = this.state;
    const openEndTimestamp = this.getOpenEndTimestamp();
    return (
      <div
        ref={this.filterRef}
        className={classNames('Filter', 'FilterDropdown', 'FilterDatesPicker', className, isActive ? 'active' : '')}
      >
        <button
          type="button"
          className={classNames('btn btn-default', this.shouldDisplayFilterOutline() ? 'outline' : '')}
          onClick={this.openFilterMenu}
        >
          <span className="selected-item">{data.label}</span>
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
                  isChecked={openEndTimestamp === selectedDates[0]}
                  onClick={this.selectOpenEnd}
                />
              </div>
            )}
            <DatesPicker
              className="mb-1"
              toggleDate={this.toggleDate}
              activeDates={selectedDates}
              enabledDates={data.enabledDates}
              maxDate={getMaxTimestamp(data.enabledDates)}
            />
            <div className="row">
              <div className="col">
                <ButtonsGroup className="buttons">
                  <Button
                    className="button-apply"
                    color={BUTTON_COLOR.OLIVE}
                    size={BUTTON_SIZE.MEDIUM}
                    onClick={this.applyFilters}
                  >
                    {i18n.t('Apply')}
                  </Button>
                  <Button
                    className="button-cancel"
                    color={BUTTON_COLOR.STANDARD}
                    size={BUTTON_SIZE.MEDIUM}
                    onClick={this.cancelFilters}
                  >
                    {i18n.t('Cancel')}
                  </Button>
                </ButtonsGroup>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FilterDatesPicker;
