import React from 'react';
import { NavLink } from 'react-router-dom';
import { MarketInstrumentRowComponent } from '../../../MarketInstrumentTable/MarketInstrumentRow';
import { MOBILE_MODE } from '../../../../../utils/responsive';
import Flyout from '../../../../Flyout';
import i18n from '../../../../../utils/i18n';
import {
  dispatchAnalyticsClickTrack,
  NETCENTRIC_CTA_TYPE_LINK,
  NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_MORE_PARENT_CMP_NAME,
} from '../../../../../analytics/Analytics.helper';

class MarketGenericInstrumentRow extends MarketInstrumentRowComponent {
  constructor(props) {
    super(props);
    this.trackOnProductsLinkClick = this.trackOnProductsLinkClick.bind(this);
  }

  trackOnProductsLinkClick() {
    const { instrument } = this.props;
    dispatchAnalyticsClickTrack(
      i18n.t('Show products'),
      instrument.productsLink,
      NETCENTRIC_CTA_TYPE_LINK,
      NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_MORE_PARENT_CMP_NAME,
    );
  }

  getProductsLink() {
    const { instrument, setActiveInstrument, activeId } = this.props;
    return (
      <Flyout onFlyoutClick={setActiveInstrument} id={instrument.sin} activeId={activeId}>
        <div className="content">
          <NavLink to={instrument.productsLink} onClick={this.trackOnProductsLinkClick}>
            {i18n.t('Show products')}
          </NavLink>
        </div>
      </Flyout>
    );
  }

  getColumnsContentConfig() {
    const { instrument } = this.props;
    return {
      default: {
        name: instrument.name,
        price: this.getPrice(),
        change2PreviousClose: this.getChange2PreviousClose(),
        change2PreviousClosePercent: this.getChange2PreviousClosePercent(),
        lastChange: this.getLastChange(),
        productLink: this.getProductsLink(),
      },
      [MOBILE_MODE]: {
        change2PreviousClosePercent: this.getChange2PreviousClosePercent(MOBILE_MODE),
      },
    };
  }

  getRowContent() {
    const { columns } = this.props;
    return (
      <>
        <tr ref={this.ref}>
          {this.getColumnsContent(columns)}
        </tr>
      </>
    );
  }
}

export default MarketGenericInstrumentRow;
