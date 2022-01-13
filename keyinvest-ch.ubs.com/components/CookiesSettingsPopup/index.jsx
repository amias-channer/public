import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Modal, ModalBody, ModalFooter, ModalHeader, Row,
} from 'reactstrap';
import { connect } from 'react-redux';
import i18n from '../../utils/i18n';
import LanguageSelector from '../LanguageSelector';
import CookiesSection from '../DisclaimerPopup/CookiesSection';
import Button from '../Button';
import './CookiesSettingsPopup.scss';
import { DESKTOP_MODE, MOBILE_MODE, TABLET_MODE } from '../../utils/responsive';
import { globalSetDisplayCookiesSettingsPopup } from '../../main/actions';
import {
  initAnalytics, isAnalyticsLoaded,
  setAnalyticsCookie,
} from '../../analytics/Analytics.helper';
import getAppConfig from '../../main/AppConfig';
import {
  getMarketingInitialState,
  getStatisticsInitialState,
  getUBSPrivacySettingsCookieValue,
  getUserPreferencesInitialState,
  setUBSPrivacySettingsCookie,
  trackCurrentPageView,
} from '../DisclaimerPopup/DisclaimerPopup.helper';

export const CookiesSettingsPopup = (props) => {
  const {
    className, showCookiesSettingsPopup, responsiveMode, dispatch, location,
  } = props;
  const { application } = getAppConfig();
  const ubsPrivacySettingsCookie = getUBSPrivacySettingsCookieValue();
  const [isStatisticsChecked, setIsStatisticsChecked] = useState(
    getStatisticsInitialState(application, ubsPrivacySettingsCookie),
  );
  const [isUserPreferenceChecked, setIsUserPreferencesChecked] = useState(
    getUserPreferencesInitialState(application, ubsPrivacySettingsCookie),
  );
  const [isMarketingChecked, setIsMarketingChecked] = useState(
    getMarketingInitialState(application, ubsPrivacySettingsCookie),
  );

  const [showStaticAndAdvertInfoText, setShowStaticAndAdvertInfoText] = useState(false);
  const [showUserPreferenceInfoText, setShowUserPreferenceInfoText] = useState(false);
  const [showMarketingInfoText, setShowMarketingInfoText] = useState(false);

  const smallMode = responsiveMode === MOBILE_MODE || responsiveMode === TABLET_MODE;

  const confirm = () => {
    if (isStatisticsChecked) {
      setAnalyticsCookie(true);
      if (!isAnalyticsLoaded()) {
        initAnalytics(false);
        trackCurrentPageView(location);
      }
    } else {
      setAnalyticsCookie(false);
    }
    setUBSPrivacySettingsCookie(
      {
        isStatisticsChecked,
        isUserPreferenceChecked,
        isMarketingChecked,
      },
    );
    dispatch(globalSetDisplayCookiesSettingsPopup(false));
  };

  const cancel = () => {
    dispatch(globalSetDisplayCookiesSettingsPopup(false));
  };

  const onStatisticsSwitchChange = () => {
    // If the switch was already checked, we need to uncheck it
    if (isStatisticsChecked) {
      setIsStatisticsChecked(false);
      setIsMarketingChecked(false);
    } else {
      setIsStatisticsChecked(true);
    }
  };

  const onUserPreferenceSwitchChange = () => (
    isUserPreferenceChecked
      ? setIsUserPreferencesChecked(false)
      : setIsUserPreferencesChecked(true)
  );

  const onStatisticsInfoIconClick = (e) => {
    e.preventDefault();
    if (showStaticAndAdvertInfoText) {
      setShowStaticAndAdvertInfoText(false);
    } else {
      setShowStaticAndAdvertInfoText(true);
    }
  };

  const onUserPreferenceInfoIconClick = (e) => {
    e.preventDefault();
    if (showUserPreferenceInfoText) {
      setShowUserPreferenceInfoText(false);
    } else {
      setShowUserPreferenceInfoText(true);
    }
  };

  const onMarketingSwitchChange = () => (
    isMarketingChecked
      ? setIsMarketingChecked(false)
      : setIsMarketingChecked(true)
  );

  const onMarketingInfoIconClick = (e) => {
    e.preventDefault();
    if (showMarketingInfoText) {
      setShowMarketingInfoText(false);
    } else {
      setShowMarketingInfoText(true);
    }
  };

  const { localesToUrl } = getAppConfig();
  return (
    <div>
      <Modal
        unmountOnClose
        centered
        fade={false}
        size="xl"
        isOpen={showCookiesSettingsPopup}
        toggle={confirm}
        className={classNames(className, smallMode ? 'modal-full' : '')}
        wrapClassName="CookiesSettingsPopup"
        backdrop="static"
      >
        <ModalHeader className="align-items-end justify-content-end">
          {Object.keys(localesToUrl).length > 1 && (
            <>
              <span className="language-select-label">{i18n.t('change_language')}</span>
              <LanguageSelector labelAsActiveValue />
            </>
          )}
        </ModalHeader>
        <ModalBody>
          <CookiesSection
            isStatisticsChecked={isStatisticsChecked}
            isUserPreferenceChecked={isUserPreferenceChecked}
            onStatisticsInfoIconClick={onStatisticsInfoIconClick}
            onStatisticsSwitchChange={onStatisticsSwitchChange}
            onUserPreferenceInfoIconClick={onUserPreferenceInfoIconClick}
            onUserPreferenceSwitchChange={onUserPreferenceSwitchChange}
            showStatisticsInfoText={showStaticAndAdvertInfoText}
            showUserPreferenceInfoText={showUserPreferenceInfoText}
            isMarketingChecked={isMarketingChecked}
            onMarketingInfoIconClick={onMarketingInfoIconClick}
            onMarketingSwitchChange={onMarketingSwitchChange}
            showMarketingInfoText={showMarketingInfoText}
          />
        </ModalBody>
        <ModalFooter>
          <Row className="action-buttons">
            <div className="col-auto col-sm-6 col-lg-auto col-btn-accept">
              <Button className="btn-accept w-100" onClick={confirm}>{i18n.t('confirm')}</Button>
            </div>
            <div className="col-auto col-sm-6 col-lg-auto col-btn-cancel">
              <Button className="btn-cancel w-100" onClick={cancel}>{i18n.t('cancel')}</Button>
            </div>
          </Row>
        </ModalFooter>
      </Modal>
    </div>
  );
};

CookiesSettingsPopup.propTypes = {
  className: PropTypes.string,
  responsiveMode: PropTypes.string,
  showCookiesSettingsPopup: PropTypes.bool,
  dispatch: PropTypes.func,
  location: PropTypes.objectOf(PropTypes.any),
};

CookiesSettingsPopup.defaultProps = {
  className: '',
  responsiveMode: DESKTOP_MODE,
  showCookiesSettingsPopup: false,
  dispatch: () => {},
  location: {},
};

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
  showCookiesSettingsPopup: state.global.showCookiesSettingsPopup,
});

export default connect(mapStateToProps)(React.memo(CookiesSettingsPopup));
