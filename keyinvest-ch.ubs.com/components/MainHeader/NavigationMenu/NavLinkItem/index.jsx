import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createLocation } from 'history';
import { hasSubNavMenuItems, isNavItemActive } from '../NavigationMenu.helper';

const NavLinkItem = ({
  type,
  item,
  closeAll,
  onlyShowParentNavItems,
}) => {
  const isActive = (match, location) => isNavItemActive(match, location, item);
  const getNavItemUrl = () => {
    if (onlyShowParentNavItems && hasSubNavMenuItems(item)) {
      const [firstSubMenuItem] = item.submenu;
      return firstSubMenuItem.url;
    }
    return item.url;
  };
  return (
    <li className={`nav-item ${type}`}>
      <NavLink
        className="nav-link"
        activeClassName="active"
        to={createLocation(getNavItemUrl())}
        onClick={closeAll}
        exact={item.url === '/'}
        isActive={isActive}
      >
        {item.pageTitle}
      </NavLink>
    </li>
  );
};

NavLinkItem.propTypes = {
  closeAll: PropTypes.func,
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  onlyShowParentNavItems: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

NavLinkItem.defaultProps = {
  closeAll: () => {},
  onlyShowParentNavItems: false,
};

export default React.memo(NavLinkItem);
