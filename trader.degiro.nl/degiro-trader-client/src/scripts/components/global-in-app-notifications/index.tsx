import {LatestTransaction} from 'frontend-core/dist/models/transaction';
import createUUID from 'frontend-core/dist/utils/create-uuid';
import * as React from 'react';
import {OrdersEvents, TransactionsEvents} from '../../event-broker/event-types';
import {SubscriptionEvent, Unsubscribe, unsubscribeAll} from '../../event-broker/subscription';
import {EventBrokerContext} from '../app-component/app-context';
import ChangedOrderNotification from './notifications/changed-order-notification';
import NewOrderNotification from './notifications/new-order-notification';
import NewTransactionNotification from './notifications/new-transaction-notification';
import RemovedOrderNotification from './notifications/removed-order-notification';

const {useEffect, useState, useContext} = React;

interface BaseNotificationComponentProps {
    onClose(): void;
}

type Notification<C extends React.ComponentType<any> = any> = C extends React.ComponentType<infer P>
    ? Omit<P, keyof BaseNotificationComponentProps> & {
          id: string;
          Component: C;
      }
    : never;

/**
 * @description This component shows in-app notifications for global events, e.g. order execution
 * @constructor
 */
const GlobalInAppNotifications: React.FunctionComponent = () => {
    const eventBroker = useContext(EventBrokerContext);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const addNotification = <C extends React.ComponentType<any>>(notification: Omit<Notification<C>, 'id'>) => {
        setNotifications((notifications) => [...notifications, {id: createUUID(), ...notification} as Notification<C>]);
    };
    const closeNotification = (notificationId: Notification['id']) => {
        setNotifications((notifications) => notifications.filter((notification) => notification.id !== notificationId));
    };

    useEffect(() => {
        const onAddedTransactions = (_event: SubscriptionEvent, transactions: LatestTransaction[]) => {
            transactions.forEach((transaction: LatestTransaction) => {
                addNotification<typeof NewTransactionNotification>({
                    transaction,
                    Component: NewTransactionNotification
                });
            });
        };
        const onAddedOrders = () => {
            addNotification<typeof NewOrderNotification>({Component: NewOrderNotification});
        };
        const onChangedOrders = () => {
            addNotification<typeof ChangedOrderNotification>({Component: ChangedOrderNotification});
        };
        const onRemovedOrders = () => {
            addNotification<typeof RemovedOrderNotification>({Component: RemovedOrderNotification});
        };
        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.on(OrdersEvents.ADD, onAddedOrders),
            eventBroker.on(OrdersEvents.CHANGE, onChangedOrders),
            eventBroker.on(OrdersEvents.REMOVE, onRemovedOrders),
            eventBroker.on(TransactionsEvents.ADD, onAddedTransactions)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, []);

    return (
        <div>
            {notifications.slice(0, 5).map(({id, Component, ...props}: Notification) => (
                <Component key={id} onClose={closeNotification.bind(null, id)} {...props} />
            ))}
        </div>
    );
};

export default React.memo(GlobalInAppNotifications);
