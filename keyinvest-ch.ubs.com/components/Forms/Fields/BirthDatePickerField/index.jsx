/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { omit } from 'ramda';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import AbstractFormField from '../AbstractFormField';
import './BirthDatePickerField.scss';
import BirthDatePicker from '../../../DatePickers/BirthDatePicker';

class BirthDatePickerField extends AbstractFormField {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(newValue) {
    const { onFieldValueChange, fieldKey } = this.props;
    if (typeof onFieldValueChange === 'function') {
      onFieldValueChange(fieldKey, newValue);
    }
  }

  render() {
    const {
      className, fieldKey, value, format, onFocusChange,
    } = this.props;
    const props = omit([
      'className',
      'fieldKey',
      'value',
    ], this.props);
    return (
      <FormGroup className={classNames('FormField', 'BirthDatePickerField', className, this.getErrorMessage() ? 'not-valid' : '')}>
        <BirthDatePicker
          {...props}
          label={this.getLabel()}
          className="w-100"
          id={fieldKey}
          name={fieldKey}
          dateFormat={format || 'DD.MM.YYYY'}
          onDateChanged={this.onChange}
          initialDate={value}
          onFocusChange={onFocusChange}
        />
        {this.getErrorMessage()}
      </FormGroup>
    );
  }
}

BirthDatePickerField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  fieldKey: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onFieldValueChange: PropTypes.func,
  validation: PropTypes.string,
  validatorInstance: PropTypes.objectOf(PropTypes.any),
  onFocusChange: PropTypes.func,
};

BirthDatePickerField.defaultProps = {
  className: '',
  label: null,
  value: undefined,
  onFieldValueChange: undefined,
  validation: '',
  validatorInstance: {},
  onFocusChange: () => {},
};

export default BirthDatePickerField;
