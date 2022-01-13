import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { FilterAbstractComponent } from '../FilterAbstract';
import './FilterRange.scss';
import TextInput from '../../TextInput';
import Logger from '../../../utils/logger';
import {
  areEqualValues,
  EMPTY_STRING,
  getCurrentAppliedRangeFilters,
  getInitialEndValue,
  getInitialStartValue,
  getInitialValueByType,
  getSliderField,
  INPUT_TYPE_END,
  INPUT_TYPE_START, isAppliedFilterValuesSet,
  isNotDefaultInputValue,
  RANGE_FILTER_END_KEY,
  RANGE_FILTER_START_KEY,
} from './FilterRange.helper';
import { SUB_FILTER_TYPE_INPUT_TEXT_RANGE } from '../Filters.helper';
import { filterAbstractSetAppliedFilter } from '../FilterAbstract/actions';
import { getAppliedFilters, getData } from './selectors';

export class FilterRangeComponent extends FilterAbstractComponent {
  constructor(props) {
    super(props);
    const {
      data, dispatch, uniqDefaultListId, filterKey,
    } = this.props;
    this.inputRefs = {
      [INPUT_TYPE_START]: React.createRef(),
      [INPUT_TYPE_END]: React.createRef(),
    };
    const initialData = {
      [INPUT_TYPE_START]: getInitialStartValue(data),
      [INPUT_TYPE_END]: getInitialEndValue(data),
      currentClickedInput: null,
    };
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_INPUT_TEXT_RANGE,
      initialData,
    ));
    this.onRangeChange = this.onRangeChange.bind(this);
    this.onTextInputChange = this.onTextInputChange.bind(this);
    this.onTextInputClick = this.onTextInputClick.bind(this);
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch, uniqDefaultListId, filterKey, data, appliedFilters,
    } = this.props;
    if (getSliderField(RANGE_FILTER_START_KEY, data)
      !== getSliderField(RANGE_FILTER_START_KEY, prevProps.data)
      || getSliderField(RANGE_FILTER_END_KEY, data)
      !== getSliderField(RANGE_FILTER_END_KEY, prevProps.data)
      || !isAppliedFilterValuesSet(appliedFilters)
    ) {
      dispatch(filterAbstractSetAppliedFilter(
        uniqDefaultListId,
        filterKey,
        SUB_FILTER_TYPE_INPUT_TEXT_RANGE,
        {
          [INPUT_TYPE_START]: getInitialStartValue(data),
          [INPUT_TYPE_END]: getInitialEndValue(data),
          currentClickedInput: null,
        },
      ));
    }
  }

  onRangeChange(e) {
    const {
      filterKey, onFilterChange, level, appliedFilters, data,
    } = this.props;

    let changedValue = parseInt(e.target.value, 10);
    if (Number.isNaN(changedValue)) {
      changedValue = e.target.value;
    }
    const { inputType } = e.target.dataset;
    const currentAppliedRangeFilters = getCurrentAppliedRangeFilters(appliedFilters);
    if (areEqualValues(changedValue, currentAppliedRangeFilters[inputType])) {
      return;
    }

    if (typeof changedValue !== 'undefined' && changedValue !== null) {
      const rangeData = {
        sliderStart: currentAppliedRangeFilters[INPUT_TYPE_START] || getInitialStartValue(data),
        sliderEnd: currentAppliedRangeFilters[INPUT_TYPE_END] || getInitialEndValue(data),
      };
      Logger.info('FILTER_RANGE', 'CALLING ON FILTER CHANGE OF PARENT WITH', filterKey, rangeData);
      onFilterChange(filterKey, rangeData, level);
    }
  }

  onTextInputChange(e) {
    const { inputType } = e.target.dataset;
    const { value } = e.target;
    const {
      dispatch, uniqDefaultListId, filterKey, appliedFilters,
    } = this.props;
    const currentAppliedFilters = getCurrentAppliedRangeFilters(appliedFilters);
    const updatedValue = { ...currentAppliedFilters, [inputType]: value };
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_INPUT_TEXT_RANGE,
      updatedValue,
    ));
  }

  onTextInputClick(e) {
    const { inputType } = e.target.dataset;
    const {
      appliedFilters, dispatch, uniqDefaultListId, filterKey,
    } = this.props;
    const currentAppliedFilters = getCurrentAppliedRangeFilters(appliedFilters);
    const updatedValue = {
      ...currentAppliedFilters,
      [inputType]: EMPTY_STRING,
      currentClickedInput: inputType,
    };
    this.registerEventListener();
    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_INPUT_TEXT_RANGE,
      updatedValue,
    ));
  }

  isClickedOutsideForInputType(inputType, event) {
    return !!(this.inputRefs
      && this.inputRefs[inputType]
      && this.inputRefs[inputType].current
      && !this.inputRefs[inputType].current.contains(event.target));
  }

  handleClickOutside(event) {
    const {
      data, appliedFilters, dispatch, uniqDefaultListId, filterKey,
    } = this.props;
    const currentAppliedRangeFilters = getCurrentAppliedRangeFilters(appliedFilters);
    const { currentClickedInput } = currentAppliedRangeFilters;

    if (!currentClickedInput) {
      this.unregisterEventListener();
      return;
    }

    if (this.isClickedOutsideForInputType(currentClickedInput, event)) {
      if (areEqualValues(EMPTY_STRING, currentAppliedRangeFilters[currentClickedInput])) {
        const initialInputValue = getInitialValueByType(currentClickedInput, data);
        dispatch(filterAbstractSetAppliedFilter(
          uniqDefaultListId,
          filterKey,
          SUB_FILTER_TYPE_INPUT_TEXT_RANGE,
          {
            ...currentAppliedRangeFilters,
            [currentClickedInput]: initialInputValue,
          },
        ));
      }
    }
  }

  shouldDisplayFilterOutline(inputType) {
    const { data } = this.props;
    return isNotDefaultInputValue(inputType, data);
  }

  render() {
    const { data, className, appliedFilters } = this.props;
    const currentAppliedFilters = getCurrentAppliedRangeFilters(appliedFilters);
    const { start, end } = currentAppliedFilters;
    return (
      <div className={classNames('Filter', 'FilterRange', className)}>
        <div className="filter-container">
          <h4>{ data.label }</h4>
          <Row>
            <div className="col-6 text-input-column">
              <TextInput
                placeholder="Min."
                name="minval"
                title="Min."
                value={start}
                onBlur={this.onRangeChange}
                onChange={this.onTextInputChange}
                dataInputType={INPUT_TYPE_START}
                displayOutline={this.shouldDisplayFilterOutline(RANGE_FILTER_START_KEY)}
                onClick={this.onTextInputClick}
                textInputElementRef={this.inputRefs.start}
              />
            </div>
            <div className="col-6 text-input text-input-column">
              <TextInput
                placeholder="Max."
                name="maxval"
                title="Max."
                value={end}
                onBlur={this.onRangeChange}
                onChange={this.onTextInputChange}
                dataInputType={INPUT_TYPE_END}
                displayOutline={this.shouldDisplayFilterOutline(RANGE_FILTER_END_KEY)}
                onClick={this.onTextInputClick}
                textInputElementRef={this.inputRefs.end}
              />
            </div>
          </Row>
        </div>
      </div>
    );
  }
}

FilterRangeComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
};

FilterRangeComponent.defaultProps = {
  data: {
    label: '',
    slider: {
      min: '',
      max: '',
    },
  },
};

const mapStatToProps = (state, props) => ({
  data: getData(state, props),
  appliedFilters: getAppliedFilters(state, props),
});

const FilterRange = connect(mapStatToProps)(FilterRangeComponent);
export default FilterRange;
