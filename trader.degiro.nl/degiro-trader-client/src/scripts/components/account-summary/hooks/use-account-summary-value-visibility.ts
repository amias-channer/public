import {useCallback, useReducer, useContext, useEffect} from 'react';
import {AccountSummaryEvents} from '../../../event-broker/event-types';
import {EventBrokerContext} from '../../app-component/app-context';

let isVisible: boolean = true;

// We use this helper function only in tests, to clear global data
export const clearAccountSummaryValueVisibility = () => (isVisible = true);

export default function useAccountSummaryValueVisibility(): [boolean, (value: boolean) => void] {
    const [, rerender] = useReducer((x: number) => x + 1, 0);
    const eventBroker = useContext(EventBrokerContext);
    const setVisibility = useCallback(
        (value: boolean) => {
            isVisible = value;

            eventBroker.emit(
                value
                    ? AccountSummaryEvents.SWITCH_ON_VALUES_VISIBILITY
                    : AccountSummaryEvents.SWITCH_OFF_VALUES_VISIBILITY
            );
        },
        [eventBroker]
    );

    useEffect(() => eventBroker.on(AccountSummaryEvents.SWITCH_ON_VALUES_VISIBILITY, rerender), []);
    useEffect(() => eventBroker.on(AccountSummaryEvents.SWITCH_OFF_VALUES_VISIBILITY, rerender), []);

    return [isVisible, setVisibility];
}
