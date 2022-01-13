import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  EMPTY_VALUE,
  formatNumber, getMaxPrecision, getMinPrecision,
  PUSHABLE_DISPLAY_MODE,
} from '../../PushableDefault/PushableDefault.helper';
import { getChangeAbsoluteResultFromPushData } from '../PushableChangeAbsolute.helper';

const ChangeAbsoluteValuePresenter = ({
  field, className, displayMode, fieldPushData,
}) => {
  const resultFromPushData = getChangeAbsoluteResultFromPushData(fieldPushData, field);
  const resultClasses = classNames('Pushable PushableChangeAbsolute', className, displayMode, resultFromPushData.colorClasses);
  return (
    <span className={resultClasses}>
      {resultFromPushData.result
        || (typeof field.value !== 'undefined' ? formatNumber(
          field.value, getMinPrecision()(field), getMaxPrecision()(field),
        ) : EMPTY_VALUE)}
    </span>
  );
};

ChangeAbsoluteValuePresenter.propTypes = {
  className: PropTypes.string,
  field: PropTypes.objectOf(PropTypes.any),
  displayMode: PropTypes.string,
  fieldPushData: PropTypes.objectOf(PropTypes.any),
};

ChangeAbsoluteValuePresenter.defaultProps = {
  className: '',
  field: {},
  displayMode: PUSHABLE_DISPLAY_MODE.CHANGE_ABSOLUTE,
  fieldPushData: {},
};
export default React.memo(ChangeAbsoluteValuePresenter);
