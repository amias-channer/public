import {
    addEventSubscription,
    createSubscription,
    EventEmitter,
    EventEmitterCallback,
    EventEmitterSubscriptionArguments,
    EventEmitterSubscriptionParams,
    getSubscriptionArguments
} from 'evitter';
import {ErrorLoggerOptions, logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import {Config} from 'frontend-core/dist/models/config';
import {FavouriteProductsList} from 'frontend-core/dist/models/favourite-product';
import {MarketMoversSubscriptionParams} from 'frontend-core/dist/models/market-mover';
import {Order} from 'frontend-core/dist/models/order';
import {User} from 'frontend-core/dist/models/user';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import {CashOrderInfo} from '../models/cash-order';
import {CommonOrderInfo} from '../models/order';
import {ProductNotesMeta} from '../models/product-note';
import {
    AccountSummaryEvents,
    AlertsEvents,
    CashOrderEvents,
    ClientAccountEvents,
    CombinationOrderEvents,
    CommonOrderEvents,
    CurrencyExchangeEvents,
    CurrencyOrderEvents,
    FavouriteProductsListsEvents,
    FeedbackEvents,
    LanguageSettingsEvents,
    MarketMoversEvents,
    OrderBookEvents,
    OrdersEvents,
    PortfolioEvents,
    ProductNotesEvents,
    ProductTourEvents,
    QuotecastEvents,
    ServiceEvents,
    TotalPortfolioEvents,
    TransactionsEvents
} from './event-types';
import {AlertsMarkAsReadParams, AlertsUpdateCallback} from './resources/alerts';
import {
    CurrencyExchangeParams,
    CurrencyExchangeRateUpdateCallback,
    CurrencyPairProductUpdateCallback
} from './resources/currency-exchange';
import {MarketMoversUpdateCallback} from './resources/market-movers';
import {OrderBookUpdateCallback, OrderBookUpdateParams} from './resources/order-book';
import {OrdersUpdateCallback} from './resources/orders';
import {
    LastPositionsListUpdateCallback,
    PortfolioUpdateParams,
    PositionsResetCallback,
    PositionsUpdateCallback
} from './resources/portfolio';
import {QuotecastDataParams, QuotecastDataUpdateCallback} from './resources/quotecast';
import {TotalPortfolioUpdateCallback} from './resources/total-portfolio';
import {TransactionsUpdateCallback} from './resources/transactions';
import {
    BROADCAST_EVENT,
    EMIT_EVENT,
    EMIT_ON_RESOURCE,
    INIT_ERROR_LOGGER,
    NOTIFY_ON_EXPIRED_SESSION,
    NOTIFY_ON_MAX_FAILED_UPDATE_REQUESTS,
    SUBSCRIBE_MESSAGE_PORT,
    SUBSCRIBE_RESOURCE,
    UNSUBSCRIBE_MESSAGE_PORT,
    UNSUBSCRIBE_RESOURCE
} from './shared/action-types';
import {getBaseCurrency, getCurrentClientId, getMainClientId} from './shared/client';
import {parseNamespaceEvent} from './shared/events';
import sendWorkerMessage from './shared/send-worker-message';
import {
    DataResourceEventTriggerWorkerMessage,
    DataResourceSubscriptionWorkerMessage,
    parseWorkerMessage,
    WorkerMessage
} from './shared/worker-message';
import {SubscriptionCallback, Unsubscribe} from './subscription';

export interface EventBrokerProps {
    requires: string[];
    workerFile: string;

    // minutes
    idleTime: number;
}

type OptionalEventEmitterCallback = EventEmitterCallback | undefined;

const eventsToEmitOnWorkerResource = new Set<AlertsEvents>([AlertsEvents.MARK_AS_READ]);

export interface EventBrokerStartConfig {
    currentClient: User;
    mainClient: User;
    referrer: string;
    userAgent: string;
    appConfig: Config;
    errorLogger: ErrorLoggerOptions;
    maxSnapshotRequestErrorsCount?: number;
    dedicatedVwdStreamer?: boolean;
}

type EventWithoutParamsAndData =
    | ClientAccountEvents.CHANGE_TRADING_PROFILE
    | ClientAccountEvents.LOGOUT
    | CombinationOrderEvents.OPEN
    | CurrencyOrderEvents.OPEN
    | ProductTourEvents
    | FeedbackEvents
    | AccountSummaryEvents;

export interface EventBroker {
    emit(eventName: AlertsEvents.MARK_AS_READ, params: AlertsMarkAsReadParams): void;
    emit(eventName: CommonOrderEvents.OPEN, data: CommonOrderInfo): void;
    emit(eventName: CashOrderEvents.OPEN, data: CashOrderInfo): void;
    emit(eventName: CommonOrderEvents.EDIT | CommonOrderEvents.VIEW | CommonOrderEvents.DELETE, data: Order): void;
    emit(eventName: ClientAccountEvents.SWITCH_ACCOUNT, data: {client: User}): void;
    emit(eventName: EventWithoutParamsAndData): void;

    broadcast(eventName: LanguageSettingsEvents.CHANGE_DISPLAY_LANGUAGE, data: string): void;
    broadcast(eventName: FavouriteProductsListsEvents.UPDATE, data: FavouriteProductsList[]): void;
    broadcast(eventName: ProductNotesEvents.UPDATE, data: ProductNotesMeta): void;

    stop(): void;
    start(config: EventBrokerStartConfig): void;

    // subscribe once
    once(eventName: AlertsEvents.LAST_DATA, callback: AlertsUpdateCallback): Unsubscribe;
    once(eventName: OrdersEvents.LAST_DATA, callback: OrdersUpdateCallback): Unsubscribe;
    once(eventName: TransactionsEvents.LAST_DATA, callback: TransactionsUpdateCallback): Unsubscribe;
    once(eventName: TotalPortfolioEvents.LAST_DATA, callback: TotalPortfolioUpdateCallback): Unsubscribe;
    once(
        eventName: CurrencyExchangeEvents.LAST_EXCHANGE_RATE | CurrencyExchangeEvents.CHANGE,
        params: CurrencyExchangeParams,
        callback: CurrencyExchangeRateUpdateCallback
    ): Unsubscribe;
    once(
        eventName: CurrencyExchangeEvents.CURRENCY_PAIR_PRODUCT,
        params: CurrencyExchangeParams,
        callback: CurrencyPairProductUpdateCallback
    ): Unsubscribe;
    once(eventName: PortfolioEvents.LAST_ACTIVE_POSITIONS, callback: LastPositionsListUpdateCallback): Unsubscribe;
    once(
        eventName: PortfolioEvents.LAST_ACTIVE_POSITIONS,
        params: PortfolioUpdateParams,
        callback: LastPositionsListUpdateCallback
    ): Unsubscribe;
    once(eventName: PortfolioEvents.LAST_DATA, callback: PositionsResetCallback): Unsubscribe;
    once(
        eventName: PortfolioEvents.LAST_DATA,
        params: PortfolioUpdateParams,
        callback: PositionsResetCallback
    ): Unsubscribe;
    once(
        eventName: MarketMoversEvents,
        params: MarketMoversSubscriptionParams,
        callback: MarketMoversUpdateCallback
    ): Unsubscribe;

    // subscribe
    on(eventName: ProductNotesEvents.UPDATE, callback: SubscriptionCallback<ProductNotesMeta>): Unsubscribe;
    on(
        eventName: FavouriteProductsListsEvents.UPDATE,
        callback: SubscriptionCallback<FavouriteProductsList[]>
    ): Unsubscribe;
    on(eventName: CommonOrderEvents.OPEN, callback: SubscriptionCallback<CommonOrderInfo>): Unsubscribe;
    on(eventName: CashOrderEvents.OPEN, callback: SubscriptionCallback<CashOrderInfo>): Unsubscribe;
    on(
        eventName: CommonOrderEvents.EDIT | CommonOrderEvents.VIEW | CommonOrderEvents.DELETE,
        callback: SubscriptionCallback<Order>
    ): Unsubscribe;
    on(eventName: ClientAccountEvents.SWITCH_ACCOUNT, callback: SubscriptionCallback<{client: User}>): Unsubscribe;
    on(eventName: EventWithoutParamsAndData, callback: SubscriptionCallback): Unsubscribe;
    on(
        eventName: OrderBookEvents.CHANGE,
        params: OrderBookUpdateParams,
        callback: OrderBookUpdateCallback
    ): Unsubscribe;
    on(
        eventName: QuotecastEvents.CHANGE,
        params: QuotecastDataParams,
        callback: QuotecastDataUpdateCallback
    ): Unsubscribe;
    on(
        eventName: CurrencyExchangeEvents.CHANGE,
        params: CurrencyExchangeParams,
        callback: CurrencyExchangeRateUpdateCallback
    ): Unsubscribe;
    on(eventName: TransactionsEvents, callback: TransactionsUpdateCallback): Unsubscribe;
    on(eventName: OrdersEvents, callback: OrdersUpdateCallback): Unsubscribe;
    on(eventName: PortfolioEvents.RESET, callback: PositionsResetCallback): Unsubscribe;
    on(eventName: PortfolioEvents.RESET, params: PortfolioUpdateParams, callback: PositionsResetCallback): Unsubscribe;
    on(
        eventName: PortfolioEvents.CHANGE | PortfolioEvents.ADD | PortfolioEvents.REMOVE,
        callback: PositionsUpdateCallback
    ): Unsubscribe;
    on(
        eventName: PortfolioEvents.CHANGE | PortfolioEvents.ADD | PortfolioEvents.REMOVE,
        params: PortfolioUpdateParams,
        callback: PositionsUpdateCallback
    ): Unsubscribe;
    on(
        eventName: MarketMoversEvents,
        params: MarketMoversSubscriptionParams,
        callback: MarketMoversUpdateCallback
    ): Unsubscribe;
    on(eventName: AlertsEvents, callback: AlertsUpdateCallback): Unsubscribe;
    on(eventName: ServiceEvents, callback: SubscriptionCallback): Unsubscribe;
    on(eventName: TotalPortfolioEvents, callback: TotalPortfolioUpdateCallback): Unsubscribe;
    on(eventName: LanguageSettingsEvents.CHANGE_DISPLAY_LANGUAGE, callback: SubscriptionCallback<string>): Unsubscribe;

    // unsubscribe
    off(): void;
}

class EventBrokerClass extends EventEmitter implements EventBroker {
    private readonly workerBaseUrl: string;
    private dedicatedWorker?: Worker;
    private sharedWorker?: SharedWorker;
    private config?: EventBrokerStartConfig;
    private clientId?: string;
    private lastActiveAt?: number;

    constructor({workerFile, idleTime, requires}: EventBrokerProps) {
        super();
        this.workerBaseUrl = `${workerFile}?${getQueryString({
            requires: requires.toString(),
            idleTime
        })}`;
    }

    private onClientActivity = () => {
        this.lastActiveAt = Date.now();
    };

    private onWorkerError = (event: ErrorEvent) => {
        logErrorRemotely(event);
    };

    private onWorkerMessage = (event: MessageEvent) => {
        const message: WorkerMessage | null = parseWorkerMessage(event);

        if (!message) {
            return;
        }

        switch (message.action) {
            case NOTIFY_ON_EXPIRED_SESSION:
                this.emit(ServiceEvents.EXPIRED_SESSION);
                break;
            case NOTIFY_ON_MAX_FAILED_UPDATE_REQUESTS:
                this.emit(ServiceEvents.MAX_FAILED_UPDATE_REQUESTS);
                break;
            case EMIT_EVENT: {
                const {event, params, data} = message.data as {
                    event: string;
                    params?: EventEmitterSubscriptionParams;
                    data?: any;
                };

                this.emit(event, params, data);
                break;
            }
            default:
            //
        }
    };

    private sendWorkerMessage(message: WorkerMessage | Omit<WorkerMessage, 'data'>) {
        const {sharedWorker, dedicatedWorker} = this;

        if (sharedWorker) {
            sendWorkerMessage(message, [sharedWorker.port]);
        } else if (dedicatedWorker) {
            sendWorkerMessage(message, [dedicatedWorker]);
        }
    }

    private subscribeToResource(event: string, params: any) {
        this.sendWorkerMessage({
            action: SUBSCRIBE_RESOURCE,
            data: {
                clientId: this.clientId,
                lastActiveAt: this.lastActiveAt,
                event,
                params
            }
        } as DataResourceSubscriptionWorkerMessage);
    }

    private unsubscribeFromResource(event: string, params: any) {
        this.sendWorkerMessage({
            action: UNSUBSCRIBE_RESOURCE,
            data: {
                clientId: this.clientId,
                lastActiveAt: this.lastActiveAt,
                event,
                params
            }
        } as DataResourceSubscriptionWorkerMessage);
    }

    private unsubscribeActivityListeners() {
        document.removeEventListener('click', this.onClientActivity, false);
        document.removeEventListener('keyup', this.onClientActivity, false);
    }

    private subscribeActivityListeners() {
        document.addEventListener('click', this.onClientActivity, false);
        document.addEventListener('keyup', this.onClientActivity, false);
    }

    private destroyWorkers() {
        const {sharedWorker, dedicatedWorker} = this;

        // try to close a message port in the worker (remove unused resources, etc.)
        this.sendWorkerMessage({
            action: UNSUBSCRIBE_MESSAGE_PORT
        });

        if (sharedWorker) {
            sharedWorker.port.close();
        } else if (dedicatedWorker) {
            dedicatedWorker.terminate();
        }

        this.dedicatedWorker = undefined;
        this.sharedWorker = undefined;
    }

    private addEventSubscription(options: {
        once?: boolean;
        eventName: string;
        params?: EventEmitterSubscriptionParams | Function;
        callback?: Function;
    }): Unsubscribe {
        const {eventName, params, callback, once} = options;
        const subscriptionArguments: EventEmitterSubscriptionArguments = getSubscriptionArguments(
            eventName,
            params,
            callback as OptionalEventEmitterCallback
        );
        const {namespace} = parseNamespaceEvent(eventName);
        let subscriptionParams: EventEmitterSubscriptionParams | undefined = subscriptionArguments.params;
        let unsubscribe: Unsubscribe | undefined = addEventSubscription(
            eventName,
            this.subscriptions,
            createSubscription({once}, subscriptionArguments)
        );
        let isUnsubscribed: boolean = false;

        // for non-resource event return a standard canceller
        if (!namespace) {
            return unsubscribe;
        }

        // TODO: Consider removing this check at all and send a resource message always to the worker
        // - [WF-1414] check if it's a first subscription on this resource
        // - [WF-2404] send VWD events always to the worker, because VWD SDK sends the last data snapshot
        //   on each new 'change' event subscription
        // - .once() method is used for all LAST_* events which can trigger immediate response callback
        const shouldAlwaysSendToWorker: boolean =
            once || eventName === OrderBookEvents.CHANGE || eventName === QuotecastEvents.CHANGE;

        if (shouldAlwaysSendToWorker || this.getCallbacks(eventName, subscriptionParams).length === 1) {
            this.subscribeToResource(eventName, subscriptionParams);
        }

        return () => {
            if (isUnsubscribed) {
                return;
            }

            isUnsubscribed = true;
            unsubscribe?.();

            // [WF-1414], [TRADER-2564] check if it was the last active subscription for resource event
            if (shouldAlwaysSendToWorker || this.getCallbacks(eventName, subscriptionParams).length === 0) {
                this.unsubscribeFromResource(eventName, subscriptionParams);
            }

            unsubscribe = undefined;
            subscriptionParams = undefined;
        };
    }

    start(config: EventBrokerStartConfig) {
        const {appConfig, currentClient, mainClient, referrer, userAgent} = config;

        if (!appConfig) {
            throw new Error('Invalid appConfig');
        }

        if (!referrer) {
            throw Error('Invalid referrer');
        }

        if (!userAgent) {
            throw new Error('Invalid userAgent');
        }

        if (!currentClient.accountInfo) {
            throw new Error('Invalid currentClient.accountInfo');
        }

        if (!mainClient.accountInfo) {
            throw new Error('Invalid mainClient.accountInfo');
        }

        if (!getBaseCurrency(config)) {
            throw new Error('Invalid base currency in currentClient.accountInfo');
        }
        const mainClientId: string = getMainClientId(config);

        if (mainClientId === 'undefined') {
            throw new Error('Invalid mainClient id');
        }

        const currentClientId: string = getCurrentClientId(config);

        if (currentClientId === 'undefined') {
            throw new Error('Invalid currentClient id');
        }

        // destroy previous running
        this.destroyWorkers();
        this.unsubscribeActivityListeners();
        this.config = {
            ...config,
            appConfig: {
                ...appConfig,
                // important to not redirect in Worker, see Core/services/requestToApi()
                // see also https://web-sentry.i.degiro.eu/degiroweb/degiro-trader-frontend/issues/2130
                redirectUsPersonToLogin: false,
                redirectUnauthorizedToLogin: false
            }
        };
        this.clientId = currentClientId;

        const workerOptions: WorkerOptions = {
            name: `worker-${currentClientId}`
        };
        const {workerBaseUrl} = this;

        // [WF-2358]: added clientId to Worker URL to have a separate instance per client
        // It affects mainly SharedWorker
        if (typeof SharedWorker !== 'undefined') {
            this.sharedWorker = new SharedWorker(
                `${workerBaseUrl}&clientId=${currentClientId}&isSharedWorker=true`,
                workerOptions
            );
            this.sharedWorker.addEventListener('error', this.onWorkerError, false);
            const {port} = this.sharedWorker;

            port.addEventListener('message', this.onWorkerMessage, false);
            port.start();
        } else {
            this.dedicatedWorker = new Worker(`${workerBaseUrl}&clientId=${currentClientId}`, workerOptions);
            this.dedicatedWorker.addEventListener('message', this.onWorkerMessage, false);
            this.dedicatedWorker.addEventListener('error', this.onWorkerError, false);
        }

        this.subscribeActivityListeners();
        this.onClientActivity();
        this.sendWorkerMessage({
            action: INIT_ERROR_LOGGER,
            data: {
                ...config.errorLogger,
                clientId: mainClientId
            }
        });
        this.sendWorkerMessage({
            action: SUBSCRIBE_MESSAGE_PORT,
            data: {
                clientId: currentClientId,
                eventBrokerConfig: this.config
            }
        });
    }

    stop() {
        this.off();
        this.destroyWorkers();
        this.unsubscribeActivityListeners();
    }

    broadcast(eventName: string, data?: any) {
        this.sendWorkerMessage({
            action: BROADCAST_EVENT,
            data: {
                clientId: this.clientId,
                lastActiveAt: this.lastActiveAt,
                event: eventName,
                data
            }
        } as DataResourceEventTriggerWorkerMessage);
    }

    /**
     * @example .emit(AlertsEvents.MARK_AS_READ, {...})
     * @param {string} eventName
     * @param {EventEmitterSubscriptionParams} [params]
     * @param {*} [data]
     */
    emit(eventName: string, params?: EventEmitterSubscriptionParams, data?: any) {
        if (arguments.length < 3) {
            super.emit(eventName, params);
        } else {
            super.emit(eventName, params, data);
        }

        if (eventsToEmitOnWorkerResource.has(eventName as any)) {
            this.sendWorkerMessage({
                action: EMIT_ON_RESOURCE,
                data: {
                    clientId: this.clientId,
                    lastActiveAt: this.lastActiveAt,
                    event: eventName,
                    params,
                    data
                }
            } as DataResourceEventTriggerWorkerMessage);
        }
    }

    on(eventName: string, params?: EventEmitterSubscriptionParams | Function, callback?: Function): Unsubscribe {
        return this.addEventSubscription({
            eventName,
            params,
            callback
        });
    }

    once(eventName: string, params?: EventEmitterSubscriptionParams | Function, callback?: Function): Unsubscribe {
        return this.addEventSubscription({
            once: true,
            eventName,
            params,
            callback
        });
    }

    off(): void {
        super.off();
        this.sendWorkerMessage({action: UNSUBSCRIBE_MESSAGE_PORT});
    }
}

/**
 * @param {EventBrokerProps} props
 * @returns {EventBroker}
 */
export function createEventBroker(props: EventBrokerProps) {
    return new EventBrokerClass(props);
}
