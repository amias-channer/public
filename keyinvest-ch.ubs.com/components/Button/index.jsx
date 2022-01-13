/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Button.scss';
import { omit } from 'ramda';

export const BUTTON_COLOR = {
  DARK: 'dark',
  OLIVE: 'olive',
  CHESTNUT: 'chestnut',
  ATLANTIC: 'atlantic',
  STANDARD: 'standard',
  ATLANTIC_DARK: 'atlantic-dark',
  TRANSPARENT: 'transparent',
  HIGHLIGHTED: 'highlighted',
};

export const BUTTON_SIZE = {
  SMALL: 'small',
  MEDIUM: 'medium',
  STANDARD: 'standard',
};

const Button = (props) => {
  const {
    color, size, className, children, RenderAs, isDisabled,
  } = props;
  return RenderAs && (
    <RenderAs
      {...omit(['RenderAs', 'className', 'isDisabled'], props)}
      className={classNames('Button', className, 'btn', `btn-size-${size}`, `btn-color-${color}`, isDisabled ? 'disabled' : '')}
    >
      {children}
    </RenderAs>
  );
};

Button.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  RenderAs: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
  ]),
  isDisabled: PropTypes.bool,
};

Button.defaultProps = {
  size: BUTTON_SIZE.STANDARD,
  color: BUTTON_COLOR.STANDARD,
  className: '',
  onClick: () => {},
  children: null,
  RenderAs: 'button',
  isDisabled: false,
};
export default React.memo(Button);
