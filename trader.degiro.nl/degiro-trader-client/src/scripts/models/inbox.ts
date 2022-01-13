import {Message} from 'frontend-core/dist/models/message';

export const storageKey: string = 'inbox';

export interface InboxSettings {
    readMessages: Message['checksum'][];
}

export interface AlertMessage extends Message {
    parsedModificationDate?: Date;
}
