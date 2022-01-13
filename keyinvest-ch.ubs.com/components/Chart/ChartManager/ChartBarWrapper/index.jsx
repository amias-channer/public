import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ErrorBoundary from '../../../ErrorBoundary';
import UncontrolledChartComponent from '../ChartWrapper/UncontrolledChart';
import { generateUniqId } from '../../../../utils/utils';
import {
  getChartInstance,
} from '../ChartManager.helper';
import './ChartBar.scss';
import { generateChartBarListeners } from './ChartBarWrapper.helper';
import { DEFAULT_DECIMAL_DIGITS } from '../../../PushManager/PushableDefault/PushableDefault.helper';

export class ChartBarWrapperComponent extends React.PureComponent {
  getChartInstance() {
    const { uniqId } = this.props;
    return getChartInstance(uniqId);
  }

  render() {
    const {
      data, type, className, options, uniqId, children, labelDecimalDigits,
    } = this.props;
    const chartInstance = this.getChartInstance();
    const preparedChildren = React.Children.map(children,
      (child) => React.cloneElement(child, { chart: chartInstance }));
    return (
      <div className={classNames('Chart ChartWrapper ChartBarWrapper', className)}>
        <ErrorBoundary>
          {data && data.isLoading
          && <div className="is-loading" />}
          {data && (
            <>
              <UncontrolledChartComponent
                className="Chart ChartBar"
                data={data}
                options={options}
                type={type}
                uniqId={uniqId}
                listener={generateChartBarListeners(data, labelDecimalDigits)}
              />
              {preparedChildren}
            </>
          )}
        </ErrorBoundary>
      </div>
    );
  }
}
ChartBarWrapperComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  type: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(PropTypes.any),
  ]),
  uniqId: PropTypes.oneOfType([
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
ChartBarWrapperComponent.defaultProps = {
  data: {},
  type: 'Bar',
  className: undefined,
  uniqId: generateUniqId(),
  options: {},
  children: [],
  labelDecimalDigits: DEFAULT_DECIMAL_DIGITS,
};

const ChartBarWrapper = connect()(ChartBarWrapperComponent);
export default ChartBarWrapper;
