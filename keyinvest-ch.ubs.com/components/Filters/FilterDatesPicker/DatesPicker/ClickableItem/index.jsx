import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ClickableItem.scss';

const ClickableItem = ({
  onClick, value, label, className, isActive, isDisabled,
}) => {
  const onClicked = () => typeof onClick === 'function' && onClick(value);
  return (
    <Button
      color="outline"
      type="button"
      className={classNames(
        'ClickableItem',
        className, isActive ? 'active' : '',
        !onClick || isDisabled ? 'no-pointer' : '',
      )}
      onClick={onClicked}
      disabled={isDisabled}
    >
      {label || value}
    </Button>
  );
};

ClickableItem.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

ClickableItem.defaultProps = {
  className: '',
  value: null,
  label: '',
  onClick: null,
  isActive: false,
  isDisabled: false,
};

export default React.memo(ClickableItem);
