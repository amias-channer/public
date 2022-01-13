import {EventBrokerStartConfig} from '../../event-broker';
import {SubscriptionParams} from '../../event-broker/subscription';
import {DataResourceEvent} from '../resources/data-resource';

export interface WorkerMessage<T = object | undefined> {
    action: string;
    data: T;
}

export type MessagePortSubscriptionWorkerMessage = WorkerMessage<{
    eventBrokerConfig: EventBrokerStartConfig;
    clientId: string;
}>;

export type DataResourceSubscriptionWorkerMessage = WorkerMessage<{
    params: SubscriptionParams | undefined;
    event: DataResourceEvent;
    clientId: string;
    lastActiveAt: number;
}>;

export type DataResourceEventTriggerWorkerMessage = WorkerMessage<{
    params: SubscriptionParams | object;
    data?: any;
    event: DataResourceEvent;
    clientId: string;
    lastActiveAt: number;
}>;

export type BroadcastEventMessage = WorkerMessage<{
    data?: any;
    event: DataResourceEvent;
    clientId: string;
    lastActiveAt: number;
}>;

/**
 * @description `event.data` might by null:
 *  - https://web-sentry.i.degiro.eu/degiroweb/degiro-trader-frontend/issues/16997
 *  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
 * @todo Investigate splitting of the JSON passed to .postMessage() into chunks.
 *  'portfolio:reset' with all positions takes 2-3 MB (while the optimal limit is 100kB) for large accounts.
 *  https://surma.dev/things/is-postmessage-slow/
 * @param {MessageEvent} event
 * @returns {WorkerMessage<any>|null}
 */
export function parseWorkerMessage<T>(event: MessageEvent): WorkerMessage<T> | null {
    return JSON.parse(event.data);
}

export function createWorkerMessage(data: WorkerMessage | Omit<WorkerMessage, 'data'>): string {
    // For max. performance we should stringify the messages for Worker.
    // https://nolanlawson.com/2016/02/29/high-performance-web-worker-messages
    return JSON.stringify(data);
}
