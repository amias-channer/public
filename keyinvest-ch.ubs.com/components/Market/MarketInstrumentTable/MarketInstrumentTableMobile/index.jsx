import React from 'react';
import { MarketInstrumentTableComponent } from '../index';
import MarketInstrumentRowMobile from './MarketInstrumentRowMobile';

class MarketInstrumentTableMobile extends MarketInstrumentTableComponent {
  getMobileTiles() {
    const {
      marketInstrumentTableData,
      columns, tableUniqKey, parentTrackingName,
    } = this.props;
    return marketInstrumentTableData.rows
      && marketInstrumentTableData.rows.length
      && marketInstrumentTableData.rows.map((instrument) => (
        <MarketInstrumentRowMobile
          tableUniqKey={tableUniqKey}
          columns={columns}
          key={instrument.sin}
          instrument={instrument}
          parentTrackingName={parentTrackingName}
        />
      ));
  }

  render() {
    const { className } = this.props;
    return (
      <div className={className}>
        {this.getMobileTiles()}
      </div>
    );
  }
}

export default MarketInstrumentTableMobile;
