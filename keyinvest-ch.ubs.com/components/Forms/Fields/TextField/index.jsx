/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import TextInput from '../../../TextInput';
import AbstractFormField from '../AbstractFormField';

class TextField extends AbstractFormField {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onChange(e) {
    const newValue = e.target.value;
    const { onFieldValueChange, fieldKey } = this.props;

    if (typeof onFieldValueChange === 'function') {
      onFieldValueChange(fieldKey, newValue);
    }
  }

  render() {
    const {
      className, fieldKey, value, type,
    } = this.props;
    return (
      <FormGroup className={classNames('FormField', 'TextField', className, this.getErrorMessage() ? 'not-valid' : '')}>
        <TextInput
          {...this.props}
          className={this.getErrorMessage() ? 'not-valid' : ''}
          placeholder={this.getLabel()}
          title={this.getLabel()}
          value={value}
          onChange={this.onChange}
          id={fieldKey}
          name={fieldKey}
          type={type}
          onBlur={this.onBlur}
        />
        {this.getErrorMessage()}
      </FormGroup>
    );
  }
}

TextField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  fieldKey: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onFieldValueChange: PropTypes.func,
  type: PropTypes.string,
  validation: PropTypes.string,
  validatorInstance: PropTypes.objectOf(PropTypes.any),
};

TextField.defaultProps = {
  className: '',
  label: null,
  value: undefined,
  onFieldValueChange: undefined,
  type: 'text',
  validation: '',
  validatorInstance: {},
};

export default TextField;
