import React from 'react';
import PropTypes from 'prop-types';
import i18n from '../../../utils/i18n';
import MarketTopLeverage from '../MarketTopLeverage';
import AsyncChart from '../../Chart/AsyncChart';
import './MarketInstrumentDetails.scss';
import { generateUniqId } from '../../../utils/utils';
import { DESKTOP_MODE } from '../../../utils/responsive';
import { getActiveChartTimespanKey } from '../MarketGenericLayout/MarketGenericLayout.helper';

export const removeStarSymbol = (text) => (
  text && text.length && text.indexOf('*') === text.length - 1 ? text.substring(0, text.length - 1) : text
);

export default class MarketInstrumentDetails extends React.PureComponent {
  render() {
    const {
      instrumentDetails, instrument, uniqKey, onActiveGroupChange, chartOptions, responsiveMode,
      toggleChartTimespan, chartTimespan,
    } = this.props;
    return (
      <div className="MarketInstrumentDetails">
        {instrumentDetails.chartUrl && (
          <>
            <div className="section-title">
              {`${i18n.t('Chart auf')} ${removeStarSymbol(instrument.name)}`}
            </div>
            <AsyncChart
              uniqKey={uniqKey}
              url={instrumentDetails[getActiveChartTimespanKey(chartTimespan)]}
              options={chartOptions}
              toggleChartTimespan={toggleChartTimespan}
              timespan={chartTimespan}
            />
          </>
        )}

        {instrumentDetails.leverageProducts
        && Object.keys(instrumentDetails.leverageProducts).length > 0
        && (
          <>
            <div className="section-title">
              {`${i18n.t('Top-Hebelprodukte auf')} ${removeStarSymbol(instrument.name)}`}
            </div>
            <MarketTopLeverage
              data={instrumentDetails.leverageProducts}
              activeGroup={instrumentDetails.activeGroup}
              onActiveGroupChange={onActiveGroupChange}
              responsiveMode={responsiveMode}
            />
          </>
        )}
      </div>
    );
  }
}

MarketInstrumentDetails.propTypes = {
  instrumentDetails: PropTypes.objectOf(PropTypes.any),
  instrument: PropTypes.objectOf(PropTypes.any),
  uniqKey: PropTypes.string,
  responsiveMode: PropTypes.string,
  chartTimespan: PropTypes.string,
  onActiveGroupChange: PropTypes.func,
  toggleChartTimespan: PropTypes.func,
  chartOptions: PropTypes.objectOf(PropTypes.any),
};

MarketInstrumentDetails.defaultProps = {
  instrumentDetails: {},
  instrument: null,
  uniqKey: generateUniqId(),
  responsiveMode: DESKTOP_MODE,
  chartTimespan: '',
  onActiveGroupChange: () => {},
  toggleChartTimespan: () => {},
  chartOptions: {
    showTimespans: true,
    showScrollbar: true,
    showTooltip: true,
    defaultTimespan: '5Y',
  },
};
