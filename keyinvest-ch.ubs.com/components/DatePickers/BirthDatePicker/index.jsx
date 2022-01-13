/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { isInclusivelyBeforeDay } from 'react-dates';
import StandardDatePicker from '../StandardDatePicker';
import MonthYearPickerViews from './MonthYearPickerViews';
import {
  addDocumentClickEventListeners,
  removeDocumentClickEventListeners,
} from '../../../utils/utils';

const BirthDatePicker = (props) => {
  const [isMonthViewOpen, setIsMonthViewOpen] = useState(false);
  const [isYearViewOpen, setIsYearViewOpen] = useState(false);

  const datePickerRef = useRef(null);

  const onClickOutside = (event) => {
    if (datePickerRef
      && datePickerRef.current
      && !datePickerRef.current.contains(event.target)) {
      setIsMonthViewOpen(false);
      setIsYearViewOpen(false);
      removeDocumentClickEventListeners(onClickOutside);
    }
  };

  const setIsOpenMonthView = (isOpen) => {
    setIsMonthViewOpen(isOpen);
    addDocumentClickEventListeners(onClickOutside);
  };

  const setIsOpenYearView = (isOpen) => {
    setIsYearViewOpen(isOpen);
    addDocumentClickEventListeners(onClickOutside);
  };

  const renderMonthElement = (data) => {
    const { month, onMonthSelect, onYearSelect } = data;
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <MonthYearPickerViews
            month={month}
            onMonthSelect={onMonthSelect}
            onYearSelect={onYearSelect}
            isMonthViewOpen={isMonthViewOpen}
            isYearViewOpen={isYearViewOpen}
            setIsOpenMonthView={setIsOpenMonthView}
            setIsOpenYearView={setIsOpenYearView}
          />
        </div>
      </div>
    );
  };

  const { className, onFocusChange } = props;
  return (
    <StandardDatePicker
      {...props}
      renderMonthElement={renderMonthElement}
      isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
      className={classNames('BirthDatePicker', className, (isMonthViewOpen || isYearViewOpen) ? 'month-year-picker-view-open' : '')}
      onFocusChange={onFocusChange}
      innerRef={datePickerRef}
    />
  );
};

BirthDatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  onFocusChange: PropTypes.func,
};
BirthDatePicker.defaultProps = {
  className: '',
  onFocusChange: () => {},
};

export default React.memo(BirthDatePicker);
