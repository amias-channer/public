import React from 'react';
import { connect } from 'react-redux';
import { PushableDefaultComponent, pushableMapStateToProps } from '../PushableDefault';
import {
  PUSHABLE_DISPLAY_MODE,
} from '../PushableDefault/PushableDefault.helper';
import PercentWithBarValuePresenter from './PrecentWithBarValuePresenter';

export class PushablePercentWithBarComponent extends PushableDefaultComponent {
  render() {
    const {
      field, className, displayMode, fieldPushData, maxForPercentCalc,
    } = this.props;
    return (
      <PercentWithBarValuePresenter
        field={field}
        fieldPushData={fieldPushData}
        displayMode={displayMode}
        className={className}
        maxForPercentCalc={maxForPercentCalc}
      />
    );
  }
}
PushablePercentWithBarComponent.defaultProps = {
  displayMode: PUSHABLE_DISPLAY_MODE.CHANGE_PERCENT_WITH_BAR,
  maxForPercentCalc: undefined,
};
const PushablePercentWithBar = connect(pushableMapStateToProps)(PushablePercentWithBarComponent);
export default PushablePercentWithBar;
