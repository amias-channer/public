import React from 'react';
import { path } from 'ramda';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import HtmlText from '../../HtmlText';
import './NestableListItem.scss';
import { KEYBOARD_KEY_ENTER, KEYBOARD_KEY_SPACE } from '../../../utils/utils';
import FieldTooltips from '../../ProductDetail/FieldTooltips';

const NestableListItem = React.forwardRef((props, ref) => {
  const ITEM_TYPE_TEXT = 'text';
  const {
    data,
    onClick,
    children,
    itemType,
    childOf,
    className,
    innerPath,
    tooltip,
    listUniqId,
  } = props;

  const onItemClick = (e) => {
    onClick(e, innerPath);
  };

  const onKeyPressedTextItem = (event) => {
    if (event.key === KEYBOARD_KEY_ENTER) {
      event.preventDefault();
      onItemClick(event);
    }
  };

  const onKeyPressedCheckboxItem = (event) => {
    if (event.key === KEYBOARD_KEY_SPACE || event.key === KEYBOARD_KEY_ENTER) {
      event.preventDefault();
      onItemClick({
        target: {
          dataset: path(['target', 'dataset'], event),
          value: data.value,
          checked: !data.selected,
        },
      });
    }
  };

  if (!data) {
    return null;
  }

  if (itemType === ITEM_TYPE_TEXT) {
    return (
      <>
        <span
          className={classNames('NestableListItem', className, data.selected ? 'active' : '')}
          onClick={onItemClick}
          data-item-value={data.value}
          role="button"
          tabIndex={0}
          onKeyDown={onKeyPressedTextItem}
          ref={data.value ? ref : undefined}
        >
          {data.label}
        </span>
        <FieldTooltips list={tooltip} />
        {children}
      </>

    );
  }

  const uniqueInputId = listUniqId + data.value;
  return (
    <>
      <div
        className={classNames('custom-control custom-checkbox NestableListItem', className)}
        ref={ref}
        tabIndex="0"
        onKeyDown={onKeyPressedCheckboxItem}
        role="tab"
        data-childof={childOf}
      >
        <input
          type="checkbox"
          className="custom-control-input"
          id={uniqueInputId}
          name={data.value}
          value={data.value}
          onChange={onItemClick}
          checked={!!data.selected}
          data-childof={childOf}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="custom-control-label" htmlFor={uniqueInputId}>
          <HtmlText tag="span" data={{ text: data.label }} />
          <FieldTooltips list={tooltip} />
        </label>
      </div>
      {children}
    </>
  );
});

NestableListItem.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  children: PropTypes.oneOfType(
    [
      PropTypes.objectOf(PropTypes.any),
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.any),
    ],
  ),
  itemType: PropTypes.string,
  childOf: PropTypes.string,
  innerPath: PropTypes.arrayOf(PropTypes.string),
  tooltip: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.any),
    PropTypes.objectOf(PropTypes.any),
  ]),
  listUniqId: PropTypes.string,
};

NestableListItem.defaultProps = {
  className: '',
  data: {
    isVisible: true,
  },
  onClick: () => {},
  children: [],
  itemType: '',
  childOf: '',
  innerPath: [],
  tooltip: null,
  listUniqId: '',
};

export default React.memo(NestableListItem);
