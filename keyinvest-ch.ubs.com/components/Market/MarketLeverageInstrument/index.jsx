import React, { useState } from 'react';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import PropTypes from 'prop-types';
import './MarketLeverageInstrument.scss';
import { pathOr } from 'ramda';
import mediaQueries from '../../../utils/mediaQueries';
import {
  getAllColumns,
} from './MarketLeverageInstrument.helper';
import { DESKTOP_MODE } from '../../../utils/responsive';
import MarketLeverageInstrumentDetails from './MarketLeverageInstrumentDetails';
import GenericFields from './MarketLeverageInstrumentDetails/GenericFields';
import {
  dispatchAnalyticsProductClickTrack, NETCENTRIC_CTA_TYPE_EXPAND_CLICK,
} from '../../../analytics/Analytics.helper';

function MarketLeverageInstrument(props) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data, type, responsiveMode, className, parentTrackingComponentName,
  } = props;
  const columns = getAllColumns(data);

  const toggleDetails = () => {
    if (!isOpen) {
      // Track when the details will be opened
      dispatchAnalyticsProductClickTrack(
        pathOr('', ['name'], data),
        '',
        NETCENTRIC_CTA_TYPE_EXPAND_CLICK,
        parentTrackingComponentName,
        pathOr('', ['isin'], data),
      );
    }
    setIsOpen(!isOpen);
  };
  return (
    <div className={classNames('MarketLeverageInstrument', className)}>
      <div
        className="instrument-header row"
        onClick={toggleDetails}
        onKeyDown={toggleDetails}
        role="button"
        tabIndex="0"
      >
        <div className="ml-1"><span className={`rounded-circle type-ic ${String(type).toLowerCase()}`}>{String(type[0]).toUpperCase()}</span></div>
        <div className="col align-self-center"><span className="name">{data.name}</span></div>
        <MediaQuery query={mediaQueries.tablet}>
          {!isOpen && <GenericFields fields={columns} fieldClassName="pr-1 mr-1 pr-lg-3 mr-lg-3" />}
        </MediaQuery>
        <div className="mr-1">
          <i className={`toggle-details ${isOpen ? 'icon-arrow_02_up' : 'icon-arrow_02_down'}`} />
        </div>
      </div>
      { isOpen && (
        <MarketLeverageInstrumentDetails
          data={data}
          responsiveMode={responsiveMode}
          className="instrument-details"
          parentTrackingComponentName={parentTrackingComponentName}
        />
      )}
    </div>
  );
}
MarketLeverageInstrument.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  type: PropTypes.string.isRequired,
  responsiveMode: PropTypes.string,
  className: PropTypes.string,
  parentTrackingComponentName: PropTypes.string,
};

MarketLeverageInstrument.defaultProps = {
  data: {},
  responsiveMode: DESKTOP_MODE,
  className: '',
  parentTrackingComponentName: 'Markets Instrument Details',
};

export default React.memo(MarketLeverageInstrument);
