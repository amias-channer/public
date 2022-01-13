export interface SubscriptionEvent<T = string> {
    name: T;
}

export interface SubscriptionParams {
    [key: string]: any;
}

// set no data by default
export type SubscriptionCallback<D = void> = (event: SubscriptionEvent, data: D) => any;

export type Unsubscribe = () => void;

export function unsubscribeAll(callbacks: Unsubscribe[]) {
    callbacks.forEach((callback: Unsubscribe) => callback());

    // remove links to callbacks (GC)
    callbacks.length = 0;
}
