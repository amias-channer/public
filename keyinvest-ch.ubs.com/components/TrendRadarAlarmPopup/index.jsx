import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Modal, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import Icon from '../Icon';
import './TrendRadarAlarmPopup.scss';
import i18n from '../../utils/i18n';
import Logger from '../../utils/logger';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../Button';
import {
  getAlertMethods,
  getCreateAlertFormData,
  STATE_KEY_TREND_RADAR_ALARM_POPUP,
} from './TrendRadarAlarmPopup.helper';
import CreateAlertForm from './CreateAlertForm';
import {
  trendRadarAlarmPopupFetchAlertsData,
  trendRadarAlarmPopupFormAlertDismiss,
  trendRadarAlarmPopupFormDidUnmount,
  trendRadarAlarmPopupFormFieldChange,
  trendRadarAlarmPopupFormSubmitSuccess,
  trendRadarAlarmPopupSetAlertType,
  trendRadarAlarmPopupSetBackendError,
  trendRadarAlarmPopupSubmitForm,
} from './actions';
import Alert from '../Alert';
import { ALERT_TYPE } from '../Alert/Alert.helper';
import DropdownWithTitle from '../DropdownWithTitle';

export class TrendRadarAlarmPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    const {
      dispatch,
      dataUrl,
    } = props;
    this.onAlertMethodSelect = this.onAlertMethodSelect.bind(this);
    this.onAlertFormFieldChange = this.onAlertFormFieldChange.bind(this);
    this.onAlertFormSubmit = this.onAlertFormSubmit.bind(this);
    this.onFormErrorAlertDismiss = this.onFormErrorAlertDismiss.bind(this);
    this.onBackendErrorDismiss = this.onBackendErrorDismiss.bind(this);
    this.onSuccessDismiss = this.onSuccessDismiss.bind(this);
    this.onFormValidationErrorDismiss = this.onFormValidationErrorDismiss.bind(this);
    dispatch(trendRadarAlarmPopupFetchAlertsData(dataUrl));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(trendRadarAlarmPopupFormDidUnmount());
  }

  onBackendErrorDismiss() {
    const { dispatch } = this.props;
    dispatch(trendRadarAlarmPopupSetBackendError(null));
  }

  onSuccessDismiss() {
    const { dispatch } = this.props;
    dispatch(trendRadarAlarmPopupFormSubmitSuccess(null));
  }

  onAlertFormFieldChange = (e, stateDataSource, fieldType, listItemIndex) => {
    const { dispatch } = this.props;
    const currentTarget = {
      value: pathOr('', ['currentTarget', 'value'], e),
      checked: pathOr(false, ['currentTarget', 'checked'], e),
    };
    dispatch(trendRadarAlarmPopupFormFieldChange(
      currentTarget,
      stateDataSource,
      fieldType,
      listItemIndex,
    ));
    Logger.info('TrendRadarAlarmPopup: Form field changed at state data source: ', stateDataSource, fieldType);
  };

  onAlertMethodSelect = (item, value) => {
    const { dispatch } = this.props;
    dispatch(trendRadarAlarmPopupSetAlertType(value));
  };

  onAlertFormSubmit = () => {
    const { dispatch, selectedAlertMethod, dataUrl } = this.props;
    dispatch(trendRadarAlarmPopupSubmitForm('/trend-radar-signal/alert/save', selectedAlertMethod, dataUrl));
  };

  onFormErrorAlertDismiss = (e, index) => {
    const { dispatch } = this.props;
    dispatch(trendRadarAlarmPopupFormAlertDismiss(index));
  };

  onFormValidationErrorDismiss = (e, index) => {
    const { dispatch } = this.props;
    dispatch(trendRadarAlarmPopupFormAlertDismiss(index));
  };

  getFormValidationErrors = () => {
    const { formValidationErrors } = this.props;
    if (formValidationErrors && formValidationErrors.length > 0) {
      return formValidationErrors.map((error) => (
        <Row>
          <div className="col error-message">
            <Alert type={ALERT_TYPE.ERROR} onDismiss={this.onFormValidationErrorDismiss}>
              {error}
            </Alert>
          </div>
        </Row>
      ));
    }
    return null;
  };

  render() {
    const {
      data, selectedAlertMethod, backendError, isLoading,
      onAlertPopupCloseClick, success,
    } = this.props;
    return (
      <Modal isOpen wrapClassName="TrendRadarAlarmPopup">
        <Row>
          <div className="col top-section">
            <h1>
              <Icon type="bell" />
              {!selectedAlertMethod && (<>{i18n.t('trend_radar_create_alarm')}</>)}
              {selectedAlertMethod && (<>{i18n.t(`trend_radar_${selectedAlertMethod}`)}</>)}
            </h1>
          </div>
          <div className="col col-auto ml-auto">
            <Icon type="close" onClick={onAlertPopupCloseClick} />
          </div>
        </Row>
        <Row>
          <div className="col">
            <DropdownWithTitle
              className={classNames('alarm-type-select', selectedAlertMethod ? 'value-selected' : '')}
              onItemSelect={this.onAlertMethodSelect}
              items={getAlertMethods(data)}
              placeHolderText={i18n.t('select_alarm_type')}
              activeItem={selectedAlertMethod}
              hidePlaceholderOnItemActive
            />
          </div>
        </Row>
        {selectedAlertMethod && (
          <CreateAlertForm
            data={getCreateAlertFormData(data)}
            selectedAlertMethod={selectedAlertMethod}
            onFieldChange={this.onAlertFormFieldChange}
            onFormErrorAlertDismiss={this.onFormErrorAlertDismiss}
          />
        )}
        {this.getFormValidationErrors()}
        {backendError && (
          <Row>
            <div className="col error-message">
              <Alert type={ALERT_TYPE.ERROR} onDismiss={this.onBackendErrorDismiss}>
                {backendError}
              </Alert>
            </div>
          </Row>
        )}
        {success && (
          <Row>
            <div className="col success-message">
              <Alert type={ALERT_TYPE.SUCCESS} onDismiss={this.onSuccessDismiss}>
                {success}
              </Alert>
            </div>
          </Row>
        )}
        {isLoading && (<Row className="m-2"><div className="is-loading" /></Row>)}
        <Row className="form-buttons">
          {selectedAlertMethod && (
            <div className="col col-auto save">
              <Button onClick={this.onAlertFormSubmit} className="button-save" color={BUTTON_COLOR.OLIVE} size={BUTTON_SIZE.STANDARD}>{i18n.t('Apply')}</Button>
            </div>
          )}
          <div className="col col-auto">
            <Button onClick={onAlertPopupCloseClick} className="button-cancel" color={BUTTON_COLOR.STANDARD} size={BUTTON_SIZE.STANDARD}>{i18n.t('Cancel')}</Button>
          </div>
        </Row>
      </Modal>
    );
  }
}

