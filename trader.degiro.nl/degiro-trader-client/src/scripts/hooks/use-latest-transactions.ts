import {LatestTransaction} from 'frontend-core/dist/models/transaction';
import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {TransactionsEvents} from '../event-broker/event-types';
import {SubscriptionEvent, Unsubscribe, unsubscribeAll} from '../event-broker/subscription';

interface State {
    isLoading: boolean;
    transactions: LatestTransaction[];
}

export default function useLatestTransactions(): Readonly<State> {
    const eventBroker = useContext(EventBrokerContext);
    const [state, setState] = useState<State>({isLoading: true, transactions: []});

    useEffect(() => {
        const onTransactionsUpdate = (event: SubscriptionEvent, updatedTransactions: LatestTransaction[]) => {
            setState((state: State) => {
                const {name: eventName} = event;
                const {transactions: existingTransactions} = state;
                let newTransactions: LatestTransaction[];

                // reset
                if (eventName === TransactionsEvents.RESET || eventName === TransactionsEvents.LAST_DATA) {
                    newTransactions = updatedTransactions;
                } else if (eventName === TransactionsEvents.ADD) {
                    newTransactions = updatedTransactions.concat(existingTransactions);
                } else if (eventName === TransactionsEvents.REMOVE) {
                    newTransactions = existingTransactions.filter(({id}: LatestTransaction): boolean => {
                        return !updatedTransactions.some((transaction: LatestTransaction) => transaction.id === id);
                    });
                } else {
                    // it's update event
                    newTransactions = existingTransactions.map(
                        (transaction: LatestTransaction): LatestTransaction => {
                            const transactionId: number = transaction.id;
                            const updatedTransaction: LatestTransaction | undefined = updatedTransactions.find(
                                (transaction: LatestTransaction) => transaction.id === transactionId
                            );

                            return updatedTransaction || transaction;
                        }
                    );
                }

                return {
                    isLoading: false,
                    transactions: newTransactions
                };
            });
        };
        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.once(TransactionsEvents.LAST_DATA, onTransactionsUpdate),
            eventBroker.on(TransactionsEvents.ADD, onTransactionsUpdate),
            eventBroker.on(TransactionsEvents.CHANGE, onTransactionsUpdate),
            eventBroker.on(TransactionsEvents.REMOVE, onTransactionsUpdate),
            eventBroker.on(TransactionsEvents.RESET, onTransactionsUpdate)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, []);

    return state;
}
