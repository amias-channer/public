import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import HtmlText from '../../../../HtmlText';

const CheckboxListItem = ({
  className, listUniqId, data, onItemClick,
}) => {
  const uniqueInputId = listUniqId + data.value;
  return (
    <div
      className={classNames('custom-control custom-checkbox CheckboxListItem', className)}
      tabIndex="0"
      role="tab"
    >
      <input
        type="checkbox"
        className="custom-control-input"
        id={uniqueInputId}
        name={data.value}
        value={data.value}
        onChange={onItemClick}
        checked={!!data.selected}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="custom-control-label" htmlFor={uniqueInputId}>
        <HtmlText tag="span" data={{ text: data.label }} />
      </label>
    </div>
  );
};

CheckboxListItem.propTypes = {
  className: PropTypes.string,
  listUniqId: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  onItemClick: PropTypes.func,
};

CheckboxListItem.defaultProps = {
  className: '',
  data: {},
  onItemClick: () => {},
};

export default React.memo(CheckboxListItem);
