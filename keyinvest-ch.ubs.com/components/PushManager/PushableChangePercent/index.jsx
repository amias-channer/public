import React from 'react';
import { connect } from 'react-redux';
import { PushableDefaultComponent, pushableMapStateToProps } from '../PushableDefault';
import {
  PUSHABLE_DISPLAY_MODE,
} from '../PushableDefault/PushableDefault.helper';

import ChangePercentValuePresenter from './ChangePercentValuePresenter';

export class PushableChangePercentComponent extends PushableDefaultComponent {
  render() {
    const {
      field, className, displayMode, fieldPushData,
    } = this.props;
    return (
      <ChangePercentValuePresenter
        fieldPushData={fieldPushData}
        className={className}
        displayMode={displayMode}
        field={field}
      />
    );
  }
}

PushableChangePercentComponent.defaultProps = {
  displayMode: PUSHABLE_DISPLAY_MODE.CHANGE_PERCENT,
};
const PushableChangePercent = connect(pushableMapStateToProps)(PushableChangePercentComponent);
export default PushableChangePercent;
