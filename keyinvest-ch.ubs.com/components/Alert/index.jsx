import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Alert as ReactstrapAlert,
  UncontrolledAlert as ReactstrapUncontrolledAlert,
} from 'reactstrap';
import Icon from '../Icon';
import { ALERT_ICON, ALERT_TYPE } from './Alert.helper';
import './Alert.scss';

const Alert = (props) => {
  const {
    dismissible, type, children, className, onDismiss, index, withoutCloseIcon,
  } = props;
  const icon = ALERT_ICON[type];
  const onAlertDismiss = (e) => {
    onDismiss(e, index);
  };

  if (dismissible) {
    return (
      <ReactstrapUncontrolledAlert className={classNames('Alert', type, className)} toggle={!withoutCloseIcon ? onAlertDismiss : undefined}>
        <div className="row">
          <div className="col-auto mr-auto">
            <Icon className="alert-icon" tag="i" type={icon} />
          </div>
          <div className="col content">
            {children}
          </div>
        </div>
      </ReactstrapUncontrolledAlert>
    );
  }

  return (
    <ReactstrapAlert className={classNames('Alert', type, className)} toggle={!withoutCloseIcon ? onAlertDismiss : undefined}>
      <div className="row">
        <div className="col-auto mr-auto">
          <Icon className="alert-icon" tag="i" type={icon} />
        </div>
        <div className="col content">
          {children}
        </div>
      </div>
    </ReactstrapAlert>
  );
};

Alert.propTypes = {
  dismissible: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  type: PropTypes.string,
  className: PropTypes.string,
  onDismiss: PropTypes.func,
  index: PropTypes.number,
  withoutCloseIcon: PropTypes.bool,
};
Alert.defaultProps = {
  dismissible: false,
  children: null,
  type: ALERT_TYPE.INFO,
  className: '',
  onDismiss: () => {},
  index: undefined,
  withoutCloseIcon: false,
};

export default React.memo(Alert);
