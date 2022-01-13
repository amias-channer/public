import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PushableDefaultComponent, pushableMapStateToProps } from '../PushableDefault';
import { PUSHABLE_DISPLAY_MODE } from '../PushableDefault/PushableDefault.helper';
import TimestampValuePresenter from './TimestampValuePresenter';

export class PushableTimestampComponent extends PushableDefaultComponent {
  render() {
    const {
      field, displayMode, fieldPushData, showInitialValue, className, format,
    } = this.props;
    return (
      <TimestampValuePresenter
        field={field}
        displayMode={displayMode}
        fieldPushData={fieldPushData}
        showInitialValue={showInitialValue}
        className={className}
        format={format}
      />
    );
  }
}

PushableTimestampComponent.propTypes = {
  showInitialValue: PropTypes.bool,
  format: PropTypes.string,
};
PushableTimestampComponent.defaultProps = {
  displayMode: PUSHABLE_DISPLAY_MODE.TIMESTAMP,
  showInitialValue: true,
  format: 'HH:mm:ss',
};
const PushableTimestamp = connect(pushableMapStateToProps)(PushableTimestampComponent);
export default PushableTimestamp;
