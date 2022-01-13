import {Message} from 'frontend-core/dist/models/message';
import {useContext, useEffect, useState} from 'react';
import {AlertsEvents} from '../../../event-broker/event-types';
import {InboxSettings} from '../../../models/inbox';
import getInboxSettings from '../../../services/inbox/get-inbox-settings';
import saveInboxSettings from '../../../services/inbox/save-inbox-settings';
import {EventBrokerContext} from '../../app-component/app-context';

export default function useInboxSettings(): {
    settings: Readonly<InboxSettings>;
    markMessagesAsRead(messages: Message[]): void;
} {
    const eventBroker = useContext(EventBrokerContext);
    const [settings, setSettings] = useState<InboxSettings>(getInboxSettings);
    const markMessagesAsRead = (messages: Message[]) => {
        if (messages.length) {
            const messageHashes: string[] = messages.map((message) => message.checksum);

            eventBroker.emit(AlertsEvents.MARK_AS_READ, {messages: messageHashes});
            setSettings((settings: InboxSettings) => ({
                ...settings,
                readMessages: settings.readMessages.concat(messageHashes)
            }));
        }
    };

    useEffect(() => {
        saveInboxSettings(settings);
    }, [settings]);

    return {settings, markMessagesAsRead};
}
