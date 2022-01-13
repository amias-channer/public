import React from 'react';
import classNames from 'classnames';
import { produce } from 'immer';
import {
  getMaxPercentFromAllRows,
  MarketInstrumentTableComponent,
} from '../../MarketInstrumentTable';
import MarketGenericInstrumentRow from './MarketGenericInstrumentRow';
import './MarketGenericInstrumentTable.scss';
import i18n from '../../../../utils/i18n';
import { SORT_DESC } from '../../../../utils/utils';
import MarketGenericTableColumnHeader from './MarketGenericTableColumnHeader';

class MarketGenericInstrumentTable extends MarketInstrumentTableComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeInstrument: null,
    };
    this.setActiveInstrument = this.setActiveInstrument.bind(this);
  }

  setActiveInstrument(id) {
    const { activeInstrument } = this.state;
    if (activeInstrument === id) {
      this.setState(produce((draft) => {
        draft.activeInstrument = null;
      }));
    } else {
      this.setState(produce((draft) => {
        draft.activeInstrument = id;
      }));
    }
  }

  getTableColumn(column) {
    let sortIcon = null;
    const { sortedByColumn, onTableSort } = this.props;
    if (column && Array.isArray(column)) {
      return column.map((col) => this.getTableColumn(col));
    }
    if (sortedByColumn && column.columnKey in sortedByColumn) {
      sortIcon = (
        <i
          className={classNames(
            'sort-icon',
            sortedByColumn[column.columnKey] === SORT_DESC ? 'icon-triangle-down' : 'icon-triangle-up',
          )}
        />
      );
    }
    return (
      <MarketGenericTableColumnHeader
        columnName={column.columnKey}
        onItemClick={onTableSort}
        sortedByColumn={sortedByColumn}
      >
        {('columnText' in column ? column.columnText : i18n.t(column.columnKey))}
        {' '}
        {sortIcon}
      </MarketGenericTableColumnHeader>
    );
  }

  getTableRow(instrument) {
    const { marketInstrumentTableData, columns, tableUniqKey } = this.props;
    const { activeInstrument } = this.state;
    let maxForPercentCalc = 0;
    if (marketInstrumentTableData.rows && marketInstrumentTableData.rows.length) {
      maxForPercentCalc = getMaxPercentFromAllRows(marketInstrumentTableData.rows, 'change2PreviousClosePercentRaw');
    }
    return (
      <MarketGenericInstrumentRow
        key={instrument.sin}
        tableUniqKey={tableUniqKey}
        columns={columns}
        maxForPercentCalc={maxForPercentCalc}
        instrument={instrument}
        setActiveInstrument={this.setActiveInstrument}
        activeId={activeInstrument}
      />
    );
  }

  render() {
    const { className, isLoading } = this.props;
    return (
      <div className={classNames('MarketGenericInstrumentTable table-container-rows-hover-effect', className)}>
        <table className="table table-default rows-hover-effect">
          <thead>
            {this.getTableColumns()}
          </thead>
          <tbody>
            {isLoading && (
            <div className="mt-5 is-loading" />
            )}
            {this.getTableRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MarketGenericInstrumentTable;
