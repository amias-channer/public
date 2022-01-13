import {TotalPortfolioData} from 'frontend-core/dist/models/total-portfolio';
import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {TotalPortfolioEvents} from '../event-broker/event-types';
import {SubscriptionEvent, Unsubscribe, unsubscribeAll} from '../event-broker/subscription';

interface State {
    isLoading: boolean;
    totalPortfolio: TotalPortfolioData;
}

export default function useTotalPortfolio(): Readonly<State> {
    const eventBroker = useContext(EventBrokerContext);
    const [state, setState] = useState<State>({isLoading: true, totalPortfolio: {}});

    useEffect(() => {
        const onTotalPortfolio = (_event: SubscriptionEvent, totalPortfolio: TotalPortfolioData) => {
            setState({isLoading: false, totalPortfolio});
        };
        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.once(TotalPortfolioEvents.LAST_DATA, onTotalPortfolio),
            eventBroker.on(TotalPortfolioEvents.RESET, onTotalPortfolio),
            eventBroker.on(TotalPortfolioEvents.CHANGE, onTotalPortfolio)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, []);

    return state;
}
