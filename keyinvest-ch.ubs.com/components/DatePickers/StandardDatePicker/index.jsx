/* eslint-disable react/default-props-match-prop-types,react/jsx-props-no-spreading */
import React from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import { omit } from 'ramda';
import { SingleDatePicker, SingleDatePickerShape } from 'react-dates';
import {
  ANCHOR_LEFT,
  HORIZONTAL_ORIENTATION,
  ICON_AFTER_POSITION,
} from 'react-dates/lib/constants';
import SingleDatePickerPhrases from 'react-dates/lib/defaultPhrases';
import './StandardDatePicker.scss';
import Icon from '../../Icon';

class StandardDatePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focused: props.autoFocus,
      date: props.initialDate,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDateChange(date) {
    const { onDateChanged } = this.props;
    this.setState({ date });
    onDateChanged(date);
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
    const { onFocusChange } = this.props;
    if (typeof onFocusChange === 'function') {
      onFocusChange(focused);
    }
  }

  render() {
    const { focused, date } = this.state;
    const {
      label, dateFormat, className,
      innerRef,
    } = this.props;
    // autoFocus and initialDate are helper props for the example wrapper but are not
    // props on the SingleDatePicker itself and thus, have to be omitted.
    const props = omit([
      'autoFocus',
      'initialDate',
      'className',
      'dateFormat',
      'onDateChanged',
    ], this.props);
    return (
      <div className={classNames('StandardDatePicker', className, focused ? 'focused' : '')} ref={innerRef}>
        <div className="standard-date-picker-wrapper">
          <span className="top-label">{ label }</span>
          <SingleDatePicker
            {...props}
            id={props.id || 'date_input'}
            date={date}
            focused={focused}
            onDateChange={this.onDateChange}
            onFocusChange={this.onFocusChange}
            numberOfMonths={1}
            hideKeyboardShortcutsPanel
            displayFormat={() => dateFormat}
            placeholder={dateFormat}
            customInputIcon={<Icon type="calendar" />}
            inputIconPosition={ICON_AFTER_POSITION}
          />
        </div>
      </div>
    );
  }
}

StandardDatePicker.propTypes = {
  // example props for the demo
  autoFocus: PropTypes.bool,
  initialDate: momentPropTypes.momentObj,
  ...omit([
    'date',
    'onDateChange',
    'focused',
    'onFocusChange',
  ], SingleDatePickerShape),
  dateFormat: PropTypes.string,
  onDateChanged: PropTypes.func,
};

StandardDatePicker.defaultProps = {
  // example props for the demo
  autoFocus: false,
  initialDate: null,

  // input related props
  id: 'date',
  placeholder: 'Date',
  disabled: false,
  required: false,
  screenReaderInputMessage: '',
  showClearDate: false,
  showDefaultInputIcon: false,
  customInputIcon: null,
  block: false,
  small: false,
  regular: false,
  verticalSpacing: undefined,
  keepFocusOnInput: false,

  // calendar presentation and interaction related props
  renderMonthText: null,
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 2,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDate: false,
  isRTL: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  onClose() {},

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  // isOutsideRange: (day) => !isInclusivelyAfterDay(day, moment()),
  isDayHighlighted: () => {},

  // internationalization props
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  phrases: SingleDatePickerPhrases,
  dateFormat: 'DD.MM.YYYY',
  onDateChanged: () => {},
  onFocusChange: () => {},
};

export default StandardDatePicker;
