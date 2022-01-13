import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import './BackendSearchableDropdownList.scss';
import { pathOr, values } from 'ramda';
import TextInput from '../TextInput';
import ListItemsCheckboxes from '../NestableListItems';
import ListItems from '../ListItems';
import {
  addDocumentClickEventListeners,
  removeDocumentClickEventListeners,
  searchAndReplaceTextInString,
} from '../../utils/utils';
import {
  backendSearchableCheckboxItemChanged,
  backendSearchableFetchData,
  backendSearchableMergePreSetList,
  backendSearchableOnSingleItemSelect,
  backendSearchableFetchPushPriceData,
  backendSearchableComponentDidUnmount,
} from './actions';
import {
  getItemIsChecked,
  getItemValue,
  getListItems,
  isSingleItemSelectDropdown,
  STATE_KEY_BACKEND_SEARCHABLE_DROPDOWN_LIST,
  getSearchUrl, getPushPriceUrl, getItemDataValue,
} from './BackendSearchableDropdownList.helper';
import ListItem from '../ListItems/ListItem';

export const BackendSearchableDropdownListCmp = ({
  data, dispatch, className, uniqId, list, stateDataSource, dataTransformFunc,
}) => {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    dispatch(backendSearchableMergePreSetList(uniqId, getListItems(data)));
    return () => {
      dispatch(backendSearchableComponentDidUnmount(uniqId));
    };
  }, [dispatch, uniqId, data]);

  const onClickOutside = (event) => {
    if (dropdownRef
      && dropdownRef.current
      && !dropdownRef.current.contains(event.target)) {
      setIsActive(false);
      removeDocumentClickEventListeners(onClickOutside);
    }
  };

  const onTextInputChange = (e) => {
    const inputText = pathOr('', ['currentTarget', 'value'], e);
    if (!inputText) {
      return;
    }
    const searchUrl = searchAndReplaceTextInString('%s', inputText, getSearchUrl(data));
    dispatch(backendSearchableFetchData(uniqId, searchUrl, stateDataSource, dataTransformFunc));
  };

  const onTextInputClick = () => {
    setIsActive(true);
    addDocumentClickEventListeners(onClickOutside);
  };

  const onCheckboxChanged = (e) => {
    const isChecked = getItemIsChecked(e);
    const listItemId = getItemValue(e);
    dispatch(backendSearchableCheckboxItemChanged(uniqId, listItemId, isChecked));
    const itemData = { value: listItemId };

    if (isChecked) {
      dispatch(backendSearchableFetchPushPriceData(uniqId, itemData, searchAndReplaceTextInString('%s', listItemId, getPushPriceUrl(data))));
    }
  };

  const clearInputText = () => {
    if (textInputRef && textInputRef.current && textInputRef.current.value) {
      textInputRef.current.value = '';
    }
  };

  const onSingleItemSelect = (e, itemData) => {
    dispatch(backendSearchableOnSingleItemSelect(uniqId, itemData));
    setIsActive(false);
    removeDocumentClickEventListeners(onClickOutside);
    clearInputText();

    const itemValue = getItemDataValue(itemData);
    if (!itemValue) {
      return;
    }
    dispatch(backendSearchableFetchPushPriceData(uniqId, itemData, searchAndReplaceTextInString('%s', itemValue, getPushPriceUrl(data))));
  };

  const getPlainListItems = () => list && (
    <ListItems>
      {values(list).map(
        (underlyingData) => underlyingData && (
          <ListItem
            onItemClick={onSingleItemSelect}
            data={underlyingData}
            className={underlyingData.selected ? 'selected-single-item' : ''}
            key={underlyingData.label}
          >
            {underlyingData.label}
          </ListItem>
        ),
      )}
    </ListItems>
  );

  const getCheckboxesListItems = () => (
    <ListItemsCheckboxes
      list={list}
      onChange={onCheckboxChanged}
      uniqId={uniqId}
    />
  );

  return (
    <div ref={dropdownRef} className={classNames('BackendSearchableDropdownList', className, isActive ? 'active' : '')}>
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
        {isSingleItemSelectDropdown(data) && getPlainListItems()}
        {!isSingleItemSelectDropdown(data) && getCheckboxesListItems()}
      </div>
    </div>
  );
};

BackendSearchableDropdownListCmp.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  dataTransformFunc: PropTypes.func,
  className: PropTypes.string,
  uniqId: PropTypes.string.isRequired,
  list: PropTypes.objectOf(PropTypes.any),
  stateDataSource: PropTypes.arrayOf(PropTypes.any),
};

BackendSearchableDropdownListCmp.defaultProps = {
  data: {
    settings: {
      onlySingleItemSelection: false,
    },
  },
  dispatch: () => {},
  dataTransformFunc: null,
  className: '',
  list: {},
  stateDataSource: null,
};
const EMPTY_OBJ = {};
const mapStateToProps = (state, ownProps) => ({
  list: pathOr(EMPTY_OBJ, [STATE_KEY_BACKEND_SEARCHABLE_DROPDOWN_LIST, ownProps.uniqId, 'list'], state),
});
const BackendSearchableDropdownList = React.memo(
  connect(mapStateToProps)(BackendSearchableDropdownListCmp),
);
export default BackendSearchableDropdownList;
