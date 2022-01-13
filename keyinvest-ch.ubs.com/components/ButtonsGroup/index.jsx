import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './ButtonsGroup.scss';

const ButtonsGroup = ({ children, className }) => (<div className={classNames('ButtonsGroup', className)}>{ children }</div>);

ButtonsGroup.propTypes = {
  children: PropTypes.oneOfType(
    [
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ],
  ),
  className: PropTypes.string,
};

ButtonsGroup.defaultProps = {
  children: null,
  className: '',
};

export default React.memo(ButtonsGroup);
