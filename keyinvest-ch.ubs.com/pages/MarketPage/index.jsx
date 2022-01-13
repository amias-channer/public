import React from 'react';
import { Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LeftHandNavigation from '../../components/LeftHandNavigation';

import MarketGenericLayout from '../../components/Market/MarketGenericLayout';
import DiscountBarometer from '../../components/Market/DiscountBarometer';
import VolatilityMonitor from '../../components/Market/VolatilityMonitor';
import {
  STATE_NAME_MARKET_MEMBERS,
  STATE_NAME_MARKET_DERI_RISK_INDICATOR,
  STATE_NAME_MARKET_COMMODITY_MONITOR,
  STATE_NAME_MARKET_DISCOUNT_BAROMETER,
  STATE_NAME_MARKET_FX_PRECIOUS_METALS,
  STATE_NAME_MARKET_OVERVIEW,
  STATE_NAME_MARKET_ROOT_NAVIGATION_STATE,
  STATE_NAME_MARKET_VOLATILITY_MONITOR,
} from '../../main/constants';
import AbstractPage from '../AbstractPage';
import { MOBILE_MODE, TABLET_MODE } from '../../utils/responsive';
import MarketMembersTable from '../../components/Market/MarketMembersTable';
import DeriRiskIndicatorPage from '../../components/Market/DeriRiskIndicator';
import { getSubNavigationByStateName, mapPageStateNameToComponent } from '../../utils/utils';

const marketSubStateToComponent = {
  [STATE_NAME_MARKET_OVERVIEW]: MarketGenericLayout,
  [STATE_NAME_MARKET_DISCOUNT_BAROMETER]: DiscountBarometer,
  [STATE_NAME_MARKET_VOLATILITY_MONITOR]: VolatilityMonitor,
  [STATE_NAME_MARKET_FX_PRECIOUS_METALS]: MarketGenericLayout,
  [STATE_NAME_MARKET_MEMBERS]: MarketMembersTable,
  [STATE_NAME_MARKET_DERI_RISK_INDICATOR]: DeriRiskIndicatorPage,
  [STATE_NAME_MARKET_COMMODITY_MONITOR]: MarketGenericLayout,
};

export class MarketPageComponent extends AbstractPage {
  render() {
    const { stateName, location, responsiveMode } = this.props;
    const MarketSubComponent = mapPageStateNameToComponent(stateName, marketSubStateToComponent);
    return (
      <div className="MarketPage">
        {this.getHelmetData()}
        <Row>
          {responsiveMode !== MOBILE_MODE && responsiveMode !== TABLET_MODE && (
            <LeftHandNavigation
              data={{
                navigation: getSubNavigationByStateName(STATE_NAME_MARKET_ROOT_NAVIGATION_STATE),
              }}
              className="col-lg-auto"
            />
          )}
          {MarketSubComponent && <MarketSubComponent stateName={stateName} location={location} />}
        </Row>
      </div>
    );
  }
}

MarketPageComponent.propTypes = {
  stateName: PropTypes.string,
};
MarketPageComponent.defaultProps = {
  stateName: '',
};
const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});
const MarketPage = connect(mapStateToProps)(MarketPageComponent);
export default MarketPage;
