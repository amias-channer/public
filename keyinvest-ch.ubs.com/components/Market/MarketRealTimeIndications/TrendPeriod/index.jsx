import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './TrendPeriod.scss';
import { getPerformanceClass } from '../../../PushManager/PushableDefault/PushableDefault.helper';

function TrendPeriodComponent(props) {
  const { field } = props;
  const { performance3MthPercent, performance1MthPercent, performance1WkPercent } = field;
  return (
    <div className="TrendPeriod row">
      {performance1WkPercent && (
      <span className={`col text-left trend ${classNames(getPerformanceClass(performance1WkPercent))}`}>
        <span className="inner-wrapper arrow" />
        1W
      </span>
      )}
      {performance1MthPercent && (
      <span className={`col text-center trend ${classNames(getPerformanceClass(performance1MthPercent))}`}>
        <span className="inner-wrapper arrow" />
        1M
      </span>
      )}
      {performance3MthPercent && (
      <span className={`col text-right trend ${classNames(getPerformanceClass(performance3MthPercent))}`}>
        <span className="inner-wrapper arrow" />
        3M
      </span>
      )}
    </div>
  );
}

TrendPeriodComponent.propTypes = {
  field: PropTypes.objectOf(PropTypes.any),
};

TrendPeriodComponent.defaultProps = {
  field: {
    performance3MthPercent: null,
    performance1MthPercent: null,
    performance1WkPercent: null,
  },
};

const TrendPeriod = React.memo(TrendPeriodComponent);
export default TrendPeriod;
