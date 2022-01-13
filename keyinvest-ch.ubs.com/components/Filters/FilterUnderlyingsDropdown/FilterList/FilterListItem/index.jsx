import React from 'react';
import PropTypes from 'prop-types';
import { KEYBOARD_KEY_SPACE } from '../../../../../utils/utils';

const FilterListItem = React.forwardRef((props, ref) => {
  const {
    data, onItemSelect, isChecked,
  } = props;

  const onKeyDown = (event) => {
    if (event.key === KEYBOARD_KEY_SPACE) {
      event.preventDefault();
      onItemSelect({ target: { value: data.value, checked: !isChecked } });
    }
  };
  return (
    <li data-id={data.value} className="col-lg-3" ref={ref} tabIndex="0" onKeyDown={onKeyDown} role="tab">
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id={data.value}
          value={data.value}
          onChange={onItemSelect}
          checked={isChecked}
        />
        <label className="custom-control-label" htmlFor={data.value}><span>{ data.label }</span></label>
      </div>
    </li>
  );
});

FilterListItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onItemSelect: PropTypes.func,
  isChecked: PropTypes.bool,
};

FilterListItem.defaultProps = {
  data: {},
  onItemSelect: () => {},
  isChecked: false,
};

export default React.memo(FilterListItem);
