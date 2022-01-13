import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { clone } from 'ramda';
import { FilterAbstractComponent } from '../FilterAbstract';
import './FilterCheckbox.scss';
import {
  getAnotherValueFromList,
  getCheckboxIndexByValue,
  getCheckboxInputs,
  getCheckedFilteredItems,
} from './FilterCheckbox.helper';
import Logger from '../../../utils/logger';
import { isEmptyData } from '../../../utils/utils';

export class FilterCheckboxComponent extends FilterAbstractComponent {
  constructor(props) {
    super(props);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onCheckboxChange(e) {
    const {
      data, onFilterChange, filterKey, level,
    } = this.props;
    const checkboxInputs = clone(getCheckboxInputs(data));
    const { checked } = e.target;
    const { value } = e.target;

    if (!value) {
      Logger.error('CheckboxInput value not set, please make sure the value of each checkbox filter is set!');
      return;
    }

    if (checkboxInputs.length > 0) {
      const indexToBeUpdated = getCheckboxIndexByValue(value, checkboxInputs);
      if (checkboxInputs[indexToBeUpdated]) {
        checkboxInputs[indexToBeUpdated].selected = checked;
      }
      const checkedItems = [];
      const filteredItems = getCheckedFilteredItems(checkboxInputs);

      if (data.shouldAtLeastOneOptionSelected && (!filteredItems || isEmptyData(filteredItems))) {
        /* Check if the backend provided the flag "shouldAtLeastOneOptionSelected",
        then the filter should not have 0 checked items
        The logic is to check the other item which was not clicked */
        checkedItems.push(getAnotherValueFromList(value, checkboxInputs));
      } else {
        filteredItems.map((item) => (checkedItems.push(item.value)));
      }

      onFilterChange(filterKey, checkedItems, level);
    }
  }

  render() {
    const { data, className } = this.props;
    const checkboxInputs = getCheckboxInputs(data);
    return (
      <div className={classNames('Filter', 'FilterCheckbox', className)}>
        <h4>{ data.label }</h4>
        {checkboxInputs.map((item) => (
          <div className="form-check form-check-inline" key={item.value}>
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id={item.value} name={item.value} value={item.value} checked={item.selected} onChange={this.onCheckboxChange} disabled={!item.visible} />
              <label className={classNames('custom-control-label', item.visible ? '' : 'disabled')} htmlFor={item.value}><span>{ item.label }</span></label>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

FilterCheckboxComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
};

FilterCheckboxComponent.defaultProps = {
  data: {
    checkboxGroup: {
      input: [],
    },
  },
};

const FilterCheckbox = connect()(FilterCheckboxComponent);
export default FilterCheckbox;
