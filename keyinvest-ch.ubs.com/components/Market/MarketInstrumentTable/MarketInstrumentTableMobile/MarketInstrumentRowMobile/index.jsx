import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import i18n from '../../../../../utils/i18n';
import {
  MarketInstrumentRowComponent,
  MarketInstrumentRowMapStateToProps,
} from '../../MarketInstrumentRow';
import './MarketInstrumentRowMobile.scss';
import MarketInstrumentDetailsComp from '../../../MarketInstrumentDetails';

export class MarketInstrumentRowMobileComponent extends MarketInstrumentRowComponent {
  getColumnsContent(columns) {
    if (columns && columns.length) {
      return columns.map((col) => (
        <div
          className="field row"
          key={col.columnKey}
        >
          <div className="field-name col-8">{i18n.t(col.columnKey)}</div>
          <div className="field-value col-4">{this.getColumnContent(col.columnKey)}</div>
        </div>
      ));
    }
    return null;
  }

  render() {
    const {
      instrumentDetails, instrument, columns, responsiveMode,
    } = this.props;
    const chartTimespan = instrumentDetails && instrumentDetails.data ? instrumentDetails.data.chartTimespan : '';
    return (
      <div className={classNames('MarketInstrumentRowMobile', instrumentDetails && instrumentDetails.data ? 'open' : '')} ref={this.ref}>
        <div className="title">
          {instrument.name}
        </div>
        <div className="fields">
          {this.getColumnsContent(columns)}
        </div>
        <div className="">
          {instrumentDetails && (
          <div className="instrument-table-details mobile">
              {instrumentDetails.isLoading && (
                <div className="mt-5 is-loading" />
              )}

            <MarketInstrumentDetailsComp
              instrument={instrument}
              instrumentDetails={instrumentDetails.data ? instrumentDetails.data : {}}
              onActiveGroupChange={this.onActiveGroupChange}
              responsiveMode={responsiveMode}
              toggleChartTimespan={this.toggleChartTimespan}
              chartTimespan={chartTimespan}
            />
          </div>
          )}
          <button
            type="button"
            onClick={this.toggleInstrument}
            className="btn btn-outline clickable"
          >
            <i className={classNames(instrumentDetails && instrumentDetails.data ? 'icon-arrow_02_up' : 'icon-arrow_02_down')} />
          </button>
        </div>

      </div>
    );
  }
}

const MarketInstrumentRowMobile = connect(
  MarketInstrumentRowMapStateToProps,
)(MarketInstrumentRowMobileComponent);

export default MarketInstrumentRowMobile;
