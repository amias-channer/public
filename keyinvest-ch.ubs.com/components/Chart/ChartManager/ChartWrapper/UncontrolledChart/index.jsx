import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import '../../../ChartPlugins/chart-plugin-colors';
import '../../../ChartPlugins/chart-plugin-targetline';
import '../../../ChartPlugins/chart-plugin-gridcolor';
import '../../../ChartPlugins/chart-plugin-tooltip';
import '../../../ChartPlugins/chart-plugin-timespans';
import '../../../ChartPlugins/chart-plugin-dynamic-xAxis';
import '../../../ChartPlugins/chart-plugin-dynamic-yAxis';
import '../../../ChartPlugins/chart-plugin-threshold';
import {
  chartManagerDestroyInstance,
  chartManagerInitInstance,
} from '../../actions';
import { generateUniqId } from '../../../../../utils/utils';
import { DESKTOP_MODE } from '../../../../../utils/responsive';

export class UncontrolledChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const { uniqId, dispatch, responsiveMode } = this.props;
    dispatch(chartManagerInitInstance(uniqId, this.props, this.chartRef, responsiveMode));
  }

  shouldComponentUpdate() {
    // The component should never re-render to avoid loosing the chartRef
    return false;
  }

  componentWillUnmount() {
    const { uniqId, dispatch } = this.props;
    dispatch(chartManagerDestroyInstance(uniqId));
  }

  render() {
    const {
      className, style,
    } = this.props;
    return (
      <div
        className={classNames('ct-chart', className)}
        ref={this.chartRef}
        style={style}
      />
    );
  }
}

const EMPTY_OBJ = {};
UncontrolledChart.propTypes = {
  uniqId: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  type: PropTypes.oneOf(['Line', 'Bar', 'Pie']).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  options: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  // eslint-disable-next-line react/no-unused-prop-types
  timespan: PropTypes.string,
  responsiveMode: PropTypes.string,
  dispatch: PropTypes.func,
};

UncontrolledChart.defaultProps = {
  uniqId: generateUniqId(),
  className: '',
  options: EMPTY_OBJ,
  responsiveMode: DESKTOP_MODE,
  style: null,
  timespan: null,
  dispatch: () => {},
};

export default connect()(UncontrolledChart);
