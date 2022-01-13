import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import './DropdownField.scss';
import StandardDropdown from '../../../StandardDropdown';
import AbstractFormField from '../AbstractFormField';

class DropdownField extends AbstractFormField {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
  }

  onItemSelect(e, value) {
    let newValue;
    if (typeof value !== 'undefined') {
      newValue = value;
    } else {
      newValue = e.target.value;
    }
    const { onFieldValueChange, fieldKey } = this.props;
    if (typeof onFieldValueChange === 'function') {
      onFieldValueChange(fieldKey, newValue);
    }
  }

  render() {
    const {
      className, fieldKey, value, items, onClick,
    } = this.props;
    return (
      <FormGroup className={classNames('FormField', 'DropdownField', className, this.getErrorMessage() ? 'not-valid' : '')}>
        <StandardDropdown
          className={this.getErrorMessage() ? 'not-valid' : ''}
          id={fieldKey}
          name={fieldKey}
          onBlur={this.onBlur}
          onClick={onClick}
          placeHolderText={this.getLabel()}
          items={items}
          onItemSelect={this.onItemSelect}
          activeItem={value}
        />
        {this.getErrorMessage()}
      </FormGroup>
    );
  }
}

DropdownField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  fieldKey: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onFieldValueChange: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.any),
  validation: PropTypes.string,
  validatorInstance: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
};

DropdownField.defaultProps = {
  className: '',
  label: null,
  value: undefined,
  onFieldValueChange: undefined,
  items: [],
  validation: '',
  validatorInstance: {},
  onClick: () => {},
};

export default DropdownField;
