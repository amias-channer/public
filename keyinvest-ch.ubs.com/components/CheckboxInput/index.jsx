import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './CheckboxInput.scss';

const CheckboxInput = ({
  className,
  name,
  onChange,
  label,
  checked,
  inline,
  value,
  labelClassName,
  fieldType,
  stateDataSource,
  index,
  isDisabled,
  onClick,
}) => {
  const onCheckboxChange = (e) => {
    onChange(e, stateDataSource, fieldType, index);
  };
  return (
    <div className={classNames('CheckboxInput', className)}>
      <div className={classNames(inline ? 'd-inline' : '', 'form-check form-check-inline', className)}>
        <div className={classNames(inline ? 'd-inline' : '', 'custom-control custom-checkbox')}>
          <input
            type="checkbox"
            className="custom-control-input"
            id={name}
            checked={checked}
            name={name}
            onChange={onCheckboxChange}
            value={value}
            disabled={isDisabled}
            onClick={onClick}
          />
          <label
            className={classNames(inline ? 'd-inline' : '', 'custom-control-label', labelClassName)}
            htmlFor={name}
          >
            <span>{label}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
CheckboxInput.propTypes = {
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  label: PropTypes.string,
  checked: PropTypes.bool,
  inline: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  fieldType: PropTypes.string,
  stateDataSource: PropTypes.arrayOf(PropTypes.any),
  index: PropTypes.number,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};

CheckboxInput.defaultProps = {
  className: '',
  labelClassName: '',
  onChange: () => {},
  onClick: () => {},
  label: '',
  checked: false,
  inline: false,
  value: undefined,
  fieldType: '',
  stateDataSource: [],
  index: undefined,
  isDisabled: false,
};

export default React.memo(CheckboxInput);
