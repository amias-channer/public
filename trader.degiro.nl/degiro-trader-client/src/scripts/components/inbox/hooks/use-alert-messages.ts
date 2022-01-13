import {Message} from 'frontend-core/dist/models/message';
import parseDate from 'frontend-core/dist/utils/date/parse-date';
import {useContext, useEffect, useRef, useState} from 'react';
import {AlertsEvents} from '../../../event-broker/event-types';
import {SubscriptionEvent, Unsubscribe, unsubscribeAll} from '../../../event-broker/subscription';
import {AlertMessage, InboxSettings} from '../../../models/inbox';
import {EventBrokerContext} from '../../app-component/app-context';

const setMessageReadState = (settings: InboxSettings, message: AlertMessage): AlertMessage => ({
    ...message,
    read: message.read || settings.readMessages.includes(message.checksum)
});
const parseMessage = (settings: InboxSettings, message: Message): AlertMessage => {
    return setMessageReadState(settings, {
        ...message,
        parsedModificationDate: parseDate(message.modificationDate, {keepOriginDate: true})
    });
};
const compareMessages = (firstMessage: AlertMessage, secondMessage: AlertMessage): number => {
    return Number(secondMessage.parsedModificationDate || 0) - Number(firstMessage.parsedModificationDate || 0);
};

export default function useAlertMessages(settings: InboxSettings): AlertMessage[] {
    const eventBroker = useContext(EventBrokerContext);
    const settingsRef = useRef<InboxSettings>(settings);
    const [messages, setMessages] = useState<AlertMessage[]>([]);

    settingsRef.current = settings;

    useEffect(() => {
        const onMessagesUpdate = (event: SubscriptionEvent, updatedMessages: Message[]) => {
            setMessages((existingMessages): AlertMessage[] => {
                const {current: settings} = settingsRef;
                const {name: eventName} = event;

                if (eventName === AlertsEvents.REMOVE) {
                    return existingMessages.filter(({id}: AlertMessage): boolean => {
                        return !updatedMessages.some((message: Message) => message.id === id);
                    });
                }

                const parseMessageWithSettings = parseMessage.bind(null, settings);

                if (eventName === AlertsEvents.RESET || eventName === AlertsEvents.LAST_DATA) {
                    return updatedMessages.map(parseMessageWithSettings).sort(compareMessages);
                }

                if (eventName === AlertsEvents.ADD) {
                    return updatedMessages.map(parseMessageWithSettings).concat(existingMessages).sort(compareMessages);
                }

                // it's update event
                return existingMessages
                    .map(
                        (message: AlertMessage): AlertMessage => {
                            const messageId: AlertMessage['id'] = message.id;
                            const updatedMessage: Message | undefined = updatedMessages.find(
                                (message: Message) => message.id === messageId
                            );

                            return updatedMessage ? parseMessageWithSettings(updatedMessage) : message;
                        }
                    )
                    .sort(compareMessages);
            });
        };
        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.once(AlertsEvents.LAST_DATA, onMessagesUpdate),
            eventBroker.on(AlertsEvents.RESET, onMessagesUpdate),
            eventBroker.on(AlertsEvents.ADD, onMessagesUpdate),
            eventBroker.on(AlertsEvents.CHANGE, onMessagesUpdate),
            eventBroker.on(AlertsEvents.REMOVE, onMessagesUpdate)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, []);

    useEffect(() => {
        setMessages((messages) => messages.map((message) => setMessageReadState(settings, message)));
    }, [settings]);

    return messages;
}
