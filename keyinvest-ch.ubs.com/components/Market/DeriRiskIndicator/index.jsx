import React from 'react';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import AsyncChart from '../../Chart/AsyncChart';
import './DeriRiskIndicator.scss';
import {
  deriRiskIndicatorFetchContent,
  deriRiskIndicatorSetActiveChartSin,
  deriRiskIndicatorSetActiveChartTimespan,
} from './actions';
import DeriRiskIndicatorTile from './DeriRiskIndicatorTile';
import Accordion from '../../Accordion';
import DeriRiskTable from './DeriRiskTable';
import {
  DEFAULT_CHART_TIMESPAN,
  TIMESPAN_1M,
  TIMESPAN_1Y, TIMESPAN_3M,
  TIMESPAN_5Y,
  TIMESPAN_MAX,
} from '../../Chart/Chart.helper';
import {
  getActiveChartTimespanKey, getCmsAccordionComponentData,
  getNameShortValue, getTypeValue,
} from './DeriRiskIndicator.helper';

const TILE_TYPE_DERI = 'deri';
const TILE_TYPE_GEM_DERI = 'gemderi';

export class DeriRiskIndicator extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.onTileClick = this.onTileClick.bind(this);
    this.toggleChartTimespan = this.toggleChartTimespan.bind(this);
    dispatch(deriRiskIndicatorFetchContent(TILE_TYPE_DERI));
  }

  onTileClick(sin, tileName) {
    const { dispatch, data, pageTitle } = this.props;
    if (data.activeChartSin === sin) {
      return;
    }
    dispatch(deriRiskIndicatorSetActiveChartSin(sin));
    dispatch(deriRiskIndicatorFetchContent(tileName, {
      text: `${getNameShortValue(data[`${tileName}Data`])} ${getTypeValue(data[`${tileName}Data`])}`,
      parent: pageTitle,
    }));
  }

  toggleChartTimespan(timespan) {
    const { dispatch } = this.props;
    dispatch(deriRiskIndicatorSetActiveChartTimespan(timespan));
  }

  render() {
    const { data, isLoading } = this.props;
    const chartOptions = {
      showScrollbar: true,
      showTimespans: true,
      timespans: [
        TIMESPAN_1M, TIMESPAN_3M, TIMESPAN_1Y, TIMESPAN_5Y, TIMESPAN_MAX,
      ],
      defaultTimespan: DEFAULT_CHART_TIMESPAN,
      showTooltip: true,
    };
    if (data && Object.keys(data).length > 0) {
      return (
        <div className="DeriRiskIndicator col-lg">
          {data.deriData && data.gemderiData && (
          <Row className="mb-3">
            <Col lg="6" md="6" xs="12">
              <DeriRiskIndicatorTile
                className="tile-left"
                data={data[`${TILE_TYPE_DERI}Data`]}
                onTileClick={this.onTileClick}
                isActive={data.activeChartSin === data[`${TILE_TYPE_DERI}Data`].sin.value}
                tileName={TILE_TYPE_DERI}
              />
            </Col>
            <Col lg="6" md="6" xs="12">
              <DeriRiskIndicatorTile
                className="tile-right"
                data={data[`${TILE_TYPE_GEM_DERI}Data`]}
                onTileClick={this.onTileClick}
                isActive={data.activeChartSin === data[`${TILE_TYPE_GEM_DERI}Data`].sin.value}
                tileName={TILE_TYPE_GEM_DERI}
              />
            </Col>
          </Row>
          )}

          {data.chartUrls && data.activeChartSin && (
            <Row className="mb-5">
              <Col>
                <AsyncChart
                  uniqKey={data.activeChartSin}
                  url={data.chartUrls[data.activeChartSin][
                    getActiveChartTimespanKey(data.activeChartTimespan)
                  ]}
                  timespan={data.activeChartTimespan}
                  options={chartOptions}
                  toggleChartTimespan={this.toggleChartTimespan}
                />
              </Col>
            </Row>
          )}

          {data.rows && data.rows.length > 0 && (
          <Row>
            <Col>
              {data.tableHeading && data.tableHeading[data.activeChartSin]
                && data.tableHeading[data.activeChartSin].description && (
                <h2 className="mb-4">{data.tableHeading[data.activeChartSin].description}</h2>
              )}
              <DeriRiskTable className="DeriRiskTable" marketInstrumentTableData={data} tableUniqKey={data.activeChartSin} />
            </Col>
          </Row>
          )}

          {data.descriptionRows && data.activeChartSin && (
          <Row>
            <Col className="description-rows">
              {data.descriptionRows[data.activeChartSin].title && (
              <h2>{data.descriptionRows[data.activeChartSin].title}</h2>
              )}
              {data.descriptionRows[data.activeChartSin].description
              && data.descriptionRows[data.activeChartSin].description.map(
                (content) => (<p key={content.substring(0, 10)}>{content}</p>),
              )}
            </Col>
          </Row>
          )}

          {data.accordion && (
          <Row>
            <Col>
              <Accordion data={getCmsAccordionComponentData(data)} />
            </Col>
          </Row>
          )}
        </div>
      );
    }
    return (
      <div className="DeriRiskIndicator col-lg">
        {isLoading && (
        <div className="mt-5 is-loading" />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.deriRiskIndicator.data,
    isLoading: state.deriRiskIndicator.isLoading,
    pageTitle: pathOr('', ['global', 'navigationItemData', 'pageTitle'], state),
  };
}

DeriRiskIndicator.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
  isLoading: PropTypes.bool,
  pageTitle: PropTypes.string,
};

DeriRiskIndicator.defaultProps = {
  dispatch: () => {},
  data: {},
  isLoading: false,
  pageTitle: '',
};

export default connect(mapStateToProps)(DeriRiskIndicator);
