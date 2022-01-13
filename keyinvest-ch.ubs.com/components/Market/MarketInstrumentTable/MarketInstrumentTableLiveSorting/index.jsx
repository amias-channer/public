import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getMaxPercentFromAllRows,
  MarketInstrumentTableComponent,
} from '../index';
import {
  pushManagerAddSubscription,
  pushManagerRemoveSubscription,
} from '../../../PushManager/actions';
import {
  calculateChange2PreviousClosePercentForRows,
  sortTableRowsBasedOnChange2PreviousClosePercent,
  tableDataHasRows,
} from './MarketInstrumentTableLiveSorting.helper';
import { pathOrObject } from '../../../../utils/typeChecker';
import MarketInstrumentRowLiveSortingComp from './MarketInstrumentRowLiveSorting';
import { pushTickManagerClearData } from '../../../PushManager/PushableDefault/PushTickManager/actions';

export class MarketInstrumentTableLiveSorting extends MarketInstrumentTableComponent {
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

  getTableRow(instrument) {
    const {
      marketInstrumentTableData, columns, tableUniqKey, parentTrackingName, pushData,
    } = this.props;
    let maxForPercentCalc = 0;
    if (marketInstrumentTableData.rows && marketInstrumentTableData.rows.length) {
      maxForPercentCalc = getMaxPercentFromAllRows(
        marketInstrumentTableData.rows, 'change2PreviousClosePercent',
      );
    }
    return (
      <MarketInstrumentRowLiveSortingComp
        key={this.getTableRowId(instrument)}
        tableUniqKey={tableUniqKey}
        columns={columns}
        maxForPercentCalc={maxForPercentCalc}
        instrument={instrument}
        parentTrackingName={parentTrackingName}
        pushData={pushData}
      />
    );
  }

  getTableRows() {
    const { marketInstrumentTableData, pushData, isFirstTableRowSticky } = this.props;
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
    return sortedRows.map((instrument) => this.getTableRow(instrument));
  }
}

const mapStateToProps = (state) => ({
  pushData: pathOrObject({}, ['pushManager', 'pushData'], state),
});

MarketInstrumentTableLiveSorting.propTypes = {
  dispatch: PropTypes.func,
  marketInstrumentTableData: PropTypes.objectOf(PropTypes.any),
};

MarketInstrumentTableLiveSorting.defaultProps = {
  dispatch: () => {},
  marketInstrumentTableData: {
    rows: [],
  },
};

const marketInstrumentTableLiveSortConnected = connect(
  mapStateToProps,
)(MarketInstrumentTableLiveSorting);
export default marketInstrumentTableLiveSortConnected;
