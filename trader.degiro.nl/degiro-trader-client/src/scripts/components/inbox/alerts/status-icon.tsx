import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import {MessageSeverityLevels} from 'frontend-core/dist/models/message';
import * as React from 'react';
import getAlertStatusTextClassName from './get-alert-status-text-class-name';

interface AlertStatusIconProps {
    severity: MessageSeverityLevels | undefined;
    className?: string;
}

const AlertStatusIcon: React.FunctionComponent<AlertStatusIconProps> = ({severity, className = ''}) => {
    const iconClassName = `${getAlertStatusTextClassName(severity, '')} ${className}`;

    if (severity === MessageSeverityLevels.URGENT) {
        return <Icon type="error" className={iconClassName} />;
    }

    if (severity === MessageSeverityLevels.MEDIUM) {
        return <Icon type="stars" className={iconClassName} />;
    }

    if (severity === MessageSeverityLevels.INFO) {
        return <Icon type="info" className={iconClassName} />;
    }

    return null;
};

export default React.memo(AlertStatusIcon);
