import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import StandardDropdown from '../StandardDropdown';
import './DropdownWithTitle.scss';

const DropdownWithTitle = ({
  placeHolderText, items, onItemSelect, activeItem, onBlur, className,
}) => (
  <div className={classNames('DropdownWithTitle', className)}>
    <StandardDropdown
      onItemSelect={onItemSelect}
      items={items}
      activeItem={activeItem}
      onBlur={onBlur}
      placeHolderText={placeHolderText}
    />
  </div>
);

DropdownWithTitle.propTypes = {
  placeHolderText: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.any),
  onItemSelect: PropTypes.func,
  activeItem: PropTypes.string,
  onBlur: PropTypes.func,
  className: PropTypes.string,
};

DropdownWithTitle.defaultProps = {
  placeHolderText: '',
  items: [],
  onItemSelect: () => {},
  activeItem: '',
  onBlur: () => {},
  className: '',
};

export default React.memo(DropdownWithTitle);
