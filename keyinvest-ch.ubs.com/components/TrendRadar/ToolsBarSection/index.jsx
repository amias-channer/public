import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import Icon from '../../Icon';
import ToolsBar from '../../ToolsBar';
import {
  DESKTOP_MODE,
  isMobileMode,
  isTabletMode,
} from '../../../utils/responsive';
import {
  BOOKMARK_TOOL_BUTTON,
  EMAIL_TOOL_BUTTON, PRINT_TOOL_BUTTON,
} from '../../../pages/TrendRadarDetailsPage/TrendRadarDetailsPage.helper';
import i18n from '../../../utils/i18n';

const ToolsBarSection = ({
  onCreateAlertButtonClick,
  isAlertPopupLoading,
  responsiveMode,
  triggerToolAction,
  onSaveSignalButtonClick,
}) => {
  const emailAction = () => triggerToolAction(EMAIL_TOOL_BUTTON);
  const bookmarkAction = () => triggerToolAction(BOOKMARK_TOOL_BUTTON);
  const printAction = () => triggerToolAction(PRINT_TOOL_BUTTON);
  return (
    <div className="ToolsBarSection">
      <>
        {responsiveMode && (isMobileMode(responsiveMode) || isTabletMode(responsiveMode)) && (
          <ToolsBar className="mobile-toolbar">
            <div className={classNames('col toolbar-button')}>
              {isAlertPopupLoading && (
                <span className="is-loading" />
              )}
              {!isAlertPopupLoading && (
                <Button title={i18n.t('create_alert')} color="outline" className={classNames('create-alert')} onClick={onCreateAlertButtonClick}>
                  <Icon type="bell" />
                </Button>
              )}
            </div>
            <div className="col toolbar-button">
              <Button title={i18n.t('save_signal')} color="outline" className={classNames('save-signal')}>
                <Icon type="trendradar" />
              </Button>
            </div>
            <div className="col toolbar-button">
              <Button title={i18n.t('email')} color="outline" className={classNames('email')} onClick={emailAction}>
                <Icon type="mail" />
              </Button>
            </div>
            <div className="col toolbar-button">
              <Button title={i18n.t('bookmark')} color="outline" className="bookmark" onClick={bookmarkAction}>
                <Icon type="star" />
              </Button>
            </div>
            {isTabletMode(responsiveMode) && (
              <div className="col toolbar-button">
                <Button title={i18n.t('print')} color="outline" className="print" onClick={printAction}>
                  <Icon type="print" />
                </Button>
              </div>
            )}
          </ToolsBar>
        )}
        {responsiveMode && !isMobileMode(responsiveMode) && !isTabletMode(responsiveMode) && (
          <ToolsBar>
            <div className={classNames('col col-auto ml-auto toolbar-button')}>
              {isAlertPopupLoading && (
                <span className="is-loading" />
              )}
              {!isAlertPopupLoading && (
                <Button title={i18n.t('create_alert')} color="outline" className={classNames('create-alert')} onClick={onCreateAlertButtonClick}>
                  <Icon type="bell" onClick={onCreateAlertButtonClick} />
                </Button>
              )}
            </div>
            <div className="col col-auto toolbar-button">
              <Button title={i18n.t('save_signal')} color="outline" className={classNames('save-signal')} onClick={onSaveSignalButtonClick}>
                <Icon type="trendradar" />
              </Button>
            </div>
            <div className="col col-auto toolbar-button">
              <Button title={i18n.t('email')} color="outline" className={classNames('email')} onClick={emailAction}>
                <Icon type="mail" />
              </Button>
            </div>
            <div className="col col-auto toolbar-button">
              <Button title={i18n.t('bookmark')} color="outline" className="bookmark" onClick={bookmarkAction}>
                <Icon type="star" />
              </Button>
            </div>
            <div className="col col-auto toolbar-button">
              <Button title={i18n.t('print')} color="outline" className="print" onClick={printAction}>
                <Icon type="print" />
              </Button>
            </div>
          </ToolsBar>
        )}
      </>
    </div>
  );
};

ToolsBarSection.propTypes = {
  onCreateAlertButtonClick: PropTypes.func,
  onSaveSignalButtonClick: PropTypes.func,
  triggerToolAction: PropTypes.func,
  isAlertPopupLoading: PropTypes.bool,
  responsiveMode: PropTypes.string,
};

ToolsBarSection.defaultProps = {
  onCreateAlertButtonClick: () => {},
  onSaveSignalButtonClick: () => {},
  triggerToolAction: () => {},
  isAlertPopupLoading: false,
  responsiveMode: DESKTOP_MODE,
};

export default React.memo(ToolsBarSection);
