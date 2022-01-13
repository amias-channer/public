import * as React from 'react';
import {AlertMessage} from '../../../models/inbox';
import {alert, alertBackdrop, alertStatusIcon, closableAlert, fullPageAlert} from './alerts.css';
import getAlertStatusBoxClassName from './get-alert-status-box-class-name';
import AlertStatusIcon from './status-icon';

interface Props {
    severity: AlertMessage['severity'];
    children: React.ReactNode;
    closable?: boolean;
}

const Alert: React.FunctionComponent<Props> = ({severity, closable, children}) => (
    <div className={alertBackdrop}>
        <div
            data-name="alerts"
            className={`${alert} ${fullPageAlert} ${getAlertStatusBoxClassName(severity)} ${
                closable ? closableAlert : ''
            }`}
            role="alert">
            <AlertStatusIcon className={alertStatusIcon} severity={severity} />
            {children}
        </div>
    </div>
);

export default React.memo(Alert);
