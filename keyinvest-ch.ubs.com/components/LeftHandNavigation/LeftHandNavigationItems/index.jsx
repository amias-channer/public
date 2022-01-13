import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import { createLocation } from 'history';
import { oneOrMoreVisibleNavigationItem } from '../../../utils/utils';

function LeftHandNavigationItems(props) {
  const { links } = props;
  const [subLinksOpen, setSubLinksOpen] = useState(null);

  const isOpen = (element) => subLinksOpen === element.url
    || (subLinksOpen !== false && element.active);

  const toggleSubLinksOpen = (element) => () => {
    if (element.submenu) {
      if (!isOpen(element)) {
        return setSubLinksOpen(element.url);
      }
    }
    return setSubLinksOpen(false);
  };

  const listItems = links.map((element) => {
    if (element && element.isHidden !== true) {
      return (
        <div key={element.url}>
          <div className="link-wrapper">
            <NavLink
              to={createLocation(element.url) || '#'}
              className={classNames('link', element.submenu && oneOrMoreVisibleNavigationItem(element.submenu) ? 'has-sub-links' : '', isOpen(element) ? 'sub-link-open' : '')}
            >
              {element.pageTitle}
            </NavLink>

            {element.submenu && oneOrMoreVisibleNavigationItem(element.submenu)
            && (
              <Button
                type="button"
                color=""
                onClick={toggleSubLinksOpen(element)}
                className={classNames('toggle', isOpen(element) ? 'icon-arrow_02_up' : 'icon-arrow_02_down')}
              />
            )}
          </div>
          {element.submenu && oneOrMoreVisibleNavigationItem(element.submenu) && isOpen(element)
          && <LeftHandNavigationItems links={element.submenu} isSubNav />}
        </div>
      );
    }
    return null;
  });

  const { isSubNav, className } = props;
  return (
    <div
      className={classNames('LeftHandNavigationItems', className, isSubNav ? 'is-sub-nav' : '')}
    >
      {listItems}
    </div>
  );
}

LeftHandNavigationItems.propTypes = {
  isSubNav: PropTypes.bool,
  className: PropTypes.string,
  links: PropTypes.arrayOf(PropTypes.object),
};

LeftHandNavigationItems.defaultProps = {
  isSubNav: false,
  className: '',
  links: [],
};
export default React.memo(LeftHandNavigationItems);
