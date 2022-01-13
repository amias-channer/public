import {MessageSeverityLevels} from 'frontend-core/dist/models/message';
import {failureStatusBackground, infoStatusBackground, warningStatusBackground} from '../../status/status.css';

export default function getAlertStatusBoxClassName(
    severity: MessageSeverityLevels | undefined,
    defaultClassName: string = infoStatusBackground
): string {
    if (severity === MessageSeverityLevels.URGENT) {
        return failureStatusBackground;
    }

    if (severity === MessageSeverityLevels.MEDIUM) {
        return warningStatusBackground;
    }

    if (severity === MessageSeverityLevels.INFO) {
        return infoStatusBackground;
    }

    return defaultClassName;
}
