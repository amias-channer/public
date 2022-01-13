import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import i18n from '../../../utils/i18n';
import RadioSwitch from '../../RadioSwitch';
import HtmlText from '../../HtmlText';

const CookiesSection = ({
  isStatisticsChecked,
  onStatisticsSwitchChange,
  showStatisticsInfoText,
  onStatisticsInfoIconClick,
  isUserPreferenceChecked,
  onUserPreferenceSwitchChange,
  showUserPreferenceInfoText,
  onUserPreferenceInfoIconClick,
  isMarketingChecked,
  onMarketingInfoIconClick,
  onMarketingSwitchChange,
  showMarketingInfoText,
}) => (
  <Row className="CookiesSection">
    <div className="col cookies">
      <h2>{i18n.t('Cookies')}</h2>
      <HtmlText data={{ text: i18n.t('cookies_settings_text') }} />
      <RadioSwitch
        id="statisticAds"
        isChecked={isStatisticsChecked}
        handleChange={onStatisticsSwitchChange}
        labelText={i18n.t('statistics')}
        icon="Information"
        onInfoIconClick={onStatisticsInfoIconClick}
      />
      {showStatisticsInfoText && (
      <div className="info-text">
        {i18n.t('cookies_statistic_and_advert_text')}
      </div>
      )}
      <RadioSwitch
        id="userPref"
        isChecked={isUserPreferenceChecked}
        handleChange={onUserPreferenceSwitchChange}
        labelText={i18n.t('user_preferences')}
        icon="Information"
        onInfoIconClick={onUserPreferenceInfoIconClick}
      />
      {showUserPreferenceInfoText && (
      <div className="info-text">
        {i18n.t('cookies_user_pref_text')}
      </div>
      )}
      <RadioSwitch
        id="marketing"
        isChecked={isMarketingChecked}
        handleChange={onMarketingSwitchChange}
        labelText={i18n.t('marketing')}
        icon="Information"
        onInfoIconClick={onMarketingInfoIconClick}
        disabled={!isStatisticsChecked}
      />
      {showMarketingInfoText && (
        <div className="info-text">
          {i18n.t('cookies_marketing_text')}
        </div>
      )}
    </div>
  </Row>
);

CookiesSection.propTypes = {
  isStatisticsChecked: PropTypes.bool,
  onStatisticsSwitchChange: PropTypes.func,
  showStatisticsInfoText: PropTypes.bool,
  onStatisticsInfoIconClick: PropTypes.func,
  isUserPreferenceChecked: PropTypes.bool,
  onUserPreferenceSwitchChange: PropTypes.func,
  showUserPreferenceInfoText: PropTypes.bool,
  onUserPreferenceInfoIconClick: PropTypes.func,
  isMarketingChecked: PropTypes.bool,
  onMarketingInfoIconClick: PropTypes.func,
  onMarketingSwitchChange: PropTypes.func,
  showMarketingInfoText: PropTypes.bool,
};

CookiesSection.defaultProps = {
  isStatisticsChecked: true,
  onStatisticsSwitchChange: () => {},
  showStatisticsInfoText: false,
  onStatisticsInfoIconClick: () => {},
  isUserPreferenceChecked: true,
  onUserPreferenceSwitchChange: () => {},
  showUserPreferenceInfoText: false,
  onUserPreferenceInfoIconClick: () => {},
  isMarketingChecked: true,
  onMarketingInfoIconClick: () => {},
  onMarketingSwitchChange: () => {},
  showMarketingInfoText: false,
};

export default React.memo(CookiesSection);
