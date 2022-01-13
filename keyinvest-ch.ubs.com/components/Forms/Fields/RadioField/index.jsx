import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import AbstractFormField from '../AbstractFormField';
import RadioInput from '../../../RadioInput';

class RadioField extends AbstractFormField {
  constructor(props) {
    super(props);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onItemSelect(e) {
    const newValue = e.target.value;
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
      <FormGroup className={classNames('FormField', 'RadioField', className, this.getErrorMessage() ? 'not-valid' : '')}>
        <div className="row">
          {items && items.map((item) => (
            <RadioInput
              className="col"
              key={item.value}
              id={item.value}
              name={fieldKey}
              value={item.value}
              label={item.label}
              onChange={this.onItemSelect}
              isChecked={value === item.value}
              onClick={onClick}
            />
          ))}
        </div>
        {this.getErrorMessage()}
      </FormGroup>
    );
  }
}

RadioField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  fieldKey: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onFieldValueChange: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.any),
  validation: PropTypes.string,
  validatorInstance: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
};

RadioField.defaultProps = {
  className: '',
  label: null,
  value: undefined,
  onFieldValueChange: undefined,
  items: [],
  validation: '',
  validatorInstance: {},
  onClick: () => {},
};

export default RadioField;
