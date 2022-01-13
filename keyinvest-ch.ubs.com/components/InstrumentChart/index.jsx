import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import classNames from 'classnames';
import AsyncChart from '../Chart/AsyncChart';
import { TIMESPAN_1D, TIMESPAN_1W, TIMESPAN_5Y } from '../Chart/Chart.helper';

export const getChartUrl = (chartTimespan, data) => {
  if (data && data.chartUrl) {
    switch (chartTimespan) {
      case TIMESPAN_1D:
      case TIMESPAN_1W:
        return pathOr(data.chartUrl, [`chartUrl_${chartTimespan}`])(data);
      default:
        return data.chartUrl;
    }
  }
  return null;
};

const InstrumentChart = (props) => {
  const { data, className, uniqId } = props;
  const [chartTimespan, setChartTimespan] = useState(TIMESPAN_5Y);
  const chartOptions = {
    showScrollbar: true,
    showTimespans: true,
    showTooltip: true,
    defaultTimespan: '5Y',
  };

  const chartUrl = getChartUrl(chartTimespan, data);

  if (data && chartUrl) {
    return (
      <div className={classNames('InstrumentChart', className)}>
        <AsyncChart
          uniqKey={uniqId}
          url={chartUrl}
          options={chartOptions}
          toggleChartTimespan={setChartTimespan}
        />
      </div>
    );
  }
  return null;
};

InstrumentChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  uniqId: PropTypes.string.isRequired,
};
InstrumentChart.defaultProps = {
  className: '',
  data: {},
};

export default React.memo(InstrumentChart);
