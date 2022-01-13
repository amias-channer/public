import {AlertMessage} from '../../../models/inbox';
import useAlertMessages from '../hooks/use-alert-messages';
import useInboxSettings from '../hooks/use-inbox-settings';

export default function useUnreadMessagesCount(): number {
    const {settings} = useInboxSettings();
    const messages: AlertMessage[] = useAlertMessages(settings);

    return messages.filter(({read}) => !read).length;
}
