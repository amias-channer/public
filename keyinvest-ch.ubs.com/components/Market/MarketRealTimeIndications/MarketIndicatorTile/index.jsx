import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './MarketIndicatorTile.scss';
import {
  PUSHABLE_DISPLAY_MODE,
} from '../../../PushManager/PushableDefault/PushableDefault.helper';
import PushableDefault from '../../../PushManager/PushableDefault';
import PushableChangePercent from '../../../PushManager/PushableChangePercent';
import TrendPeriod from '../TrendPeriod';
import { MARKET_INSTRUMENT_IDENTIFIER } from '../../MarketGenericLayout/MarketGenericLayout.helper';

export class MarketIndicatorTileComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler() {
    const { selectInstrument, field } = this.props;
    selectInstrument(field[MARKET_INSTRUMENT_IDENTIFIER], field.name);
  }

  render() {
    const { className, field } = this.props;
    return (
      <PushableDefault
        displayMode={PUSHABLE_DISPLAY_MODE.COLOR_BAR}
        field={field}
        className={classNames('IndicatorTile', 'MarketIndicatorTile', className)}
      >
        <div
          className="inner-wrapper color-bar"
          onClick={this.onClickHandler}
          onKeyDown={this.onClickHandler}
          role="button"
          tabIndex="0"
        >
          <div className="name">{field.name}</div>
          <div className="pushable-val"><PushableDefault field={field} /></div>
          <PushableChangePercent field={field} />
          <TrendPeriod field={field} />
        </div>
      </PushableDefault>
    );
  }
}

MarketIndicatorTileComponent.propTypes = {
  className: PropTypes.string,
  field: PropTypes.objectOf(PropTypes.any),
  selectInstrument: PropTypes.func,
};

MarketIndicatorTileComponent.defaultProps = {
  className: 'col-lg-2',
  field: {},
  selectInstrument: () => {},
};

const MarketIndicatorTile = MarketIndicatorTileComponent;
export default MarketIndicatorTile;
