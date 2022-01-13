import React from 'react';
import PropTypes from 'prop-types';
import { produce } from 'immer';
import classNames from 'classnames';
import {
  KEYBOARD_KEY_ARROW_DOWN,
  KEYBOARD_KEY_ARROW_UP,
} from '../../utils/utils';
import Logger from '../../utils/logger';

const FOCUS_LIST_ITEM_START_INDEX = 0;
const isMaxIndexItemFocused = (
  currentItemIndex,
  maximumIndex,
) => currentItemIndex > (maximumIndex - 1);

const isNegativeIndex = (index) => (index < 0);
const getLastItemIndex = (maxItemIndex) => maxItemIndex - 1;
const getStartIndex = (index) => {
  if (index !== null && index !== undefined && typeof index === 'number') {
    return Math.round(index);
  }
  return null;
};

class ArrowKeysListNavigation extends React.PureComponent {
  constructor(props) {
    super(props);
    const { startIndex } = props;
    this.state = {
      currentFocusedItemIndex: getStartIndex(startIndex),
    };
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onKeyDown(event) {
    switch (event.key) {
      case KEYBOARD_KEY_ARROW_DOWN:
        event.preventDefault();
        this.setFocusListItem(1);
        break;
      case KEYBOARD_KEY_ARROW_UP:
        event.preventDefault();
        this.setFocusListItem(-1);
        break;
      default:
        break;
    }
  }

  setFocusListItem(delta) {
    const { currentFocusedItemIndex } = this.state;
    if (currentFocusedItemIndex === null) {
      this.setStateAndFocusItem(FOCUS_LIST_ITEM_START_INDEX);
      return;
    }
    const newFocusedItemIndex = this.calculateFocusedItemIndex(currentFocusedItemIndex, delta);
    this.setStateAndFocusItem(newFocusedItemIndex);
  }

  setStateAndFocusItem(updatedItemIndex) {
    this.setState(produce((draft) => {
      draft.currentFocusedItemIndex = updatedItemIndex;
    }), () => {
      this.focusListItem(updatedItemIndex);
    });
  }

  calculateFocusedItemIndex(currentItemIndex, delta) {
    const { listItemRefs } = this.props;

    if (!listItemRefs) {
      Logger.error('calculateFocusedItemIndex(): List item Refs array must be available as props for ArrowKeysListNavigation component!');
      return currentItemIndex;
    }

    const calculatedIndex = currentItemIndex + delta;
    const maximumItemIndex = listItemRefs.length;

    if (isNegativeIndex(calculatedIndex)) {
      return getLastItemIndex(maximumItemIndex);
    }

    if (isMaxIndexItemFocused(calculatedIndex, maximumItemIndex)) {
      return FOCUS_LIST_ITEM_START_INDEX;
    }
    return calculatedIndex;
  }

  focusListItem(index) {
    const { listItemRefs } = this.props;

    try {
      // if ref was created with React.createRef() API
      if (listItemRefs[index] && listItemRefs[index].current) {
        listItemRefs[index].current.focus();
        return;
      }

      // if ref is regular DOM node
      if (listItemRefs[index]) {
        listItemRefs[index].focus();
      }
    } catch (e) {
      Logger.error(e);
    }
  }

  render() {
    const { children, className } = this.props;
    return (
      <div className={classNames('ArrowKeysListNavigation', className)} onKeyDown={this.onKeyDown} role="presentation">
        { children }
      </div>
    );
  }
}

ArrowKeysListNavigation.propTypes = {
  listItemRefs: PropTypes.arrayOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType(
    [
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ],
  ),
  startIndex: PropTypes.number,
};

ArrowKeysListNavigation.defaultProps = {
  children: {},
  className: '',
  startIndex: null,
};

export default ArrowKeysListNavigation;
