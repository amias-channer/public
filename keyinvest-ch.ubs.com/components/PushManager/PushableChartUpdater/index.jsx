import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import {
  PushableDefaultComponent,
  pushableMapStateToProps,
} from '../PushableDefault';
import { PUSHABLE_DISPLAY_MODE } from '../PushableDefault/PushableDefault.helper';
import { chartManagerPushableChartUpdate } from '../../Chart/ChartManager/actions';
import { getResultFromPushData } from './PushableChartUpdater.helper';

export class PushableChartUpdaterComponent extends PushableDefaultComponent {
  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    const {
      dispatch, chartUniqId, field,
      fieldPushData, chartDataSetIndex, exportPushResultFunc,
    } = this.props;
    const pushResult = getResultFromPushData(fieldPushData, field);
    dispatch(chartManagerPushableChartUpdate(
      chartUniqId, pushResult, chartDataSetIndex, exportPushResultFunc,
    ));
  }

  render() {
    return null;
  }
}

PushableChartUpdaterComponent.defaultProps = {
  showInitialValue: PropTypes.bool,
  chartUniqId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  chartDataSetIndex: PropTypes.number.isRequired,
  exportPushResultFunc: PropTypes.func,
};
PushableChartUpdaterComponent.defaultProps = {
  displayMode: PUSHABLE_DISPLAY_MODE.CHART_UPDATER,
  exportPushResultFunc: () => {},
};
const PushableChartUpdater = connect(pushableMapStateToProps)(PushableChartUpdaterComponent);
export default PushableChartUpdater;
