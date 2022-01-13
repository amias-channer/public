import React from 'react';
import PropTypes from 'prop-types';
import { max, reduce } from 'ramda';
import { connect } from 'react-redux';
import MarketInstrumentRow from './MarketInstrumentRow';
import './MarketInstrumentTable.scss';
import i18n from '../../../utils/i18n';
import Logger from '../../../utils/logger';
import {
  marketInstrumentTableWillUnmount,
} from './actions';

export const getMaxPercentFromAllRows = (rows, change2PreviousClosePercentRawFieldName) => {
  try {
    const list = rows.map(
      (instrument) => Math.abs(instrument[change2PreviousClosePercentRawFieldName]),
    );
    return reduce(max, -Infinity, list);
  } catch (e) {
    Logger.error(e);
  }
  return 0;
};
export class MarketInstrumentTableComponent extends React.PureComponent {
  componentWillUnmount() {
    const { dispatch, tableUniqKey } = this.props;
    dispatch(marketInstrumentTableWillUnmount(tableUniqKey));
  }

  getTableColumn(column) {
    if (column && Array.isArray(column)) {
      return column.map((col) => this.getTableColumn(col));
    }
    return (
      <span key={column.columnKey} id={column.columnKey}>
        {('columnText' in column ? column.columnText : i18n.t(column.columnKey))}
        {('superScriptText' in column ? (<sup>{column.superScriptText}</sup>) : '')}
      </span>
    );
  }

  getTableColumns() {
    const { columns } = this.props;
    return (
      <tr>
        {columns.map((column) => (
          <th key={Array.isArray(column) && column.length ? column[0].columnKey : column.columnKey}>
            {this.getTableColumn(column)}
          </th>
        ))}
      </tr>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  getTableRowId(instrument) {
    return instrument.sin;
  }

  getTableRow(instrument) {
    const {
      marketInstrumentTableData, columns, tableUniqKey, parentTrackingName,
    } = this.props;

    let maxForPercentCalc = 0;
    if (marketInstrumentTableData.rows && marketInstrumentTableData.rows.length) {
      maxForPercentCalc = getMaxPercentFromAllRows(
        marketInstrumentTableData.rows, 'change2PreviousClosePercent',
      );
    }
    return (
      <MarketInstrumentRow
        key={this.getTableRowId(instrument)}
        tableUniqKey={tableUniqKey}
        columns={columns}
        maxForPercentCalc={maxForPercentCalc}
        instrument={instrument}
        parentTrackingName={parentTrackingName}
      />
    );
  }

  getTableRows() {
    const { marketInstrumentTableData } = this.props;

    return marketInstrumentTableData.rows
      && marketInstrumentTableData.rows.length
      && marketInstrumentTableData.rows.map((instrument) => this.getTableRow(instrument));
  }

  render() {
    const { className } = this.props;
    return (
      <div className={className}>
        <table className="table table-default">
          <thead>
            {this.getTableColumns()}
          </thead>
          <tbody>
            {this.getTableRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

MarketInstrumentTableComponent.propTypes = {
  marketInstrumentTableData: PropTypes.objectOf(PropTypes.any),
  columns: PropTypes.arrayOf(PropTypes.any),
  tableUniqKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  dispatch: PropTypes.func,
  className: PropTypes.string,
  parentTrackingName: PropTypes.string,
};

MarketInstrumentTableComponent.defaultProps = {
  marketInstrumentTableData: {},
  columns: null,
  dispatch: () => {},
  className: '',
  parentTrackingName: '',
};

const MarketInstrumentTable = connect()(MarketInstrumentTableComponent);
export default MarketInstrumentTable;
