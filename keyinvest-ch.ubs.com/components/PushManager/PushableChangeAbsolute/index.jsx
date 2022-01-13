import React from 'react';
import { connect } from 'react-redux';
import { PushableDefaultComponent, pushableMapStateToProps } from '../PushableDefault';
import {
  PUSHABLE_DISPLAY_MODE,
} from '../PushableDefault/PushableDefault.helper';
import ChangeAbsoluteValuePresenter from './ChangeAbsoluteValuePresenter';

export class PushableChangeAbsoluteComponent extends PushableDefaultComponent {
  render() {
    const {
      field, className, displayMode, fieldPushData,
    } = this.props;
    return (
      <ChangeAbsoluteValuePresenter
        field={field}
        className={className}
        displayMode={displayMode}
        fieldPushData={fieldPushData}
      />
    );
  }
}

PushableChangeAbsoluteComponent.defaultProps = {
  displayMode: PUSHABLE_DISPLAY_MODE.CHANGE_ABSOLUTE,
};
const PushableChangeAbsolute = connect(pushableMapStateToProps)(PushableChangeAbsoluteComponent);
export default PushableChangeAbsolute;
