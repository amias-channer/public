import React, { Suspense } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const BoerseGoChart = React.lazy(() => import('./BoerseGoChart'));

const TrendRadarChart = ({ className, patternId }) => (
  <div className={classNames('TrendRadarChart', className)}>
    <Suspense fallback={(
      <div className="is-loading" />
      )}
    >
      <BoerseGoChart patternId={patternId} />
    </Suspense>
  </div>
);

TrendRadarChart.propTypes = {
  className: PropTypes.string,
  patternId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

TrendRadarChart.defaultProps = {
  className: '',
};

export default React.memo(TrendRadarChart);
