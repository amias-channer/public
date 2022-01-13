import React from 'react';
import { Button, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import AbstractPage from '../AbstractPage';
import i18n from '../../utils/i18n';
import ToolsBarSection from '../../components/TrendRadar/ToolsBarSection';
import InlineKeyValueTable from '../../components/InlineKeyValueTable';
import KeyValueFields from '../../components/TrendRadar/KeyValueFields';
import ValueRender from '../../components/ValueRender';
import TrendRadarAlarmPopupCmp from '../../components/TrendRadarAlarmPopup';
import './TrendRadarDetailsPage.scss';
import {
  trendRadarDetailsPageFetchContent,
  trendRadarDetailsPageHideLoginRegisterMessage,
  trendRadarDetailsPageShowLoginRegisterMessage,
  trendRadarDetailsToggleDisplayAlarmPopup,
  trendRadarDetailsToggleSaveSignalPopup,
} from './actions';
import {
  getInlineFields,
  getKeyValueFields,
  getTermsText,
  getPatternId,
  getProducts,
  getSignalFieldsLeft,
  getSignalFieldsRight,
  getUnderlyingName,
  getDirectionOrientation,
  triggerToolButtonAction,
  getAddAlertUrl, getSaveSignalPopupData,
} from './TrendRadarDetailsPage.helper';
import MarketLeverageInstrument
  from '../../components/Market/MarketLeverageInstrument';
import HttpService from '../../utils/httpService';
import {
  STATE_NAME_TREND_RADAR_DETAILS_PAGE, STATE_NAME_TREND_RADAR_LIST_PAGE,
} from '../../main/constants';
import {
  getRelatedProductType,
  getTrendRadarSignalListLink,
  isEmptyData,
  replaceParamsInPath,
} from '../../utils/utils';
import MessageBoxNonLoggedInUser
  from '../../components/MessageBoxNonLoggedInUser';
import withAuth from '../../components/Authentication/withAuth';
import Alert from '../../components/Alert';
import { ALERT_TYPE } from '../../components/Alert/Alert.helper';
import TrendRadarChart from '../../components/TrendRadar/TrendRadarChart';
import { isMobileMode, MOBILE_MODE } from '../../utils/responsive';
import TermsText from '../../components/TrendRadar/TermsText';
import TrendRadarSignalDirection
  from '../../components/TrendRadar/TrendRadarSignalDirection';
import TrendRadarSaveSignalPopupComp
  from '../../components/TrendRadar/TrendRadarListFilterable/TrendRadarSaveSignalPopup';

export class TrendRadarDetailsPageCmp extends AbstractPage {
  constructor(props) {
    super(props);
    const { dispatch, match } = props;
    this.navigateToPreviousPage = this.navigateToPreviousPage.bind(this);
    dispatch(trendRadarDetailsPageFetchContent(
      replaceParamsInPath(HttpService.getBackendUrlByStateName(
        STATE_NAME_TREND_RADAR_DETAILS_PAGE,
        false,
      ), match.params),
      match.params,
    ));
    this.onCreateAlertButtonClick = this.onCreateAlertButtonClick.bind(this);
    this.onAlertPopupCloseClick = this.onAlertPopupCloseClick.bind(this);
    this.triggerToolAction = this.triggerToolAction.bind(this);
    this.onCloseLoginRegisterMessage = this.onCloseLoginRegisterMessage.bind(this);
    this.onSaveSignalButtonClick = this.onSaveSignalButtonClick.bind(this);
    this.onCloseSaveSignalPopup = this.onCloseSaveSignalPopup.bind(this);
  }

  navigateToPreviousPage() {
    const { history, previousStateName } = this.props;
    if (previousStateName === STATE_NAME_TREND_RADAR_LIST_PAGE) {
      history.goBack();
    } else {
      history.push(getTrendRadarSignalListLink());
    }
  }

  onCreateAlertButtonClick() {
    const { dispatch, isUserAuthenticated } = this.props;
    if (!isUserAuthenticated) {
      dispatch(trendRadarDetailsPageShowLoginRegisterMessage());
      return;
    }
    dispatch(trendRadarDetailsToggleDisplayAlarmPopup(true));
  }

  onSaveSignalButtonClick() {
    const { dispatch, isUserAuthenticated } = this.props;
    if (!isUserAuthenticated) {
      dispatch(trendRadarDetailsPageShowLoginRegisterMessage());
      return;
    }
    dispatch(trendRadarDetailsToggleSaveSignalPopup(true));
  }

  onCloseLoginRegisterMessage() {
    const { dispatch } = this.props;
    dispatch(trendRadarDetailsPageHideLoginRegisterMessage());
  }

  onAlertPopupCloseClick() {
    const { dispatch } = this.props;
    dispatch(trendRadarDetailsToggleDisplayAlarmPopup(false));
  }

  triggerToolAction(actionType) {
    const { data } = this.props;
    triggerToolButtonAction(actionType, data);
  }

  onCloseSaveSignalPopup() {
    const { dispatch } = this.props;
    dispatch(trendRadarDetailsToggleSaveSignalPopup(false));
  }

  render() {
    const {
      data,
      match,
      isLoading,
      className,
      shouldDisplayAlertPopup,
      shouldDisplaySaveSignalPopup,
      isAlertPopupLoading,
      isBackendError,
      showLoginRegisterMessageBox,
      isUserAuthenticated,
      responsiveMode,
    } = this.props;
    if (isEmptyData(data) && isLoading) {
      return (<div className={classNames('TrendRadarDetailsPage', className, isLoading ? 'is-loading' : '')} />);
    }
    const patternId = getPatternId(data, match);
    const underlyingName = getUnderlyingName(data);
    const direction = getDirectionOrientation(data);
    const inlineFields = getInlineFields(data);
    const keyValueFields = getKeyValueFields(data);
    const signalFieldsLeft = getSignalFieldsLeft(data);
    const signalFieldsRight = getSignalFieldsRight(data);
    const termsText = getTermsText(data);
    const products = getProducts(data);
    return (
      <div className={classNames('TrendRadarDetailsPage', className, isLoading ? 'is-loading' : '')}>
        {!isLoading && (
          <>
            <Row>
              <div className="col back-link">
                <Button color="outline" tag="a" onClick={this.navigateToPreviousPage} className="go-back-button">
                  {' '}
                  {i18n.t('Back to result list')}
                </Button>
              </div>
            </Row>
            {!isUserAuthenticated && showLoginRegisterMessageBox && (
              <MessageBoxNonLoggedInUser
                message={i18n.t('my_watchlist_login_required')}
                title={i18n.t('please_login')}
                onCloseMessageButtonClick={this.onCloseLoginRegisterMessage}
              />
            )}
            {isBackendError && (
              <Alert type={ALERT_TYPE.ERROR}>
                <div className="title">{i18n.t('my_watchlist_backend_error')}</div>
                <div className="message">{isBackendError.message || i18n.t('my_watchlist_backend_error_default')}</div>
              </Alert>
            )}
            <ToolsBarSection
              onCreateAlertButtonClick={this.onCreateAlertButtonClick}
              onSaveSignalButtonClick={this.onSaveSignalButtonClick}
              isAlertPopupLoading={isAlertPopupLoading}
              responsiveMode={responsiveMode}
              triggerToolAction={this.triggerToolAction}
            />
            {underlyingName && (
              <Row>
                <div className="col title">
                  <TrendRadarSignalDirection direction={direction} />
                  <h1>
                    {underlyingName}
                  </h1>
                </div>
              </Row>
            )}
            <Row className="info-items">
              <div className="col">
                <InlineKeyValueTable
                  fieldsSeparator="|"
                  fields={inlineFields}
                  responsiveMode={responsiveMode}
                  hideSeparatorInModes={[MOBILE_MODE]}
                />
              </div>
            </Row>
            {isMobileMode(responsiveMode) && (
              <Row className="second-level-fields">
                <div className="col">
                  <InlineKeyValueTable
                    fields={keyValueFields}
                    hideSeparatorInModes={[MOBILE_MODE]}
                  />
                </div>
              </Row>
            )}
            {!isMobileMode(responsiveMode) && (
              <Row className="key-value-items">
                {keyValueFields.map((field) => (
                  <div className="col col-auto key-value-item" key={field.label}>
                    <div className="key">
                      {field.label}
                    </div>
                    <div className="value">
                      <ValueRender field={field} />
                    </div>
                  </div>
                ))}
              </Row>
            )}
            <Row className="trend-radar-chart-container">
              <div className="col">
                <TrendRadarChart patternId={patternId} />
              </div>
            </Row>
            <Row className="signal-fields">
              <div className="col col-lg-6 col-sm-12 signal-fields-left">
                <KeyValueFields fields={signalFieldsLeft} />
              </div>
              <div className="col col-lg-6 col-sm-12 signal-fields-right">
                <KeyValueFields fields={signalFieldsRight} />
              </div>
            </Row>
            {products && !isEmptyData(products) && (
              <Row className="products">
                <div className="col">
                  <h1>{i18n.t('Passende Produkte')}</h1>
                  {products.map((product) => (
                    <MarketLeverageInstrument
                      type={getRelatedProductType(product, direction)}
                      key={product.sin || product.name}
                      data={product}
                      responsiveMode={responsiveMode}
                    />
                  ))}
                </div>
              </Row>
            )}
            {termsText && !isEmptyData(termsText) && (
              <Row>
                <div className="col">
                  <h1 className="trend-radar-terms-heading">{i18n.t('trend_radar_terms_heading')}</h1>
                  <TermsText data={termsText} />
                </div>
              </Row>
            )}
          </>
        )}
        { shouldDisplayAlertPopup && isUserAuthenticated && (
        <TrendRadarAlarmPopupCmp
          dataUrl={getAddAlertUrl(data)}
          onAlertPopupCloseClick={this.onAlertPopupCloseClick}
        />
        )}

        { shouldDisplaySaveSignalPopup && isUserAuthenticated && (
          <TrendRadarSaveSignalPopupComp
            data={getSaveSignalPopupData(data)}
            onClosePopup={this.onCloseSaveSignalPopup}
          />
        )}
      </div>
    );
  }
}

const EMPTY_DATA_OBJ = {};

const mapStateToProps = (state) => ({
  data: pathOr(EMPTY_DATA_OBJ, ['trendRadarDetailsPage', 'data'], state),
  isLoading: pathOr(true, ['trendRadarDetailsPage', 'isLoading'], state),
  shouldDisplayAlertPopup: pathOr(false, ['trendRadarDetailsPage', 'alertPopup', 'shouldDisplay'], state),
  shouldDisplaySaveSignalPopup: pathOr(false, ['trendRadarDetailsPage', 'saveSignalPopup', 'shouldDisplay'], state),
  isAlertPopupLoading: pathOr(false, ['trendRadarDetailsPage', 'alertPopup', 'isLoading'], state),
  isBackendError: pathOr(null, ['trendRadarDetailsPage', 'isBackendError'], state),
  previousStateName: pathOr('', ['global', 'previousStateName'], state),
  showLoginRegisterMessageBox: pathOr(false, ['trendRadarDetailsPage', 'showLoginRegisterMessageBox'], state),
  responsiveMode: state.global.responsiveMode,
});
const TrendRadarDetailsPage = withAuth(
  connect(mapStateToProps)(
    withRouter(
      TrendRadarDetailsPageCmp,
    ),
  ),
);
export default TrendRadarDetailsPage;
