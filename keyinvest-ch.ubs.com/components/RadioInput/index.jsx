import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './RadioInput.scss';

function RadioInput(props) {
  const {
    className, id, isChecked, label, name, value, onChange,
    disabled, onClick, onkeydown,
  } = props;
  return (
    <div
      className={classNames('RadioInput', 'custom-control', 'custom-radio', className)}
    >
      <input
        className="custom-control-input"
        type="radio"
        name={name}
        id={id}
        value={value}
        checked={isChecked}
        onChange={onChange}
        disabled={disabled}
      />
      <label
        tabIndex={-1}
        role="presentation"
        className="custom-control-label"
        htmlFor={id}
        onClick={onClick}
        onKeyDown={onkeydown}
      >
        {label}
      </label>
    </div>
  );
}

RadioInput.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]).isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onkeydown: PropTypes.func,
  disabled: PropTypes.bool,
};

RadioInput.defaultProps = {
  className: '',
  isChecked: false,
  disabled: false,
  onChange: () => {},
  onClick: () => {},
  onkeydown: () => {},
};

export default React.memo(RadioInput);
