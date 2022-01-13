import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  getChangePercentWithBarData,
  getPercentWithBarResultFromPushData,
} from '../PushablePercentWithBar.helper';
import { PUSHABLE_DISPLAY_MODE } from '../../PushableDefault/PushableDefault.helper';

const PercentWithBarValuePresenter = ({
  field, className, displayMode, fieldPushData, maxForPercentCalc,
}) => {
  const resultFromPushData = getPercentWithBarResultFromPushData(
    fieldPushData, field, displayMode, maxForPercentCalc,
  );
  const resultClasses = classNames('Pushable PushablePercentWithBar', className, displayMode, resultFromPushData.colorClasses);

  let classes;
  let resultData;
  if (resultFromPushData.result) {
    classes = classNames('row', resultClasses);
    resultData = resultFromPushData;
  } else {
    resultData = getChangePercentWithBarData(field.baseValue, field.value, maxForPercentCalc);
    classes = classNames('row', className, displayMode, resultData.colorClasses);
  }
  return (
    <div className={classes}>
      <div className="value-bar col-4 bar-negative-zone">
        <span style={{ width: `${resultData.barWidth}%` }} />
      </div>
      <div className="value-bar col-4 bar-positive-zone">
        <span style={{ width: `${resultData.barWidth}%` }} />
      </div>
      <div className="value-percent col-4">{ resultData.result }</div>
    </div>
  );
};

PercentWithBarValuePresenter.propTypes = {
  className: PropTypes.string,
  field: PropTypes.objectOf(PropTypes.any),
  displayMode: PropTypes.string,
  fieldPushData: PropTypes.objectOf(PropTypes.any),
  maxForPercentCalc: PropTypes.number,
};

PercentWithBarValuePresenter.defaultProps = {
  className: '',
  field: {},
  displayMode: PUSHABLE_DISPLAY_MODE.CHANGE_PERCENT_WITH_BAR,
  fieldPushData: {},
  maxForPercentCalc: undefined,
};

export default React.memo(PercentWithBarValuePresenter);
