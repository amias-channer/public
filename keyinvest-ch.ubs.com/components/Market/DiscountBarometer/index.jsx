import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filter, path, pathOr } from 'ramda';
import './DiscountBarometer.scss';
import {
  discountBarometerFetchContent,
  discountBarometerWillUnmount,
} from './actions';
import HtmlText from '../../HtmlText';
import DiscountBarometerTable from './DiscountBarometerTable';
import AsyncChart from '../../Chart/AsyncChart';
import { generateUniqId, injectUniqIds } from '../../../utils/utils';
import GenericErrorMessage from '../../GenericErrorMessage';
import {
  CHART_MODE_ABSOLUTE,
  TIMESPAN_1M, TIMESPAN_1W, TIMESPAN_1Y,
  TIMESPAN_3M, TIMESPAN_5Y, TIMESPAN_MAX,
} from '../../Chart/Chart.helper';

export class DiscountBarometerComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    dispatch(discountBarometerFetchContent());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(discountBarometerWillUnmount());
  }

  render() {
    const { discountBarometer } = this.props;
    const data = path(['data'], discountBarometer);
    const { chartOptions: chartOptions1 } = this.props;
    const chartOptions = pathOr(chartOptions1, ['chartOptions'], discountBarometer);
    if (data && data['discount-barometer']) {
      const { description, title, tablesRows } = data['discount-barometer'];
      const { charts } = data;
      return (
        <div className="DiscountBarometer col-lg">

          {discountBarometer.isLoading && (
            <div className="mt-5 is-loading" />
          )}

          {title && (
            <h1 className="title">
              {title}
            </h1>
          )}

          {description && (
            <div className="description">
              {description.map((paragraph) => (
                <HtmlText key={generateUniqId()} data={{ text: paragraph }} />
              ))}
            </div>
          )}

          {tablesRows && Object.keys(tablesRows) && (
            <div className="row sections">
              {Object.keys(tablesRows).map((tableKey) => (
                <div key={tableKey} className="col-lg-6 section-content">
                  <h2 className="section-title">{tableKey}</h2>
                  <DiscountBarometerTable data={injectUniqIds(tablesRows[tableKey], 'key')} />
                </div>
              ))}
            </div>
          )}

          {charts && Object.keys(charts) && (
            <div className="row sections">
              {filter((k) => k !== 'title', Object.keys(charts)).map((chartKey) => (
                <div key={chartKey} className="col-lg-6 section-content">
                  <h2 className="section-title">{`${charts.title} ${chartKey}`}</h2>
                  <AsyncChart
                    uniqKey={generateUniqId()}
                    key={chartKey}
                    url={charts[chartKey].data.url}
                    options={chartOptions}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="DiscountBarometer col-lg">
        <GenericErrorMessage />
      </div>
    );
  }
}

DiscountBarometerComponent.propTypes = {
  discountBarometer: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  chartOptions: PropTypes.objectOf(PropTypes.any),
};

DiscountBarometerComponent.defaultProps = {
  discountBarometer: {
    data: {},
  },
  dispatch: () => {},
  chartOptions: {
    showTimespans: true,
    showScrollbar: true,
    showTooltip: true,
    defaultTimespan: '5Y',
    forcedMode: CHART_MODE_ABSOLUTE,
    timespans: [
      TIMESPAN_1W, TIMESPAN_1M, TIMESPAN_3M, TIMESPAN_1Y, TIMESPAN_5Y, TIMESPAN_MAX,
    ],
  },
};

const mapStateToProps = (state) => ({
  discountBarometer: state.discountBarometer,
});

const DiscountBarometer = connect(mapStateToProps)(DiscountBarometerComponent);
export default DiscountBarometer;
