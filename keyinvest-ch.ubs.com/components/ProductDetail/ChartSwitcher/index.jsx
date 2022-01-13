import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import i18n from '../../../utils/i18n';
import {
  CHART_TYPE_PRODUCT,
  CHART_TYPE_UNDERLYINGS,
} from '../../../pages/ProductDetailPage/ProductChart.helper';
import {
  productDetailPageToggleChartSin,
  productDetailPageToggleChartType,
} from '../../../pages/ProductDetailPage/actions';
import ChartToggle from '../../Chart/ChartToggle';
import './ChartSwitcher.scss';

export const getUnderlyingSin = pathOr(null, ['head', 'sin', 'value']);
export const getUnderlyingColor = pathOr(null, ['head', 'color', 'value']);
export const getUnderlyingName = pathOr(null, ['head', 'name', 'value']);

class ChartSwitcher extends PureComponent {
  constructor(props) {
    super(props);
    this.onProductChartToggle = this.onProductChartToggle.bind(this);
    this.onUnderlyingsChartToggle = this.onUnderlyingsChartToggle.bind(this);
    this.onChartToggleClicked = this.onChartToggleClicked.bind(this);
  }

  onProductChartToggle() {
    const { uniqId, dispatch, currentTimespan } = this.props;
    dispatch(productDetailPageToggleChartType(uniqId, CHART_TYPE_PRODUCT, currentTimespan));
  }

  onUnderlyingsChartToggle() {
    const { uniqId, dispatch, currentTimespan } = this.props;
    dispatch(productDetailPageToggleChartType(uniqId, CHART_TYPE_UNDERLYINGS, currentTimespan));
  }

  onChartToggleClicked(sin, chartType, status) {
    const { uniqId, dispatch, currentTimespan } = this.props;
    dispatch(productDetailPageToggleChartSin(uniqId, chartType, sin, currentTimespan, status));
  }

  render() {
    const {
      currentChartStatus, underlyingsData, productName, chart, currentTimespan,
      isProductInSubscription,
    } = this.props;
    return (
      <div className="ChartSwitcher">
        {!isProductInSubscription && (
          <div className="chart-radio-container row">
            <div className="custom-control custom-radio col-lg-1">
              <input
                className="custom-control-input"
                type="radio"
                name="chartSwitcher"
                id={CHART_TYPE_PRODUCT}
                value={CHART_TYPE_PRODUCT}
                checked={currentChartStatus.type === CHART_TYPE_PRODUCT}
                onChange={this.onProductChartToggle}
              />
              <label className="custom-control-label" htmlFor={CHART_TYPE_PRODUCT}>
                {i18n.t('product')}
              </label>
            </div>
            <div className="toggles-list col-lg">
              <ChartToggle
                currentTimespan={currentTimespan}
                chart={chart}
                color="#4d3c2f"
                name={productName}
                status={currentChartStatus.type === CHART_TYPE_PRODUCT}
                chartType={CHART_TYPE_PRODUCT}
                onClick={this.onChartToggleClicked}
              />
            </div>
          </div>
        )}
        <div className="chart-radio-container row">
          <div className="custom-control custom-radio col-lg-1">
            <input
              className="custom-control-input"
              type="radio"
              name="chartSwitcher"
              id={CHART_TYPE_UNDERLYINGS}
              value={CHART_TYPE_UNDERLYINGS}
              checked={currentChartStatus.type === CHART_TYPE_UNDERLYINGS}
              onChange={this.onUnderlyingsChartToggle}
            />
            <label className="custom-control-label" htmlFor={CHART_TYPE_UNDERLYINGS}>
              {i18n.t('underlying')}
            </label>
          </div>
          <div className="toggles-list col-lg">
            {underlyingsData.rows && underlyingsData.rows.map((underlying) => (
              <ChartToggle
                currentTimespan={currentTimespan}
                onClick={this.onChartToggleClicked}
                chart={chart}
                key={getUnderlyingSin(underlying)}
                sin={getUnderlyingSin(underlying)}
                color={getUnderlyingColor(underlying)}
                name={getUnderlyingName(underlying)}
                status={
                  currentChartStatus.type === CHART_TYPE_UNDERLYINGS
                  && !currentChartStatus.hiddenUnderlyings[getUnderlyingSin(underlying)]
                }
                chartType={CHART_TYPE_UNDERLYINGS}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

ChartSwitcher.propTypes = {
  currentTimespan: PropTypes.string,
  chart: PropTypes.objectOf(PropTypes.any),
  currentChartStatus: PropTypes.objectOf(PropTypes.any),
  underlyingsData: PropTypes.objectOf(PropTypes.any),
  productName: PropTypes.string,
  dispatch: PropTypes.func,
  uniqId: PropTypes.string.isRequired,
  isProductInSubscription: PropTypes.bool,
};

ChartSwitcher.defaultProps = {
  currentTimespan: null,
  chart: null,
  underlyingsData: {},
  currentChartStatus: {},
  productName: '',
  dispatch: () => {},
  isProductInSubscription: false,
};

export default ChartSwitcher;
