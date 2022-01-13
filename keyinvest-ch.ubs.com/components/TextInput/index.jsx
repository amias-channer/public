import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import classNames from 'classnames';
import './TextInput.scss';
import { KEYBOARD_KEY_ENTER_CODE } from '../../utils/utils';

function TextInput(props) {
  const {
    id, title, name, placeholder, onChange, onClick, showIcon, value, onBlur, dataInputType,
    isDisabled, type, isActive, onKeyDown, textInputElementRef, displayOutline, className, min,
  } = props;

  const onInputBlur = (e) => {
    onBlur(e);
  };

  const onEnterKeyPress = (e) => {
    if (e.keyCode === KEYBOARD_KEY_ENTER_CODE) {
      onBlur(e);
    }
  };

  const shouldDisplayTitle = () => {
    if (isActive || value === 0) {
      return true;
    }
    return !!value;
  };

  const RenderAs = type === 'textarea' ? Input : 'input';
  return (
    <div className={classNames('TextInput', className)} role="presentation" onClick={onClick}>
      <div className={classNames('input-container', isDisabled ? 'disabled' : '')}>
        <div className={classNames('input-group', displayOutline ? 'outline' : '')}>
          {shouldDisplayTitle() && (<span className="title">{title}</span>)}
          {RenderAs && (
          <RenderAs
            ref={textInputElementRef}
            type={type}
            className="form-control"
            name={name}
            id={id}
            onChange={onChange}
            placeholder={isActive ? undefined : placeholder}
            onBlur={onInputBlur}
            value={value}
            data-input-type={dataInputType}
            onKeyDown={onKeyDown || onEnterKeyPress}
            min={min}
          />
          )}
          {showIcon && (
            <div className="input-group-append">
              <span className="input-group-text"><i className={classNames(isActive ? 'icon-triangle-up' : 'icon-triangle-down')} /></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

TextInput.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  dataInputType: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  showIcon: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textInputElementRef: PropTypes.objectOf(PropTypes.any),
  displayOutline: PropTypes.bool,
  min: PropTypes.number,
};

TextInput.defaultProps = {
  id: undefined,
  className: '',
  dataInputType: '',
  title: '',
  name: '',
  placeholder: '',
  onChange: () => {},
  onKeyDown: null,
  onClick: () => {},
  onBlur: () => {},
  showIcon: false,
  value: undefined,
  type: 'text',
  isDisabled: false,
  isActive: false,
  textInputElementRef: undefined,
  displayOutline: false,
  min: undefined,
};

export default React.memo(TextInput);
