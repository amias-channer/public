import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './StandardDropdown.scss';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

const StandardDropdown = ({
  placeHolderText, items, onItemSelect, activeItem, onBlur, onClick, className,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const getActiveItemLabelByValue = () => {
    let activeItemLabel = typeof activeItem === 'string' ? activeItem : '';
    items.forEach((item) => {
      if (typeof item === 'object' && item.value === activeItem) {
        activeItemLabel = item.label;
      }
    });
    return activeItemLabel;
  };

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      className={classNames('StandardDropdown', activeItem ? 'active' : '', dropdownOpen ? 'open' : '', className)}
      onBlur={onBlur}
      onClick={onClick}
    >
      <div className="dropdown-head">
        <DropdownToggle color="outline" caret>
          <span className="dropdown-toggle-placeholder">{placeHolderText}</span>
          {activeItem && (<span className="dropdown-toggle-activeItem">{getActiveItemLabelByValue()}</span>)}
        </DropdownToggle>
      </div>
      <DropdownMenu>
        {items.map((item) => (
          <Fragment key={item.value || item}>
            {typeof item === 'string' && (
              <DropdownItem
                active={activeItem === item}
                onClick={onItemSelect}
              >
                {item}
              </DropdownItem>
            )}
            {typeof item === 'object' && (
              <DropdownItem
                key={item.value}
                active={activeItem === item.value}
                onClick={(e) => onItemSelect(e, item.value)}
              >
                {item.label}
              </DropdownItem>
            )}
          </Fragment>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

StandardDropdown.propTypes = {
  placeHolderText: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.any),
  onItemSelect: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  activeItem: PropTypes.string,
  className: PropTypes.string,
};

StandardDropdown.defaultProps = {
  placeHolderText: 'Select an option',
  items: [],
  onItemSelect: () => {},
  activeItem: '',
  onBlur: () => {},
  onClick: () => {},
  className: '',
};

export default React.memo(StandardDropdown);
