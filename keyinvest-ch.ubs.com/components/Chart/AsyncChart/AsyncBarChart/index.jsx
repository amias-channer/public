import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { generateUniqId } from '../../../../utils/utils';
import ErrorBoundary from '../../../ErrorBoundary';
import { AsyncChartComponent } from '../index';
import ChartBarWrapper from '../../ChartManager/ChartBarWrapper';
import { DEFAULT_DECIMAL_DIGITS } from '../../../PushManager/PushableDefault/PushableDefault.helper';

export class AsyncBarChartComponent extends AsyncChartComponent {
  render() {
    const {
      chartData, className, options, uniqKey, children, labelDecimalDigits,
    } = this.props;
    return (
      <div className={classNames('AsyncChart', 'AsyncBarChart', className)}>
        <ErrorBoundary>
          {chartData && chartData.isLoading
          && <div className="is-loading" />}
          {chartData
          && !chartData.isLoading
          && chartData.data
          && (
            <ChartBarWrapper
              data={chartData.data}
              options={options}
              type="Bar"
              uniqId={uniqKey}
              labelDecimalDigits={labelDecimalDigits}
            >
              {children}
            </ChartBarWrapper>
          )}
        </ErrorBoundary>
      </div>
    );
  }
}
AsyncBarChartComponent.propTypes = {
  chartData: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(PropTypes.any),
  ]),
  url: PropTypes.string,
  uniqKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  options: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  labelDecimalDigits: PropTypes.number,
};
AsyncBarChartComponent.defaultProps = {
  chartData: {},
  className: undefined,
  toggleChartTimespan: () => {},
  timespan: null,
  dispatch: () => {},
  url: '',
  uniqKey: generateUniqId(),
  options: {},
  children: [],
  labelDecimalDigits: DEFAULT_DECIMAL_DIGITS,
};
const mapStateToProps = (state, ownProps) => ({
  chartData: state.chartsData[ownProps.uniqKey],
});

const AsyncBarChart = connect(mapStateToProps)(AsyncBarChartComponent);
export default AsyncBarChart;
