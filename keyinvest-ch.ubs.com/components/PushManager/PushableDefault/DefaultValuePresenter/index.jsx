import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  EMPTY_VALUE,
  formatNumber,
  getMaxPrecision,
  getMinPrecision,
  getResultFromPushData,
  PUSHABLE_DISPLAY_MODE,
} from '../PushableDefault.helper';

const DefaultValuePresenter = ({
  field, className, displayMode, fieldPushData, children, displayCurrency, shouldTick,
}) => {
  const resultFromPushData = getResultFromPushData(fieldPushData, field, displayMode, shouldTick);
  const resultClasses = classNames('Pushable PushableDefault', className, displayMode, resultFromPushData.colorClasses);
  const currency = displayCurrency && field.currency ? ` ${field.currency}` : '';

  if (displayMode === PUSHABLE_DISPLAY_MODE.COLOR_BAR) {
    return (
      <div className={resultClasses}>
        {children}
      </div>
    );
  }

  return (
    <>
      <span className={resultClasses}>
        {resultFromPushData.result
            || (field && typeof field.value !== 'undefined' ? formatNumber(
              field.value, getMinPrecision()(field), getMaxPrecision()(field),
            ) : EMPTY_VALUE)}
      </span>
      {currency && (resultFromPushData.result || typeof field.value !== 'undefined') && (
        <span className="currency">
          {currency}
        </span>
      )}
    </>
  );
};

DefaultValuePresenter.propTypes = {
  field: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  displayMode: PropTypes.string,
  displayCurrency: PropTypes.bool,
  fieldPushData: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node,
  shouldTick: PropTypes.bool,
};

DefaultValuePresenter.defaultProps = {
  field: {},
  displayCurrency: false,
  className: '',
  displayMode: PUSHABLE_DISPLAY_MODE.VALUE,
  fieldPushData: {},
  children: undefined,
  shouldTick: true,
};

export default React.memo(DefaultValuePresenter);
