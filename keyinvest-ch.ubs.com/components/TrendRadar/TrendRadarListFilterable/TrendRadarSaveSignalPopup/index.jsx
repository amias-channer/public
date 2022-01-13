import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import Overlay from '../../../Overlay';
import Popup from '../../../Popup';
import HttpService, {
  REQUEST_METHOD_PUT,
  RESPONSE_STATUS_BAD_REQUEST_CODE,
  RESPONSE_STATUS_SUCCESS_CODE,
} from '../../../../utils/httpService';
import Logger from '../../../../utils/logger';
import i18n from '../../../../utils/i18n';
import Icon from '../../../Icon';
import './TrendRadarSaveSignalPopup.scss';
import Alert from '../../../Alert';
import { ALERT_TYPE } from '../../../Alert/Alert.helper';
import {
  getPatternTypeName,
  getResponseMessage,
  getSaveSignalUrl,
  getUnderlyingName,
} from './TrendRadarSaveSignalPopup.helper';
import Button, { BUTTON_COLOR } from '../../../Button';
import {
  getMyKeyInvestDashboardLink,
} from '../../../../utils/utils';

export const TrendRadarSaveSignalPopupCmp = ({
  className, data, onClosePopup, history,
}) => {
  const [backendResponse, setBackendResponse] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionButtonText, setActionButtonText] = useState(i18n.t('trend_radar_open_list'));
  const saveSignal = useCallback(() => {
    try {
      setIsLoading(true);
      HttpService.fetch(`${HttpService.getPageApiUrl()}${getSaveSignalUrl(data)}`, {
        method: REQUEST_METHOD_PUT,
      }).then((response) => {
        if (response && response.status === RESPONSE_STATUS_SUCCESS_CODE) {
          setAlertType(ALERT_TYPE.SUCCESS);
          setBackendResponse(response);
          setActionButtonText(i18n.t('trend_radar_open_list'));
        }
      }).catch((error) => {
        setAlertType(ALERT_TYPE.ERROR);
        if (error && error.status === RESPONSE_STATUS_BAD_REQUEST_CODE) {
          setAlertType(ALERT_TYPE.INFO);
          setBackendResponse(error);
          setActionButtonText(i18n.t('trend_radar_open_list'));
          return;
        }

        setActionButtonText(i18n.t('Try again'));
        if (error && !error.status) {
          setBackendResponse({ message: i18n.t('error_technical_message') });
          return;
        }
        Logger.error('TrendRadarSaveSignalPopup error while saving signal: ', error);
      }).finally(() => {
        setIsLoading(false);
      });
    } catch (e) {
      Logger.error('saveSignal error:', e);
    }
  }, [data]);

  const retrySaveSignal = () => {
    setBackendResponse(null);
    saveSignal();
  };
  /**
 * !!!Important Note:
 * To call a method inside useEffect hook i.e saveSignal() that is defined inside the component,
 * it should ALWAYS use a callback hook 'useCallback' with its required dependencies array
 * so that the function is memoized and is referenced
 * at a single place in the memory.
 * This avoids a new reference in the memory for the saveSignal() method
 * on each render cycle of the component and prevents it to behave abnormally.
 */
  useEffect(() => {
    if (!backendResponse && !isLoading) {
      saveSignal();
    }
  }, [backendResponse, isLoading, saveSignal]);

  const onActionButtonClick = () => {
    if (actionButtonText === i18n.t('trend_radar_open_list')) {
      history.push(getMyKeyInvestDashboardLink());
      return;
    }
    retrySaveSignal();
  };

  return (
    <div className={classNames('TrendRadarSaveSignalPopup', className)}>
      <Overlay>
        <Popup
          togglePopup={onClosePopup}
        >
          {isLoading && (
            <div className={isLoading ? 'is-loading' : ''} />
          )}
          {!isLoading && (
          <>
            <h1>
              <Icon type="trendradar" />
              {i18n.t('trend_radar_save_signal')}
            </h1>
            <span className="underlying-pattern-type">{`${getUnderlyingName(data)} ${i18n.t('on')} ${getPatternTypeName(data)}`}</span>
            {alertType && (
            <Alert type={alertType} withoutCloseIcon>
              {getResponseMessage(backendResponse)}
            </Alert>
            )}
            <div className="buttons">
              <Button className="btn-list-open" color={BUTTON_COLOR.OLIVE} onClick={onActionButtonClick}>{actionButtonText}</Button>
              <Button className="btn-close-popup" color={BUTTON_COLOR.STANDARD} onClick={onClosePopup}>{i18n.t('trend_radar_close_window')}</Button>
            </div>
          </>
          )}
        </Popup>
      </Overlay>
    </div>
  );
};

TrendRadarSaveSignalPopupCmp.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  onClosePopup: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any),
};

TrendRadarSaveSignalPopupCmp.defaultProps = {
  className: '',
  data: {},
  onClosePopup: () => {},
  history: {
    push: () => {},
  },
};

export default React.memo(withRouter(TrendRadarSaveSignalPopupCmp));
