import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DonutChartComponent from '../Chart/DonutChart';
import {
  getHeaderName,
  getHeaderWeight,
  getLastUpdateDate,
} from './PieChart.helper';
import i18n from '../../utils/i18n';
import './PieChart.scss';
import Logger from '../../utils/logger';

const PieChartComponent = (props) => {
  const { data, className, pieChartClassName } = props;
  let chartData;
  const tableHeaderLabelName = getHeaderName(data);
  const tableHeaderLabelWeight = getHeaderWeight(data);
  if (Object.keys(data).length > 0 && Object.keys(data.constituents).length > 0) {
    try {
      chartData = data.constituents.components.rows.map((row) => ({
        value: (row.weight.value * 100).toFixed(2),
        name: row.name.value,
      }));
    } catch (e) {
      Logger.error('PieChartComponent:: Failed to compute chart data', e);
    }
    const lastUpdateDate = getLastUpdateDate(data);
    return (
      <div className={classNames('PieChart', className)}>
        {lastUpdateDate && (<span className="last-update-date">{`${i18n.t('as_of')}: ${lastUpdateDate}`}</span>)}
        <DonutChartComponent
          tableHeaderLabelName={tableHeaderLabelName}
          tableHeaderLabelWeight={tableHeaderLabelWeight}
          data={chartData}
          donutChartClassName={pieChartClassName}
        />
      </div>
    );
  }
  return null;
};

PieChartComponent.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  pieChartClassName: PropTypes.string,
};
PieChartComponent.defaultProps = {
  className: '',
  data: {},
  pieChartClassName: 'ct-chart',
};
const PieChart = React.memo(PieChartComponent);
export default PieChart;
