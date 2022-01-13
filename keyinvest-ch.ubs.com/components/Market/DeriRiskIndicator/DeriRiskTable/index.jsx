import React from 'react';
import { path } from 'ramda';
import { MarketInstrumentTableComponent } from '../../MarketInstrumentTable';
import DeriRiskTableRow from './DeriRiskTableRow';
import './DeriRiskTable.scss';
import i18n from '../../../../utils/i18n';

class DeriRiskTable extends MarketInstrumentTableComponent {
  // eslint-disable-next-line class-methods-use-this
  getTableColumn(column) {
    return (<span>{i18n.t(column)}</span>);
  }

  getTableColumns() {
    const { marketInstrumentTableData } = this.props;
    const columnsToRender = marketInstrumentTableData.columnsToRender
                            && Object.keys(marketInstrumentTableData.columnsToRender);
    return (
      <tr>
        {columnsToRender.length > 0 && columnsToRender.map((column) => (
          <th key={column}>
            {this.getTableColumn(column)}
          </th>
        ))}
      </tr>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  getTableRowId(instrument) {
    return path(['isin', 'value'])(instrument);
  }

  getTableRow(instrument) {
    const { tableUniqKey, marketInstrumentTableData } = this.props;
    return (
      <DeriRiskTableRow
        columns={Object.keys(marketInstrumentTableData.columnsToRender)}
        key={this.getTableRowId(instrument)}
        tableUniqKey={tableUniqKey}
        instrument={instrument}
      />
    );
  }
}

export default DeriRiskTable;
