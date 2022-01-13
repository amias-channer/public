import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Row,
} from 'reactstrap';
import {
  globalAcceptDisclaimer,
  globalDisclaimerAcceptedOnceForSession,
  globalSetDisplayCookiesSettingsPopup,
} from '../../main/actions';
import getAppConfig from '../../main/AppConfig';
import LanguageSelector from '../LanguageSelector';
import i18n from '../../utils/i18n';
import Checkbox from '../CheckboxInput';
import './DisclaimerPopup.scss';
import { DESKTOP_MODE, MOBILE_MODE, TABLET_MODE } from '../../utils/responsive';
import {
  getCurrentSelectedCountry,
  getDisclaimerCancelUrl,
  getMarketingInitialState,
  getSelectedCountryId,
  getStatisticsInitialState,
  getUBSPrivacySettingsCookieValue,
  getUserPreferencesInitialState,
  setUBSPrivacySettingsCookie,
  isOtherCountrySelected,
  trackCurrentPageView,
} from './DisclaimerPopup.helper';
import HtmlText from '../HtmlText';
import CountrySelector from './CountrySelector';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../Button';
import { generateCmsLayout } from '../../pages/CmsPage/CmsPage.helper';
import CookiesSection from './CookiesSection';
import {
  initAnalytics, isAnalyticsLoaded,
  setAnalyticsCookie,
} from '../../analytics/Analytics.helper';

