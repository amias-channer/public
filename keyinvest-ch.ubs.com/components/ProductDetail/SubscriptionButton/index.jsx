import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../../Button';
import './SubscriptionButton.scss';
import Overlay from '../../Overlay';
import Popup from '../../Popup';
import { adformTrackEventClick } from '../../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../../adformTracking/AdformTrackingVars';

const SubscriptionButton = ({
  data, buttonText, className, isin,
}) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const onPopupToggle = (event) => {
    if (isPopupOpen) {
      setPopupOpen(false);
      return;
    }
    setPopupOpen(true);
    adformTrackEventClick(
      event,
      'subscribe-trade-click',
      new AdformTrackingVars().setIsin(isin),
    );
  };
  return (
    <div className={classNames('SubscriptionButton', 'row', className)}>
      <div className="col-auto ml-auto">
        <Button
          size={BUTTON_SIZE.MEDIUM}
          color={BUTTON_COLOR.OLIVE}
          onClick={onPopupToggle}
        >
          {buttonText}
        </Button>
        {isPopupOpen && (
          <Overlay>
            <Popup togglePopup={onPopupToggle}>
              <h1>{data.title}</h1>
              <p>{data.text}</p>
            </Popup>
          </Overlay>
        )}
      </div>
    </div>
  );
};

SubscriptionButton.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  buttonText: PropTypes.string,
  className: PropTypes.string,
  isin: PropTypes.string,
};

SubscriptionButton.defaultProps = {
  data: {
    title: '',
    text: '',
  },
  buttonText: 'Subscribe',
  className: '',
  isin: '',
};

export default React.memo(SubscriptionButton);
