import * as React from 'react';
import Icon from '../icon/index';
import {
    closeButton,
    content as contentClassName,
    fadeInNotification,
    infoNotification,
    mainSection,
    notification,
    notificationIcon,
    warningNotification
} from './page-notification.css';

export enum PageNotificationTypes {
    INFO = 'INFO',
    WARNING = 'WARNING'
}

interface Props {
    type: PageNotificationTypes;
    content: React.ReactNode | React.ReactNode[];
    fadeIn?: boolean;
    onClose?: () => void;
}

const PageNotification: React.FunctionComponent<Props> = ({type, content, fadeIn, onClose}) => {
    const isWarning: boolean = type === PageNotificationTypes.WARNING;

    return (
        <div
            data-name="notification"
            className={`${notification} ${isWarning ? warningNotification : infoNotification} ${
                fadeIn ? fadeInNotification : ''
            }`}>
            <div data-name="notificationContent" className={mainSection}>
                <Icon
                    type={isWarning ? 'exclamation-circle_solid' : 'info-circle_solid'}
                    className={notificationIcon}
                />
                <div className={contentClassName}>{content}</div>
            </div>
            {typeof onClose === 'function' && (
                <button
                    type="button"
                    onClick={onClose}
                    className={closeButton}
                    aria-label="Close notification"
                    data-name="closeNotification">
                    <Icon type="times_light" />
                </button>
            )}
        </div>
    );
};

export default React.memo(PageNotification);
