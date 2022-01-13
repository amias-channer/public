import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MarketInstrumentTableMobile from '../MarketInstrumentTableMobile';
import { pathOrObject } from '../../../../utils/typeChecker';
import {
  calculateChange2PreviousClosePercentForRows,
  sortTableRowsBasedOnChange2PreviousClosePercent, tableDataHasRows,
} from '../MarketInstrumentTableLiveSorting/MarketInstrumentTableLiveSorting.helper';
import MarketInstrumentRowMobileLiveSortingComp from './MarketInstrumentRowMobileLiveSorting';
import { pushTickManagerClearData } from '../../../PushManager/PushableDefault/PushTickManager/actions';
import {
  pushManagerAddSubscription,
  pushManagerRemoveSubscription,
} from '../../../PushManager/actions';

class MarketInstrumentTableMobileLiveSorting extends MarketInstrumentTableMobile {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(pushTickManagerClearData());
    this.addPushSubscriptions();
  }

  componentWillUnmount() {
    this.removePushSubscriptions();
    this.clearPushTickTracker();
  }

  clearPushTickTracker() {
    const { dispatch } = this.props;
    dispatch(pushTickManagerClearData());
  }

  addPushSubscriptions() {
    const { dispatch, marketInstrumentTableData } = this.props;
    if (tableDataHasRows(marketInstrumentTableData)) {
      marketInstrumentTableData.rows.forEach((row) => {
        dispatch(pushManagerAddSubscription(row.price, 'valor'));
      });
    }
  }

  removePushSubscriptions() {
    const { dispatch, marketInstrumentTableData } = this.props;
    if (tableDataHasRows(marketInstrumentTableData)) {
      marketInstrumentTableData.rows.forEach((row) => {
        dispatch(pushManagerRemoveSubscription(row.price, 'valor'));
      });
    }
  }

  getMobileTiles() {
    const {
      marketInstrumentTableData,
      columns, tableUniqKey, parentTrackingName, isFirstTableRowSticky, pushData,
    } = this.props;
    if (!marketInstrumentTableData || !marketInstrumentTableData.rows) {
      return null;
    }
    const rowsWithCalculatedChange2PrevClose = calculateChange2PreviousClosePercentForRows(
      marketInstrumentTableData.rows,
      pushData,
    );
    const sortedRows = sortTableRowsBasedOnChange2PreviousClosePercent(
      rowsWithCalculatedChange2PrevClose,
      isFirstTableRowSticky,
    );
    return sortedRows.map((instrument) => (
      <MarketInstrumentRowMobileLiveSortingComp
        tableUniqKey={tableUniqKey}
        columns={columns}
        key={instrument.sin}
        instrument={instrument}
        parentTrackingName={parentTrackingName}
      />
    ));
  }
}
const mapStateToProps = (state) => ({
  pushData: pathOrObject({}, ['pushManager', 'pushData'], state),
});

MarketInstrumentTableMobileLiveSorting.propTypes = {
  dispatch: PropTypes.func,
  marketInstrumentTableData: PropTypes.objectOf(PropTypes.any),
};

MarketInstrumentTableMobileLiveSorting.defaultProps = {
  dispatch: () => {},
  marketInstrumentTableData: {
    rows: [],
  },
};

const marketInstrumentTableMobileLiveSortingConnected = connect(
  mapStateToProps,
)(MarketInstrumentTableMobileLiveSorting);

export default marketInstrumentTableMobileLiveSortingConnected;
