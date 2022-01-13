import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import i18n from '../../../utils/i18n';
import Brokers from './Brokers';
import './PriceTile.scss';
import { isModeFlatex } from '../../../utils/utils';
import {
  adformTrackEventClick,
} from '../../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../../adformTracking/AdformTrackingVars';

const PriceTileCmp = ({
  className, tileData, buttonClassName, isin,
}) => {
  const trackAdformEvent = (event, eventType) => {
    adformTrackEventClick(
      event,
      `trade-${tileData.buttonLabel}-${eventType}`,
      new AdformTrackingVars().setIsin(isin),
    );
  };
  const onButtonClick = (event) => {
    event.preventDefault();
    adformTrackEventClick(
      event,
      `trade-${tileData.buttonLabel}-click`,
      new AdformTrackingVars().setIsin(isin),
    );
  };

  const onFocus = (event) => {
    event.preventDefault();
  };

  const onMouseOver = (event) => {
    if (event && event.persist) {
      event.persist();
    }
    trackAdformEvent(event, 'hover');
  };
  return (
    <>
      {tileData && tileData.showPriceTile && (
        <div className={classNames('PriceTile', 'col-lg-6', className)}>
          <div className="inner-wrapper">
            <div className="title">{tileData.title}</div>
            <div className="price">
              <span>{tileData.price}</span>
              &nbsp;
              <span>{tileData.currency}</span>
            </div>
            <div className="volume">
              {i18n.t('volume')}
              :
              {tileData.volume}
            </div>
          </div>
          <div className="row trade-buttons-container">
            {!isModeFlatex() && tileData.brokers && tileData.brokers.length > 0 && (
              <>
                <button
                  type="button"
                  onFocus={onFocus}
                  onMouseOver={onMouseOver}
                  onClick={onButtonClick}
                  className={classNames('w-100 btn btn-secondary action-button', buttonClassName)}
                >
                  {i18n.t(tileData.buttonLabel)}
                </button>
                <Brokers list={tileData.brokers} isin={isin} />
              </>
            )}

            {isModeFlatex() && tileData.brokers && tileData.brokers.length > 0 && (
              <a
                className={classNames('btn', 'w-100', buttonClassName)}
                href={tileData.brokers[0].link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {i18n.t(tileData.buttonLabel)}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

PriceTileCmp.propTypes = {
  className: PropTypes.string,
  tileData: PropTypes.objectOf(PropTypes.any),
  buttonClassName: PropTypes.string,
  isin: PropTypes.string,
};
PriceTileCmp.defaultProps = {
  className: '',
  tileData: {
    showPriceTile: false,
    price: null,
    currency: null,
    volume: null,
  },
  buttonClassName: '',
  isin: '',
};

const PriceTile = React.memo(PriceTileCmp);
export default PriceTile;
