import { connect } from 'react-redux';
import React from 'react';
import { MarketInstrumentRowMapStateToProps } from '../../MarketInstrumentRow';
import {
  getAbsoluteField, getLastChangeField,
  getPercentField,
  getPushDataByValor,
} from '../../MarketInstrumentTableLiveSorting/MarketInstrumentTableLiveSorting.helper';
import ChangePercentValuePresenter
  from '../../../../PushManager/PushableChangePercent/ChangePercentValuePresenter';
import { MarketInstrumentRowMobileComponent } from '../../MarketInstrumentTableMobile/MarketInstrumentRowMobile';
import ChangeAbsoluteValuePresenter
  from '../../../../PushManager/PushableChangeAbsolute/ChangeAbsoluteValuePresenter';
import TimestampValuePresenter
  from '../../../../PushManager/PushableTimestamp/TimestampValuePresenter';
import PushTickManagerComp
  from '../../../../PushManager/PushableDefault/PushTickManager';

class MarketInstrumentRowMobileLiveSorting extends MarketInstrumentRowMobileComponent {
  getChange2PreviousClosePercent() {
    const { instrument, maxForPercentCalc } = this.props;
    return (
      <ChangePercentValuePresenter
        field={getPercentField(instrument)}
        maxForPercentCalc={maxForPercentCalc}
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
const marketInstrumentRowMobileLiveSortingConnected = connect(
  MarketInstrumentRowMapStateToProps,
)(MarketInstrumentRowMobileLiveSorting);

export default marketInstrumentRowMobileLiveSortingConnected;
