import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  getChangePercentData,
  getChangePercentResultFromPushData,
} from '../PushableChangePercent.helper';
import { PUSHABLE_DISPLAY_MODE } from '../../PushableDefault/PushableDefault.helper';

const ChangePercentValuePresenter = ({
  field, className, displayMode, fieldPushData,
}) => {
  const resultFromPushData = getChangePercentResultFromPushData(
    fieldPushData, field, displayMode,
  );
  const resultClasses = classNames('Pushable PushableChangePercent', className, displayMode, resultFromPushData.colorClasses);
  if (resultFromPushData.result) {
    return (
      <div className={resultClasses}>
        { resultFromPushData.result }
      </div>
    );
  }
  const initialResult = getChangePercentData(field.baseValue, field.value);
  return (
    <div className={classNames('Pushable PushableChangePercent', className, displayMode, initialResult.colorClasses)}>
      { initialResult.result }
    </div>
  );
};

ChangePercentValuePresenter.propTypes = {
  field: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  displayMode: PropTypes.string,
  fieldPushData: PropTypes.objectOf(PropTypes.any),
};

ChangePercentValuePresenter.defaultProps = {
  field: {},
  className: '',
  displayMode: PUSHABLE_DISPLAY_MODE.CHANGE_PERCENT,
  fieldPushData: {},
};

export default React.memo(ChangePercentValuePresenter);
