import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { createLocation } from 'history';

function ListItems(props) {
  const {
    items, hrefKey, hrefText, closeAll,
  } = props;

  const listItems = items.map((item, index) => {
    if (item && item.isHidden !== true) {
      return (
        <NavLink
          className="dropdown-item nav-link"
          activeClassName="active"
          key={item.id ? item.id : index}
          to={createLocation(item[hrefKey] ? item[hrefKey] : '')}
          onClick={closeAll}
          exact={item[hrefKey] === '/'}
        >
          <span>{item[hrefText]}</span>
        </NavLink>
      );
    }
    return null;
  });
  const filteredListItems = listItems.filter((el) => el !== null && el !== undefined);
  return filteredListItems && filteredListItems.length > 0 && (
    <div className="dropdown-menu">
      {filteredListItems}
    </div>
  );
}

ListItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  hrefKey: PropTypes.string,
  hrefText: PropTypes.string,
  closeAll: PropTypes.func,
};

ListItems.defaultProps = {
  items: [],
  hrefKey: '#',
  hrefText: '',
  closeAll: null,
};

export default React.memo(ListItems);