TrendRadarAlarmPopup.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  selectedAlertMethod: PropTypes.string,
  dispatch: PropTypes.func,
  onAlertPopupCloseClick: PropTypes.func,
  success: PropTypes.string,
  backendError: PropTypes.string,
  isLoading: PropTypes.bool,
  formValidationErrors: PropTypes.arrayOf(PropTypes.any),
  dataUrl: PropTypes.string,
};

TrendRadarAlarmPopup.defaultProps = {
  data: {},
  selectedAlertMethod: '',
  dispatch: () => {},
  onAlertPopupCloseClick: () => {},
  success: null,
  backendError: null,
  isLoading: false,
  formValidationErrors: [],
  dataUrl: '',
};

const emptyObj = {};
const emptyArr = [];

const mapStateToProps = (state) => ({
  selectedAlertMethod: pathOr('', [STATE_KEY_TREND_RADAR_ALARM_POPUP, 'selectedAlertMethod'], state),
  data: pathOr(emptyObj, [STATE_KEY_TREND_RADAR_ALARM_POPUP, 'data'], state),
  formValidationErrors: pathOr(emptyArr, [STATE_KEY_TREND_RADAR_ALARM_POPUP, 'formValidationErrors'], state),
  backendError: pathOr(null, [STATE_KEY_TREND_RADAR_ALARM_POPUP, 'backendError'], state),
  success: pathOr(null, [STATE_KEY_TREND_RADAR_ALARM_POPUP, 'success'], state),
  isLoading: pathOr(false, [STATE_KEY_TREND_RADAR_ALARM_POPUP, 'isLoading'], state),
});

export default connect(mapStateToProps)(TrendRadarAlarmPopup);
