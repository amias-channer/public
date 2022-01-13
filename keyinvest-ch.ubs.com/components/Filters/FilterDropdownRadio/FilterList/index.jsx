import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { KEYBOARD_KEY_ENTER } from '../../../../utils/utils';

function FilterList(props) {
  const {
    list, onItemSelect, selectedItem, setListItemRef,
  } = props;
  const setRef = (ref) => {
    if (ref && setListItemRef) {
      setListItemRef(ref);
      return ref;
    }
    return undefined;
  };

  const onKeyPressed = (event) => {
    if (event && event.key === KEYBOARD_KEY_ENTER) {
      event.preventDefault();
      onItemSelect(event);
    }
  };

  const listItems = list && Object.keys(list).length > 0 && Object.keys(list).map((item) => (
    <li
      key={list[item].label}
      role="tab"
      data-value={list[item].value}
      className={classNames(list[item].value === selectedItem ? 'selected' : '')}
      onClick={onItemSelect}
      onKeyDown={onKeyPressed}
      ref={setRef}
      tabIndex="0"
    >
      {list[item].label}
    </li>
  ));
  return (
    <div className="list">
      <ul>
        {listItems}
      </ul>
    </div>
  );
}

FilterList.propTypes = {
  list: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.any), PropTypes.objectOf(PropTypes.any)]),
  onItemSelect: PropTypes.func,
  setListItemRef: PropTypes.func,
  selectedItem: PropTypes.string,
};

FilterList.defaultProps = {
  list: [],
  onItemSelect: () => {},
  setListItemRef: () => {},
  selectedItem: '',
};

export default React.memo(FilterList);
