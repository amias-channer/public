import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import AbstractFormField from '../AbstractFormField';
import CheckboxInput from '../../../CheckboxInput';

class CheckboxField extends AbstractFormField {
  constructor(props) {
    super(props);
    this.onFieldValueChange = this.onFieldValueChange.bind(this);
  }

  onFieldValueChange(e) {
    const isChecked = e.target.checked;
    const { onFieldValueChange, fieldKey } = this.props;
    if (typeof onFieldValueChange === 'function') {
      onFieldValueChange(fieldKey, isChecked);
    }

    this.onBlur();
  }

  render() {
    const {
      className, fieldKey, value, onClick,
    } = this.props;
    return (
      <FormGroup className={classNames('FormField', 'CheckboxField', className, this.getErrorMessage() ? 'not-valid' : '')}>
        <CheckboxInput
          checked={value}
          label={this.getLabel()}
          className={classNames('ml-3', this.getErrorMessage() ? 'not-valid' : '')}
          id={fieldKey}
          name={fieldKey}
          onChange={this.onFieldValueChange}
          onClick={onClick}
        />
        {this.getErrorMessage()}
      </FormGroup>
    );
  }
}

CheckboxField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  fieldKey: PropTypes.string.isRequired,
  value: PropTypes.bool,
  onFieldValueChange: PropTypes.func,
  validation: PropTypes.string,
  validatorInstance: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
};

CheckboxField.defaultProps = {
  className: '',
  label: null,
  value: undefined,
  onFieldValueChange: undefined,
  validation: '',
  validatorInstance: {},
  onClick: () => {},
};

export default CheckboxField;
