import Icon, {IconType} from 'frontend-core/dist/components/ui-trader4/icon';
import * as React from 'react';
import {Statuses} from '../../../models/status';
import {
    alertStatusText,
    failureStatusText,
    inactiveStatusText,
    infoStatusText,
    pendingStatusText,
    successStatusText,
    warningStatusText
} from '../status.css';
import {statusIcon} from './status-icon.css';

interface Props {
    status: Statuses;
    className?: string;
    inactive?: boolean;
}

const StatusIcon: React.FunctionComponent<Props> = ({status, inactive, className = ''}) => {
    let iconType: IconType;
    let textClassName: string;

    if (status === Statuses.FAILURE) {
        iconType = 'cancel';
        textClassName = failureStatusText;
    } else if (status === Statuses.PENDING) {
        iconType = 'schedule';
        textClassName = pendingStatusText;
    } else if (status === Statuses.SUCCESS) {
        iconType = 'check_circle';
        textClassName = successStatusText;
    } else if (status === Statuses.WARNING) {
        iconType = 'error';
        textClassName = warningStatusText;
    } else if (status === Statuses.ALERT) {
        iconType = 'error';
        textClassName = alertStatusText;
    } else {
        iconType = 'info';
        textClassName = infoStatusText;
    }

    if (inactive) {
        textClassName = inactiveStatusText;
    }

    return <Icon type={iconType} className={`${statusIcon} ${textClassName} ${className}`} />;
};

export default React.memo(StatusIcon);
