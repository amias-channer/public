import React from 'react';
import PropTypes from 'prop-types';
import i18n from '../../../utils/i18n';
import './MarketTopLeverage.scss';
import MarketLeverageInstrument from '../MarketLeverageInstrument';
import Tabs from '../../Tabs';
import { DESKTOP_MODE } from '../../../utils/responsive';

function MarketTopLeverage(props) {
  const {
    data, activeGroup, onActiveGroupChange, responsiveMode,
  } = props;

  const getActiveTab = () => {
    if (!activeGroup && data && Object.keys(data).length > 0) {
      const [firstTabKey] = Object.keys(data);
      return firstTabKey;
    }
    return activeGroup;
  };

  const currentTab = getActiveTab();

  const getInstrumentsByType = data[currentTab] && Object.keys(data[currentTab]).map((type) => {
    const instruments = data[currentTab][type].map(
      (instrument) => instrument && (
        <MarketLeverageInstrument
          key={instrument.sin || instrument.name}
          type={type}
          data={instrument}
          responsiveMode={responsiveMode}
          parentTrackingComponentName={currentTab}
        />
      ),
    );
    if (instruments.length === 0) {
      return (
        <div key={type}>
          <div className="section-type">{i18n.t(type)}</div>
          <div className="no-products-found">{i18n.t('no_products')}</div>
        </div>
      );
    }
    return (
      <div key={type}>
        <div className="section-type">{i18n.t(type)}</div>
        {instruments}
      </div>
    );
  });
  return (
    <div className="MarketTopLeverage">
      <Tabs
        links={Object.keys(data)}
        onTabLinkClick={onActiveGroupChange}
        activeTabLink={currentTab}
      >
        { getInstrumentsByType }
      </Tabs>
    </div>
  );
}

MarketTopLeverage.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  activeGroup: PropTypes.string,
  responsiveMode: PropTypes.string,
  onActiveGroupChange: PropTypes.func,
};

MarketTopLeverage.defaultProps = {
  data: {},
  activeGroup: '',
  onActiveGroupChange: () => {},
  responsiveMode: DESKTOP_MODE,
};

export default React.memo(MarketTopLeverage);
