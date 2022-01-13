import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Chartist from 'chartist';
import './DonutChart.scss';
import { connect } from 'react-redux';
import mediaQueries from '../../../utils/mediaQueries';
import i18n from '../../../utils/i18n';
import Logger from '../../../utils/logger';

const modes2value = {
  mobile: {
    default: 8,
    chart: 74,
  },
  tablet: {
    default: 16,
    chart: 90,
  },
  notebook: {
    default: 16,
    chart: 77,
  },
  desktop: {
    default: 24,
    chart: 68,
  },
};

export class DonutChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.handleMediaQueryChange = this.handleMediaQueryChange.bind(this);
    this.getTableHeader = this.getTableHeader.bind(this);
    this.getTableRows = this.getTableRows.bind(this);
    this.state = {
      btnVisible: false,
      visible: 0,
      rows: [],
    };
  }

  componentDidMount() {
    this.handleMediaQueryChange();
  }

  componentWillUnmount() {
    if (this.chartist) {
      try {
        this.chartist.detach();
      } catch (err) {
        throw new Error('Internal chartist error', err);
      }
    }
  }

  onClickHandler() {
    const { btnVisible } = this.state;
    this.setState({
      btnVisible: !btnVisible,
    });
    this.filterData(!btnVisible);
  }

  getTableHeader = () => {
    const { tableHeaderLabelName, tableHeaderLabelWeight } = this.props;
    const classNames = 'row field';
    return (
      <div className={classNames}>
        <div className="col">
          {tableHeaderLabelName}
        </div>
        <div className="col text-right">
          {tableHeaderLabelWeight}
        </div>
      </div>
    );
  }

  getTableRows = (data, className) => {
    // 28 is the total length of $ct-donut-series-colors in scss
    const classNames = (index) => `row values field color-key-${Math.abs(Math.round((className + index) % 28))}`;
    return data && Object.keys(data).map((fieldKey, index) => (
      <div className={classNames(index)} key={fieldKey}>
        <div className="col value">
          {data[fieldKey].name}
        </div>
        <div className="col text-right value">
          {data[fieldKey].value}
          %
        </div>
      </div>
    ));
  }

  getButton() {
    const { btnVisible } = this.state;
    return (
      <>
        <button
          type="button"
          className={`btn${!btnVisible ? ' btn-arrowed-down' : ' btn-arrowed-up'}`}
          onClick={this.onClickHandler}
        >
          {!btnVisible ? i18n.t('show_all') : i18n.t('show_less')}
        </button>
      </>
    );
  }

  updateChart() {
    const { data, responsiveMode, donutChartClassName } = this.props;
    const chartData = data.map((field) => field.value);
    const donutWidth = modes2value[responsiveMode].chart;
    try {
      this.chartist = new Chartist.Pie(`.${donutChartClassName}`, {
        series: chartData,
      }, {
        donut: true,
        donutWidth,
        showLabel: false,
      });
    } catch (e) {
      Logger.log('DonutChart::updateChart() CHARTIST PIE CHART INITIALIZATION ERROR', e);
    }
  }

  filterData(all) {
    const { data, responsiveMode } = this.props;
    let filter = modes2value[responsiveMode].default;
    if (data.length < filter) filter = data.length;
    this.setState({
      rows: all ? data : data.filter((r, index) => index < filter),
      visible: all ? data.length : filter,
    });
  }

  // eslint-disable-next-line react/sort-comp
  handleMediaQueryChange() {
    this.filterData();
    this.updateChart();
  }

  render() {
    const { data, donutChartClassName } = this.props;
    const { rows, visible } = this.state;
    return (
      <div className="ct-donut-chart">
        <div className={donutChartClassName} />

        <MediaQuery query={mediaQueries.mobileOnly} onChange={this.handleMediaQueryChange}>
          <div className="KeyValueTable">
            {this.getTableRows(rows, 0)}
            { data.length > modes2value.mobile.default ? this.getButton() : null }
          </div>
        </MediaQuery>

        <MediaQuery query={mediaQueries.tabletOnly} onChange={this.handleMediaQueryChange}>
          <div className="KeyValueTable">
            {this.getTableHeader()}
            {this.getTableRows(rows.filter((r, index) => index < visible / 2), 0)}
          </div>
          <div className="KeyValueTable">
            {this.getTableHeader()}
            {this.getTableRows(
              rows.filter((r, index) => index >= visible / 2 && index < visible),
              Math.ceil(visible / 2),
            )}
          </div>
          { data.length > modes2value.tablet.default
            ? (
              <div className="buttons">
                {this.getButton()}
              </div>
            ) : null }
        </MediaQuery>
        <MediaQuery query={mediaQueries.notebookOnly} onChange={this.handleMediaQueryChange}>
          <div className="KeyValueTable">
            {this.getTableHeader()}
            {this.getTableRows(rows.filter((r, index) => index < visible / 2), 0)}
          </div>
          <div className="KeyValueTable">
            {this.getTableHeader()}
            {this.getTableRows(
              rows.filter((r, index) => index >= visible / 2 && index < visible),
              Math.ceil(visible / 2),
            )}
          </div>
          { data.length > modes2value.notebook.default
            ? (
              <div className="buttons">
                {this.getButton()}
              </div>
            ) : null }
        </MediaQuery>

        <MediaQuery query={mediaQueries.desktop} onChange={this.handleMediaQueryChange}>
          <div className="KeyValueTable">
            {this.getTableHeader()}
            {this.getTableRows(rows.filter((r, index) => index < visible / 3), 0)}
          </div>
          <div className="KeyValueTable">
            {this.getTableHeader()}
            {this.getTableRows(
              rows.filter((r, index) => index >= visible / 3 && index < (visible / 3) * 2),
              Math.ceil(visible / 3),
            )}
          </div>
          <div className="KeyValueTable">
            {this.getTableHeader()}
            {this.getTableRows(
              rows.filter((r, index) => index >= (visible / 3) * 2 && index < (visible / 3) * 3),
              Math.ceil((visible / 3) * 2),
            )}
          </div>
          <div className="buttons">
            { data.length > modes2value.desktop.default ? this.getButton() : null }
          </div>
        </MediaQuery>
      </div>
    );
  }
}

DonutChart.propTypes = {
  responsiveMode: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  donutChartClassName: PropTypes.string,
  tableHeaderLabelName: PropTypes.string,
  tableHeaderLabelWeight: PropTypes.string,
};
DonutChart.defaultProps = {
  responsiveMode: '',
  data: {},
  donutChartClassName: 'ct-chart',
  tableHeaderLabelName: '',
  tableHeaderLabelWeight: '',
};

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});

const DonutChartCmp = connect(mapStateToProps)(DonutChart);
export default DonutChartCmp;
