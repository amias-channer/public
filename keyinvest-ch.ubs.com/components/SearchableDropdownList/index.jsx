import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle } from 'reactstrap';
import PushableDefault from '../PushManager/PushableDefault';
import PushableChangePercent from '../PushManager/PushableChangePercent';
import DropdownSearch from '../DropdownSearch';
import './SearchableDropdownList.scss';

function SearchableDropdownList(props) {
  const dropDownSearchInputRef = React.createRef();

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const focusDropdownSearchInput = () => {
      if (dropDownSearchInputRef.current) {
        dropDownSearchInputRef.current.focus();
      }
    };
    if (isDropdownOpen) {
      focusDropdownSearchInput();
    }
  }, [isDropdownOpen, dropDownSearchInputRef]);

  const toggleDropdown = () => (isDropdownOpen === true
    ? setDropdownOpen(false)
    : setDropdownOpen(true));

  const {
    selectedDropdownItem, onItemSelect, field, list, textInputPlaceHolder,
    isLoading,
  } = props;
  return (
    <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown} className="SearchableDropdownList">
      <DropdownToggle className="dropdown-toggler">
        { isLoading && (<div className="is-loading" />)}
        {field && Object.keys(field).length > 0 && (
        <div className="pushable-fields">
          <PushableDefault field={field} className="pushable-field field-decimal-value" />
          <PushableChangePercent field={field} className="pushable-field field-percentage-value" />
        </div>
        )}
        <span className="selected-item">{selectedDropdownItem}</span>
        <div className="dropdown-toggler-icon"><i className="icon-triangle-down" /></div>
      </DropdownToggle>
      <DropdownSearch
        list={list}
        textInputPlaceHolder={textInputPlaceHolder}
        onItemSelect={onItemSelect}
        selectedDropdownItem={selectedDropdownItem}
        searchInputRef={dropDownSearchInputRef}
        toggleDropdown={toggleDropdown}
        isDropdownOpen={isDropdownOpen}
      />
    </Dropdown>
  );
}

SearchableDropdownList.propTypes = {
  selectedDropdownItem: PropTypes.string,
  textInputPlaceHolder: PropTypes.string,
  onItemSelect: PropTypes.func,
  field: PropTypes.objectOf(PropTypes.any),
  list: PropTypes.arrayOf(PropTypes.any),
  isLoading: PropTypes.bool,
};

SearchableDropdownList.defaultProps = {
  selectedDropdownItem: '',
  textInputPlaceHolder: '',
  onItemSelect: () => {},
  field: {},
  list: [],
  isLoading: false,
};

export default React.memo(SearchableDropdownList);
