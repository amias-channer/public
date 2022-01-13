import React from 'react';
import PropTypes from 'prop-types';
import i18n from '../../../../utils/i18n';
import ValidationErrorMessage from '../../ValidationErrorMessage';
import './AbstractFormField.scss';

class AbstractFormField extends React.Component {
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

  onBlur() {
    const {
      validatorInstance, validation,
    } = this.props;
    if (validation) {
      validatorInstance.showMessageFor(this.getLabel());
      this.forceUpdate();
    }
  }

  getErrorMessage() {
    const {
      value, validation, validatorInstance,
    } = this.props;
    if (validation) {
      const message = validatorInstance.message(this.getLabel(), value, validation);
      if (message) {
        return (
          <ValidationErrorMessage message={message} />
        );
      }
    }
    return null;
  }

  getLabel() {
    const {
      fieldKey, label, validation,
    } = this.props;
    return label || i18n.t(fieldKey) + (validation.indexOf('required') > -1 ? '*' : '');
  }

  render() {
    return null;
  }
}

AbstractFormField.propTypes = {
  label: PropTypes.string,
  fieldKey: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onFieldValueChange: PropTypes.func,
  validation: PropTypes.string,
  validatorInstance: PropTypes.objectOf(PropTypes.any),
};

AbstractFormField.defaultProps = {
  label: null,
  value: undefined,
  onFieldValueChange: undefined,
  validation: '',
  validatorInstance: {},
};

export default AbstractFormField;
