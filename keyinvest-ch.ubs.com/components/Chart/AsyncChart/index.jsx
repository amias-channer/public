import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import { asyncChartFetchContent, asyncChartWillUnmount } from './actions';
import { generateUniqId } from '../../../utils/utils';
import './AsyncChart.scss';
import ErrorBoundary from '../../ErrorBoundary';
import ChartWrapperComponent from '../ChartManager/ChartWrapper';
import ChartLoading from '../ChartLoading';
import { DESKTOP_MODE } from '../../../utils/responsive';

export class AsyncChartComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch, url, uniqKey } = this.props;
    dispatch(asyncChartFetchContent(uniqKey, url));
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch, uniqKey, url, responsiveMode,
    } = this.props;
    if (uniqKey && url && (
      uniqKey !== prevProps.uniqKey
      || url !== prevProps.url
      || responsiveMode !== prevProps.responsiveMode
    )) {
      dispatch(asyncChartFetchContent(uniqKey, url));
    }
    if (uniqKey && (uniqKey !== prevProps.uniqKey)) {
      dispatch(asyncChartWillUnmount(prevProps.uniqKey));
    }
  }

  componentWillUnmount() {
    const { dispatch, uniqKey } = this.props;
    dispatch(asyncChartWillUnmount(uniqKey));
  }

  render() {
    const {
      chartData, className, options, uniqKey, children, toggleChartTimespan, timespan,
    } = this.props;
    return (
      <div className={classNames('AsyncChart', className)}>
        <ErrorBoundary>
          {chartData
          && chartData.isLoading
          && (
            <ChartLoading showPlaceholder={options.showPlaceholder} />
          )}
          {chartData
          && !chartData.isLoading
          && (
            <ChartWrapperComponent
              data={chartData.data}
              options={options}
              type="Line"
              uniqId={uniqKey}
              toggleChartTimespan={toggleChartTimespan}
              timespan={timespan}
            >
              {children}
            </ChartWrapperComponent>
          )}
        </ErrorBoundary>
      </div>
    );
  }
}
AsyncChartComponent.propTypes = {
  chartData: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  toggleChartTimespan: PropTypes.func,
  timespan: PropTypes.string,
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
  responsiveMode: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
AsyncChartComponent.defaultProps = {
  chartData: {},
  className: undefined,
  toggleChartTimespan: () => {},
  timespan: null,
  dispatch: () => {},
  url: '',
  uniqKey: generateUniqId(),
  options: {},
  responsiveMode: DESKTOP_MODE,
  children: [],
};
const mapStateToProps = (state, ownProps) => ({
  chartData: state.chartsData[ownProps.uniqKey],
  responsiveMode: pathOr(DESKTOP_MODE, ['global', 'responsiveMode'])(state),
});

const AsyncChart = connect(mapStateToProps)(AsyncChartComponent);
export default AsyncChart;
