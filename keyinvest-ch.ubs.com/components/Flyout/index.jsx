import React, { useRef } from 'react';
import './Flyout.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function Flyout(props) {
  const {
    children, activeId, id, onFlyoutClick,
  } = props;

  const node = useRef();

  const clickOutside = (e) => {
    if (node && node.current && node.current.contains(e.target)) {
      // inside click
      return;
    }
    onFlyoutClick(null);
    document.removeEventListener('mousedown', clickOutside);
  };

  const onClick = () => {
    onFlyoutClick(id);
    document.addEventListener('mousedown', clickOutside);
  };

  return (
    <div className={classNames('Flyout', (id === activeId ? 'active' : ''))}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div role="button" ref={node} className="toggle-button align-middle" tabIndex="-1" onClick={onClick}>
        <i className="icon-more" />
        {children}
      </div>
    </div>
  );
}

Flyout.propTypes = {
  children: PropTypes.oneOfType(
    [
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ],
  ),
  activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onFlyoutClick: PropTypes.func,
};

Flyout.defaultProps = {
  children: {},
  activeId: null,
  onFlyoutClick: () => {},
};

export default Flyout;
