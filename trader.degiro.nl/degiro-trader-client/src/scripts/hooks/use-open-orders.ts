import {Order} from 'frontend-core/dist/models/order';
import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {OrdersEvents} from '../event-broker/event-types';

const {ADD, CHANGE, REMOVE, LAST_DATA, RESET} = OrdersEvents;

export default function useOpenOrders(): Order[] | undefined {
    const eventBroker = useContext(EventBrokerContext);
    const [orders, setOrders] = useState<Order[]>();

    useEffect(
        () =>
            eventBroker.on(ADD, (_e, newOrders) => {
                setOrders((oldOrders) => newOrders.concat(oldOrders || []));
            }),
        []
    );

    useEffect(
        () =>
            eventBroker.on(CHANGE, (_e, newOrders) => {
                setOrders((oldOrders) =>
                    oldOrders?.map((oldOrder) => newOrders.find((newOrder) => newOrder.id === oldOrder.id) || oldOrder)
                );
            }),
        []
    );

    useEffect(
        () =>
            eventBroker.on(REMOVE, (_e, newOrders) =>
                setOrders((oldOrders) =>
                    oldOrders?.filter((oldOrder) => !newOrders.some((newOrder) => newOrder.id === oldOrder.id))
                )
            ),
        []
    );

    useEffect(() => eventBroker.once(LAST_DATA, (_e, newOrders: Order[]) => setOrders(newOrders)), []);
    useEffect(() => eventBroker.on(RESET, (_e, newOrders: Order[]) => setOrders(newOrders)), []);

    return orders;
}
