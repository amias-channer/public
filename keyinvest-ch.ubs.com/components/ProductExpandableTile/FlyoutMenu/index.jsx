import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../Icon';
import './FlyoutMenu.scss';
import {
  addDocumentClickEventListeners,
  removeDocumentClickEventListeners,
} from '../../../utils/utils';

const FlyoutMenu = ({ children, buttonComponent, className }) => {
  const [isFlyoutMenuOpen, setFlyoutMenuOpen] = useState(false);
  const flyoutMenuRef = useRef(null);

  const onClickOutside = (event) => {
    if (flyoutMenuRef && flyoutMenuRef.current && !flyoutMenuRef.current.contains(event.target)) {
      setFlyoutMenuOpen(false);
      removeDocumentClickEventListeners(onClickOutside);
    }
  };

  const onFlyoutIconClicked = () => {
    if (!isFlyoutMenuOpen) {
      setFlyoutMenuOpen(true);
      addDocumentClickEventListeners(onClickOutside);
    } else {
      setFlyoutMenuOpen(false);
      removeDocumentClickEventListeners(onClickOutside);
    }
  };

  return (
    <div className={classNames('FlyoutMenu', className)} ref={flyoutMenuRef}>
      {!buttonComponent && (
        <Icon
          className={classNames('toggle-button', isFlyoutMenuOpen ? 'flyout-menu-open' : '')}
          type="more"
          onClick={onFlyoutIconClicked}
        />
      )}
      {!!buttonComponent && (
        <span
          role="button"
          tabIndex={0}
          onKeyPress={onFlyoutIconClicked}
          className={classNames('toggle-button', isFlyoutMenuOpen ? 'flyout-menu-open' : '')}
          onClick={onFlyoutIconClicked}
        >
          {buttonComponent}
        </span>
      )}
      {isFlyoutMenuOpen && (
      <div className="flyout-menu-wrapper">
        {children}
      </div>
      )}
    </div>
  );
};

FlyoutMenu.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType(
    [
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ],
  ),
  buttonComponent: PropTypes.oneOfType(
    [
      PropTypes.node,
      PropTypes.string,
    ],
  ),
};

FlyoutMenu.defaultProps = {
  className: '',
  children: {},
  buttonComponent: null,
};

export default React.memo(FlyoutMenu);
