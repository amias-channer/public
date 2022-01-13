import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  formatTimestamp,
  getTimestampResultFromPushData,
} from '../PushableTimestamp.helper';
import { PUSHABLE_DISPLAY_MODE } from '../../PushableDefault/PushableDefault.helper';

const TimestampValuePresenter = ({
  field, displayMode, fieldPushData, showInitialValue, className, format,
}) => {
  const resultFromPushData = getTimestampResultFromPushData(fieldPushData, field, displayMode);
  if (resultFromPushData.result) {
    const date = new Date(resultFromPushData.result);
    return (
      <span className={classNames('PushableTimestamp', className)}>
        { formatTimestamp(date, format) }
      </span>
    );
  }
  return showInitialValue ? (
    <span className={classNames('PushableTimestamp', className)}>
      {field.valueTimestamp ? formatTimestamp(
        new Date(field.valueTimestamp * 1000), format,
      ) : field.value}
    </span>
  ) : null;
};

TimestampValuePresenter.propTypes = {
  showInitialValue: PropTypes.bool,
  format: PropTypes.string,
  field: PropTypes.objectOf(PropTypes.any),
  displayMode: PropTypes.string,
  className: PropTypes.string,
  fieldPushData: PropTypes.objectOf(PropTypes.any),
};
TimestampValuePresenter.defaultProps = {
  displayMode: PUSHABLE_DISPLAY_MODE.TIMESTAMP,
  showInitialValue: true,
  field: {},
  format: 'HH:mm:ss',
  fieldPushData: {},
  className: '',
};

export default React.memo(TimestampValuePresenter);
