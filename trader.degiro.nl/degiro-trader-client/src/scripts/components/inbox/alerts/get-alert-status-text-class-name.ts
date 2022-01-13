import {MessageSeverityLevels} from 'frontend-core/dist/models/message';
import {failureStatusText, infoStatusText, warningStatusText} from '../../status/status.css';

export default function getAlertStatusTextClassName(
    severity: MessageSeverityLevels | undefined,
    defaultClassName: string = infoStatusText
): string {
    if (severity === MessageSeverityLevels.URGENT) {
        return failureStatusText;
    }

    if (severity === MessageSeverityLevels.MEDIUM) {
        return warningStatusText;
    }

    if (severity === MessageSeverityLevels.INFO) {
        return infoStatusText;
    }

    return defaultClassName;
}
