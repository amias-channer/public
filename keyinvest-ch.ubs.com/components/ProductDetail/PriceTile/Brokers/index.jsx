import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Brokers.scss';
import { adformTrackEventClick } from '../../../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../../../adformTracking/AdformTrackingVars';

const BrokersCmp = ({
  className, list, isin,
}) => {
  const onBrokerLinkClick = (event, brokerLabel) => {
    adformTrackEventClick(
      event,
      'trade-click',
      new AdformTrackingVars().setIsin(isin).setBroker(brokerLabel),
    );
  };
  return (
    <>
      {list.length > 0 && (
        <div className={classNames('Brokers', className)}>
          {list.map((broker) => (
            <div className="broker" key={broker.key}>
              <a
                href={broker.link}
                className={broker.key}
                target="_blank"
                rel="noopener noreferrer"
                title={broker.label}
                onClick={(event) => onBrokerLinkClick(event, broker.label)}
              >
                <i className="icon-link-external" />
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
BrokersCmp.propTypes = {
  className: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.any),
  isin: PropTypes.string,
};
BrokersCmp.defaultProps = {
  className: '',
  list: [],
  isin: '',
};

const Brokers = React.memo(BrokersCmp);
export default Brokers;
