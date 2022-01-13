import React from 'react';
import { connect } from 'react-redux';
import {
  MarketInstrumentRowComponent,
  MarketInstrumentRowMapStateToProps,
} from '../../MarketInstrumentRow';
import {
  getAbsoluteField,
  getLastChangeField,
  getPercentField,
  getPushDataByValor,
} from '../MarketInstrumentTableLiveSorting.helper';
import TimestampValuePresenter
  from '../../../../PushManager/PushableTimestamp/TimestampValuePresenter';
import ChangeAbsoluteValuePresenter
  from '../../../../PushManager/PushableChangeAbsolute/ChangeAbsoluteValuePresenter';
import PercentWithBarValuePresenter
  from '../../../../PushManager/PushablePercentWithBar/PrecentWithBarValuePresenter';
import PushTickManagerComp from '../../../../PushManager/PushableDefault/PushTickManager';

export class MarketInstrumentRowLiveSorting extends MarketInstrumentRowComponent {
  getChange2PreviousClosePercent() {
    const { instrument, maxForPercentCalc, pushData } = this.props;
    const fieldPushData = getPushDataByValor(instrument.valor, pushData);
    return (
      <PercentWithBarValuePresenter
        maxForPercentCalc={maxForPercentCalc}
        field={getPercentField(instrument)}
        fieldPushData={fieldPushData}
      />
    );
  }

  getChange2PreviousClose() {
    const { instrument, pushData } = this.props;
    const fieldPushData = getPushDataByValor(instrument.valor, pushData);
    return (
      <ChangeAbsoluteValuePresenter
        field={getAbsoluteField(instrument)}
        fieldPushData={fieldPushData}
      />
    );
  }

  getLastChange() {
    const { instrument, pushData } = this.props;
    const fieldPushData = getPushDataByValor(instrument.valor, pushData);
    return (
      <TimestampValuePresenter
        field={getLastChangeField(instrument)}
        fieldPushData={fieldPushData}
      />
    );
  }

  getPrice() {
    const { instrument, pushData } = this.props;
    const fieldPushData = getPushDataByValor(instrument.valor, pushData);
    return (
      <PushTickManagerComp
        field={instrument.price}
        fieldPushData={fieldPushData}
      />
    );
  }
}
const MarketInstrumentRowLiveSortingConnected = connect(
  MarketInstrumentRowMapStateToProps,
)(MarketInstrumentRowLiveSorting);
export default MarketInstrumentRowLiveSortingConnected;
