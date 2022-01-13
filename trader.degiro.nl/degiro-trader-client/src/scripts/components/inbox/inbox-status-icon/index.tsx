import Icon, {IconType} from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import useUnreadMessagesCount from '../hooks/use-unread-messages-count';
import {badge, layout} from './inbox-status-icon.css';

interface Props {
    className?: string;
    iconType?: IconType;
    iconClassName?: string;
}

const InboxStatusIcon: React.FunctionComponent<Props> = ({
    className = '',
    iconClassName,
    iconType = 'mail_outline'
}) => {
    const unreadMessagesCount: number = useUnreadMessagesCount();

    return (
        <span className={`${layout} ${className}`}>
            <Icon className={iconClassName} type={iconType} />
            {unreadMessagesCount ? <span className={badge}>{unreadMessagesCount}</span> : null}
        </span>
    );
};

export default React.memo(InboxStatusIcon);
