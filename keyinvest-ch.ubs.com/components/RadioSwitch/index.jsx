import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import './RadioSwitch.scss';
import { omit } from 'ramda';
import Icon from '../Icon';
import i18n from '../../utils/i18n';

const RadioSwitch = (props) => {
  const {
    isChecked, handleChange, labelText, icon, onInfoIconClick, id, disabled,
  } = props;
  const getOnColor = () => (disabled ? '#a1a1a1' : '#6A7D39');
  const getOffColor = () => (disabled ? '#a1a1a1' : '#9A3D37');
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className="RadioSwitch" htmlFor={id}>
      {/* eslint-disable react/jsx-props-no-spreading */}
      <Switch
        {...omit(['labelText', 'icon', 'onInfoIconClick', 'id', 'isChecked', 'handleChange'], props)}
        disabled={disabled}
        height={20}
        width={66}
        checked={isChecked}
        onChange={handleChange}
        onColor={getOnColor()}
        offColor={getOffColor()}
        uncheckedIcon={(
          <div
            className="text unchecked-text"
          >
            {i18n.t('no')}
          </div>
        )}
        checkedIcon={(
          <div
            className="text checked-text"
          >
            {i18n.t('yes')}
          </div>
        )}
        className="react-switch"
        id={id}
      />
      {/* eslint-enable react/jsx-props-no-spreading */}
      <span className="label-text">{labelText}</span>
      {icon && (
        <Icon type="Information" onClick={onInfoIconClick} />
      )}
    </label>
  );
};

RadioSwitch.propTypes = {
  isChecked: PropTypes.bool,
  handleChange: PropTypes.func,
  labelText: PropTypes.string,
  id: PropTypes.string.isRequired,
  icon: PropTypes.node,
  onInfoIconClick: PropTypes.func,
  disabled: PropTypes.bool,
};

RadioSwitch.defaultProps = {
  isChecked: false,
  handleChange: () => {},
  labelText: '',
  icon: null,
  onInfoIconClick: () => {},
  disabled: false,
};

export default React.memo(RadioSwitch);
