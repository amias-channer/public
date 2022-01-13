import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TrendRadarSignalDirection from '../../../TrendRadarSignalDirection';
import {
  getSignalDirectionOrientation, getSignalPatternTypeName,
  getSignalUnderlyingName, getSignalPatternId,
} from '../TrendRadarSignal.helper';
import FlyoutMenu from '../../../../ProductExpandableTile/FlyoutMenu';
import Icon from '../../../../Icon';
import i18n from '../../../../../utils/i18n';
import { getTrendRadarSignalDetailLink } from '../../../../../utils/utils';
import { MOBILE_MODE } from '../../../../../utils/responsive';
import './TrendRadarSignalHeader.scss';
import {
  getAddAlertUrl,
} from '../../TrendRadarListFilterable.helper';

const TrendRadarSignalHeader = ({
  className,
  data,
  responsiveMode,
  onShowCreateAlertFormPopup,
  onSaveSignal,
}) => {
  const preventDefaultFunc = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  };
  const onSaveSignalClicked = (e) => {
    preventDefaultFunc(e);
    onSaveSignal();
  };
  const onCreateAlertClicked = (e) => {
    preventDefaultFunc(e);
    onShowCreateAlertFormPopup(getAddAlertUrl(data));
  };
  const title = (
    <span className="align-middle">
      {getSignalUnderlyingName(data)}
      <span className="signal-title-separator">|</span>
      {getSignalPatternTypeName(data)}
    </span>
  );
  const directionOrientation = getSignalDirectionOrientation(data);
  const flyout = (
    <span className="icon-container">
      <FlyoutMenu>
        <ul>
          <li>
            <a
              href
              role="button"
              tabIndex={-1}
              onKeyPress={preventDefaultFunc}
              onClick={onSaveSignalClicked}
            >
              <Icon type="trendradar" />
              {i18n.t('save_signal')}
            </a>
          </li>
          <li>
            <a
              href
              role="button"
              tabIndex={-1}
              onKeyPress={preventDefaultFunc}
              onClick={onCreateAlertClicked}
            >
              <Icon type="bell" />
              {i18n.t('create_alert')}
            </a>
          </li>
          <li>
            <NavLink to={getTrendRadarSignalDetailLink(getSignalPatternId(data))}>
              <Icon type="arrow_01_forward" />
              {i18n.t('to_details')}
            </NavLink>
          </li>
        </ul>
      </FlyoutMenu>
    </span>
  );
  return (
    <div className={classNames('TrendRadarSignalHeader', className)}>
      <div className="row align-items-center">
        {directionOrientation && (
          <TrendRadarSignalDirection
            className="col-auto signal-direction"
            direction={directionOrientation}
          />
        )}
        {responsiveMode !== MOBILE_MODE && (
          <div className="col-10 signal-title">
            {title}
          </div>
        )}
        <div className="col-auto ml-auto flyout-icon-col">
          {flyout}
        </div>
      </div>
      {responsiveMode === MOBILE_MODE && (
        <div className="signal-title">{title}</div>
      )}
    </div>
  );
};

TrendRadarSignalHeader.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  responsiveMode: PropTypes.string.isRequired,
  onShowCreateAlertFormPopup: PropTypes.func,
  onSaveSignal: PropTypes.func,
};

TrendRadarSignalHeader.defaultProps = {
  className: '',
  data: {},
  onShowCreateAlertFormPopup: () => {},
  onSaveSignal: () => {},
};

export default React.memo(TrendRadarSignalHeader);
