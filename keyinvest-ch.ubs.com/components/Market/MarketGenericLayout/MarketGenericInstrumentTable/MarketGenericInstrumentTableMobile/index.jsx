import React from 'react';
import MarketGenericInstrumentTable from '../index';
import MarketGenericInstrumentRowMobile from './MarketGenericInstrumentRowMobile';
import { MOBILE_MODE } from '../../../../../utils/responsive';
import './MarketGenericInstrumentTableMobile.scss';

class MarketGenericInstrumentTableMobile extends MarketGenericInstrumentTable {
  getMobileTiles() {
    const { marketInstrumentTableData, columns, tableUniqKey } = this.props;
    return marketInstrumentTableData.rows
            && marketInstrumentTableData.rows.length
            && marketInstrumentTableData.rows.map((instrument) => (
              <MarketGenericInstrumentRowMobile
                tableUniqKey={tableUniqKey}
                columns={columns}
                key={instrument.sin}
                instrument={instrument}
                responsiveMode={MOBILE_MODE}
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

export default MarketGenericInstrumentTableMobile;
