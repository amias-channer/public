import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { produce } from 'immer';
import { MarketInstrumentRowMobileComponent } from '../../../../MarketInstrumentTable/MarketInstrumentTableMobile/MarketInstrumentRowMobile';
import './MarketGenericInstrumentRowMobile.scss';
import i18n from '../../../../../../utils/i18n';

class MarketGenericInstrumentRowMobile extends MarketInstrumentRowMobileComponent {
  constructor(props) {
    super(props);
    this.state = {
      buttonExpanded: false,
    };
    this.toggleInstrument = this.toggleInstrument.bind(this);
  }

  getProductLink() {
    const { instrument } = this.props;
    return (
      <NavLink to={instrument.productsLink || ''}>{i18n.t('Show product details')}</NavLink>
    );
  }

  toggleInstrument() {
    const { buttonExpanded } = this.state;
    if (buttonExpanded) {
      this.setState(produce((draft) => {
        draft.buttonExpanded = false;
      }));
    } else {
      this.setState(produce((draft) => {
        draft.buttonExpanded = true;
      }));
    }
  }

  render() {
    const { instrument, columns } = this.props;
    const { buttonExpanded } = this.state;
    return (
      <div className={classNames('MarketInstrumentRowMobile', 'MarketGenericInstrumentRowMobile')}>
        <div className="title">
          {instrument.name}
        </div>
        <div className="fields">
          {this.getColumnsContent(columns)}
        </div>
        <div className="">
          <button
            type="button"
            onClick={this.toggleInstrument}
            className={classNames('btn btn-outline clickable', (buttonExpanded ? 'expanded' : ''))}
          >
            <i className={classNames(buttonExpanded ? 'icon-arrow_02_up' : 'icon-arrow_02_down')} />
            {buttonExpanded && (
              <div>{this.getProductLink()}</div>
            )}
          </button>
        </div>

      </div>
    );
  }
}

export default MarketGenericInstrumentRowMobile;
