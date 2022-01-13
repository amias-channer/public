import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextInput from '../TextInput';
import './SearchableDropdownCheckboxList.scss';
import { getListData } from './SearchableDropdownCheckboxList.helper';
import CheckboxInput from '../CheckboxInput';
import {
  addDocumentClickEventListeners,
  removeDocumentClickEventListeners,
} from '../../utils/utils';

const SearchableDropdownCheckboxList = ({
  data, className, stateDataSource, onFieldChange, type,
}) => {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);
  const textInputRef = useRef(null);

  const getCheckboxList = (listData) => Object.keys(listData).map((item, index) => (
    <li>
      <CheckboxInput
        onChange={onFieldChange}
        label={listData[item].label}
        value={listData[item].value}
        name={listData[item].value}
        stateDataSource={stateDataSource}
        index={index}
        fieldType={type}
        checked={listData[item].checked}
      />
    </li>
  ));

  const onClickOutside = (event) => {
    if (dropdownRef
      && dropdownRef.current
      && !dropdownRef.current.contains(event.target)) {
      setIsActive(false);
      removeDocumentClickEventListeners(onClickOutside);
    }
  };

  const onTextInputClick = () => {
    setIsActive(true);
    addDocumentClickEventListeners(onClickOutside);
  };
  const onTextInputChange = () => {};

  return (
    <div ref={dropdownRef} className={classNames('SearchableDropdownCheckboxList', className, isActive ? 'active' : '')}>
      <TextInput
        showIcon
        placeholder={data.label}
        title={data.label}
        onClick={onTextInputClick}
        isActive={isActive}
        onChange={onTextInputChange}
        textInputElementRef={textInputRef}
      />
      <div className="menu">
        <div className="list">
          <ul>
            {getCheckboxList(getListData(data))}
          </ul>
        </div>
      </div>
    </div>
  );
};

SearchableDropdownCheckboxList.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  type: PropTypes.string,
  stateDataSource: PropTypes.arrayOf(PropTypes.any),
  onFieldChange: PropTypes.func,
};

SearchableDropdownCheckboxList.defaultProps = {
  data: {},
  className: '',
  type: '',
  stateDataSource: [],
  onFieldChange: () => {},
};

export default SearchableDropdownCheckboxList;
