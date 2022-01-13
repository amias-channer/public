import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { PushableDefaultComponent, pushableMapStateToProps } from '../PushableDefault';
import { EMPTY_VALUE, PUSHABLE_DISPLAY_MODE } from '../PushableDefault/PushableDefault.helper';
import { getSizeResultFromPushData } from './PushableSize.helper';

export class PushableSizeComponent extends PushableDefaultComponent {
  render() {
    const {
      className, field, displayMode, fieldPushData, showInitialValue,
    } = this.props;
    const resultFromPushData = getSizeResultFromPushData(fieldPushData, field, displayMode);
    if (resultFromPushData.result) {
      return (
        <span className={classNames('Pushable PushableSize', className)}>
          { resultFromPushData.result }
        </span>
      );
    }
    return showInitialValue ? (<>{field.value ? field.value : EMPTY_VALUE}</>) : null;
  }
}

PushableSizeComponent.defaultProps = {
  showInitialValue: PropTypes.bool,
};
PushableSizeComponent.defaultProps = {
  displayMode: PUSHABLE_DISPLAY_MODE.SIZE,
  showInitialValue: true,
};
const PushableSize = connect(pushableMapStateToProps)(PushableSizeComponent);
export default PushableSize;