export const DisclaimerPopupCmp = (props) => {
  const {
    className,
    showDisclaimer,
    dispatch,
    responsiveMode,
  } = props;
  const [longTerm, setLongTerm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [extraText, setExtraText] = useState(null);

  const { application } = getAppConfig();
  const ubsPrivacySettingsCookie = getUBSPrivacySettingsCookieValue();

  // eslint-disable-next-line max-len
  const [isStatisticsChecked, setIsStatisticsChecked] = useState(getStatisticsInitialState(application, ubsPrivacySettingsCookie));
  // eslint-disable-next-line max-len
  const [isUserPreferenceChecked, setIsUserPreferenceChecked] = useState(getUserPreferencesInitialState(application, ubsPrivacySettingsCookie));
  // eslint-disable-next-line max-len,no-unused-vars
  const [isMarketingChecked, setIsMarketingChecked] = useState(getMarketingInitialState(application, ubsPrivacySettingsCookie));

  const [showStatisticsInfoText, setShowStaticAndAdvertInfoText] = useState(false);
  const [showUserPreferenceInfoText, setShowUserPreferenceInfoText] = useState(false);
  const [showMarketingInfoText, setShowMarketingInfoText] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(getCurrentSelectedCountry());

  const [mobileCookiePopupVisited, setMobileCookiePopupVisited] = useState(false);

  const onLongTermChanged = (e) => {
    setLongTerm(e.target.checked);
  };
  const onAcceptedChanged = (e) => {
    setAccepted(e.target.checked);
  };

  const onStatisticsSwitchChange = () => {
    if (isStatisticsChecked) {
      setIsStatisticsChecked(false);
      setIsMarketingChecked(false);
    } else {
      setIsStatisticsChecked(true);
    }
  };

  const onUserPreferenceSwitchChange = () => (
    isUserPreferenceChecked
      ? setIsUserPreferenceChecked(false)
      : setIsUserPreferenceChecked(true)
  );

  const onMarketingSwitchChange = () => (
    isMarketingChecked
      ? setIsMarketingChecked(false)
      : setIsMarketingChecked(true)
  );

  const onAdjustCookiesButtonClick = (e) => {
    e.preventDefault();
    setMobileCookiePopupVisited(true);
    dispatch(globalSetDisplayCookiesSettingsPopup(true));
  };

  const onStatisticsInfoIconClick = (e) => {
    e.preventDefault();
    if (showStatisticsInfoText) {
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

  const onMarketingInfoIconClick = (e) => {
    e.preventDefault();
    if (showMarketingInfoText) {
      setShowMarketingInfoText(false);
    } else {
      setShowMarketingInfoText(true);
    }
  };

  const smallMode = responsiveMode === MOBILE_MODE || responsiveMode === TABLET_MODE;
  const isMobileMode = responsiveMode === MOBILE_MODE;

  const setAnalyticsCookieTracking = () => {
    if (isStatisticsChecked) {
      setAnalyticsCookie(true);
      if (!isAnalyticsLoaded()) {
        initAnalytics(false);
        trackCurrentPageView(props.location);
      }
    } else {
      setAnalyticsCookie(false);
    }
  };

  const accept = () => {
    setSubmitted(true);
    const selectedCountryId = getSelectedCountryId(selectedCountry);
    if (isOtherCountrySelected(selectedCountryId)) {
      return;
    }
    if (accepted) {
      dispatch(globalAcceptDisclaimer(longTerm));
      setLongTerm(false);
      setAccepted(false);
      setSubmitted(false);
      if (!isMobileMode || !mobileCookiePopupVisited) {
        setUBSPrivacySettingsCookie(
          {
            isStatisticsChecked,
            isUserPreferenceChecked,
            isMarketingChecked,
          },
        );
        setAnalyticsCookieTracking();
      }
      dispatch(globalDisclaimerAcceptedOnceForSession());
    }
  };

  const cancel = () => {
    window.location.href = getDisclaimerCancelUrl();
  };

  const appConfig = getAppConfig();
  const scrollBarsHeight = isMobileMode ? '420px' : '600px';
  const otherCountrySelected = isOtherCountrySelected(getSelectedCountryId(selectedCountry));
  return (
    <div>
      <Modal
        unmountOnClose
        fade={false}
        size="xl"
        isOpen={showDisclaimer}
        toggle={accept}
        className={classNames('DisclaimerPopup', className, smallMode ? 'modal-full' : '')}
        backdrop="static"
      >
        <ModalHeader className="align-items-end justify-content-end">
          {Object.keys(appConfig.localesToUrl).length > 1 && (
            <>
              <span className="language-select-label">{i18n.t('change_language')}</span>
              <LanguageSelector labelAsActiveValue />
            </>
          )}
        </ModalHeader>
        <ModalBody>
          <Scrollbars
            style={{
              height: `calc(100vh - ${scrollBarsHeight})`,
              minHeight: '100px',
            }}
          >
            {generateCmsLayout(pathOr([], ['disclaimer', 'disclaimer-page-rendered', 'data'])(appConfig))}
          </Scrollbars>
        </ModalBody>
        <ModalFooter>
          {isMobileMode && (
            <>
              <Row>
                <div className="col">
                  <Button
                    color={BUTTON_COLOR.OLIVE}
                    size={BUTTON_SIZE.STANDARD}
                    className="btn-adjust-cookies"
                    onClick={onAdjustCookiesButtonClick}
                  >
                    {i18n.t('adjust_cookies')}
                  </Button>
                </div>
              </Row>
            </>
          )}
          {!isMobileMode && (
            <CookiesSection
              isStatisticsChecked={isStatisticsChecked}
              onStatisticsInfoIconClick={onStatisticsInfoIconClick}
              onStatisticsSwitchChange={onStatisticsSwitchChange}
              showStatisticsInfoText={showStatisticsInfoText}
              isUserPreferenceChecked={isUserPreferenceChecked}
              onUserPreferenceInfoIconClick={onUserPreferenceInfoIconClick}
              onUserPreferenceSwitchChange={onUserPreferenceSwitchChange}
              showUserPreferenceInfoText={showUserPreferenceInfoText}
              isMarketingChecked={isMarketingChecked}
              onMarketingInfoIconClick={onMarketingInfoIconClick}
              onMarketingSwitchChange={onMarketingSwitchChange}
              showMarketingInfoText={showMarketingInfoText}
            />
          )}
          <div className="checkboxes-container">
            <div className="row d-inline element-container">
              <Checkbox
                className={classNames('accept-checkbox', 'd-inline', submitted && !accepted ? 'error' : '')}
                name="accepted"
                label={i18n.t('disclaimer_accept_text')}
                checked={accepted}
                onChange={onAcceptedChanged}
                inline
              />
              <span className={classNames('d-inline', submitted && !accepted ? 'error' : '')}>{i18n.t('my_domicile')}</span>
              <CountrySelector
                className="d-inline w-auto country-select"
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                setExtraText={setExtraText}
              />
            </div>
            <div className="row element-container">
              <Checkbox
                name="longTerm"
                label={i18n.t('disclaimer_save_settings')}
                checked={longTerm}
                onChange={onLongTermChanged}
              />
            </div>
          </div>
          <div className="row">
            {extraText && (
              <small><HtmlText data={{ text: extraText }} /></small>
            )}
          </div>
          <Row className="action-buttons">
            <div className="col-auto col-sm-6 col-lg-auto col-btn-accept">
              <Button
                isDisabled={!accepted || otherCountrySelected}
                className={classNames('btn-accept w-100', (accepted && !otherCountrySelected) ? 'green' : '')}
                onClick={accept}
              >
                <span>{i18n.t('confirm')}</span>
              </Button>
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

DisclaimerPopupCmp.propTypes = {
  responsiveMode: PropTypes.string,
  className: PropTypes.string,
  showDisclaimer: PropTypes.bool,
  dispatch: PropTypes.func,
  location: PropTypes.objectOf(PropTypes.any),
};

DisclaimerPopupCmp.defaultProps = {
  responsiveMode: DESKTOP_MODE,
  className: '',
  showDisclaimer: false,
  dispatch: () => {},
  location: {},
};

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
  showDisclaimer: state.global.showDisclaimer,
  location: state.router.location,
});
const DisclaimerPopup = connect(mapStateToProps)(React.memo(DisclaimerPopupCmp));
export default DisclaimerPopup;
