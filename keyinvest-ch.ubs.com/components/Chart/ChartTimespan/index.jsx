import React, { PureComponent } from 'react';
import { path } from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import MediaQuery from 'react-responsive';
import mediaQueries from '../../../utils/mediaQueries';
import './ChartTimespan.scss';
import { DEFAULT_CHART_TIMESPANS_OPTIONS } from '../Chart.helper';
import i18n from '../../../utils/i18n';
import {
  chartManagerEmitZoomToEvent,
  chartManagerSetCurrentTimespan,
} from '../ChartManager/actions';

export class ChartTimespanComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
    const { uniqId, timespan, dispatch } = props;

    dispatch(chartManagerSetCurrentTimespan(uniqId, timespan || path(['chart', 'options', 'defaultTimespan'])(props)));
  }

  componentDidMount() {
    const { chart, uniqId, dispatch } = this.props;
    if (chart && chart.on) {
      chart.on('zoomed', (data) => {
        if (data.type === 'timespan') return;
        dispatch(chartManagerSetCurrentTimespan(uniqId, null));
      });
    }
  }

  onClickHandler(newTimespan) {
    const {
      dispatch, uniqId, toggleChartTimespan, currentTimespan,
    } = this.props;
    if (currentTimespan === newTimespan) return;

    dispatch(chartManagerSetCurrentTimespan(uniqId, newTimespan));
    dispatch(chartManagerEmitZoomToEvent(uniqId, newTimespan));

    if (typeof toggleChartTimespan === 'function') {
      toggleChartTimespan(newTimespan);
    }
  }

  buttons() {
    const { timespans, currentTimespan } = this.props;
    return timespans.map((timespan) => (
      <Button
        key={timespan}
        onClick={() => this.onClickHandler(timespan)}
        className={currentTimespan === timespan ? 'active' : ''}
      >
        {i18n.t(timespan)}
      </Button>
    ));
  }

  render() {
    const { timespans, currentTimespan, showTimespans } = this.props;
    if (!showTimespans) {
      return null;
    }
    return (
      <div className="ChartTimespan ct-chart-timespans">
        <MediaQuery query={mediaQueries.mobileOnly}>
          <UncontrolledDropdown>
            <DropdownToggle caret>
              {currentTimespan}
            </DropdownToggle>
            <DropdownMenu>
              {timespans.map((timespan) => (
                <div key={timespan}>
                  <DropdownItem
                    onClick={() => this.onClickHandler(timespan)}
                    className={timespan === currentTimespan ? 'active' : null}
                  >
                    {i18n.t(timespan)}
                  </DropdownItem>
                </div>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </MediaQuery>
        <MediaQuery query={mediaQueries.tablet}>
          <ButtonGroup className="btn-wrapper">
            {this.buttons()}
          </ButtonGroup>
        </MediaQuery>
      </div>
    );
  }
}

ChartTimespanComponent.propTypes = {
  uniqId: PropTypes.string.isRequired,
  dispatch: PropTypes.func,
  timespans: PropTypes.arrayOf(PropTypes.string),
  currentTimespan: PropTypes.string,
  timespan: PropTypes.string,
  chart: PropTypes.objectOf(PropTypes.any),
  toggleChartTimespan: PropTypes.func,
  showTimespans: PropTypes.bool,
};

ChartTimespanComponent.defaultProps = {
  timespans: DEFAULT_CHART_TIMESPANS_OPTIONS,
  timespan: null,
  chart: {},
  toggleChartTimespan: () => {},
  dispatch: () => {},
  currentTimespan: null,
  showTimespans: true,
};
const mapStateToProps = (state, ownProps) => ({
  currentTimespan: path(['chartManager', ownProps.uniqId, 'currentTimespan'])(state),
});
const ChartTimespan = connect(mapStateToProps)(ChartTimespanComponent);
export default ChartTimespan;
