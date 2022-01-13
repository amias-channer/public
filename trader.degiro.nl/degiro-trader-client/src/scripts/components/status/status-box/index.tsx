import * as React from 'react';
import {Statuses} from '../../../models/status';
import ExternalHtmlContent from '../../external-html-content';
import StatusIcon from '../status-icon';
import {alertStatusBackground, infoStatusBackground, warningStatusBackground} from '../status.css';
import {statusBox, statusBoxBody, statusBoxIcon, statusBoxTitle} from './status-box.css';

interface Props {
    title?: string;
    body: string;
    status: Statuses;
    className?: string;
}

const StatusBox: React.FunctionComponent<Props> = ({title, status, className = '', body, children}) => {
    let statusClassName: string = infoStatusBackground;

    if (status === Statuses.WARNING) {
        statusClassName = warningStatusBackground;
    } else if (status === Statuses.ALERT) {
        statusClassName = alertStatusBackground;
    }

    return (
        <article className={`${statusBox} ${statusClassName} ${className}`}>
            <StatusIcon status={status} className={statusBoxIcon} />
            {title && <h3 className={statusBoxTitle}>{title}</h3>}
            <ExternalHtmlContent className={statusBoxBody}>{body}</ExternalHtmlContent>
            {children}
        </article>
    );
};

export default React.memo<React.PropsWithChildren<Props>>(StatusBox);
