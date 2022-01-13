import {useContext, useEffect, useCallback, useReducer} from 'react';
import {FavouriteProductsList} from 'frontend-core/dist/models/favourite-product';
import getFavouriteProductsLists from 'frontend-core/dist/services/favourite-product/get-favourite-products-lists';
import {UseAsyncResult} from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {AppError} from 'frontend-core/dist/models/app-error';
import {FavouriteProductsListsEvents} from '../../../event-broker/event-types';
import {ConfigContext, EventBrokerContext} from '../../app-component/app-context';

let isLoading: boolean = false;
let value: FavouriteProductsList[] | undefined;
let error: Error | AppError | undefined;

// We use this helper function only in tests, to clear global data
export const clearFavouriteListsData = () => {
    isLoading = false;
    value = undefined;
    error = undefined;
};

export default function useFavouriteLists(): UseAsyncResult<FavouriteProductsList[]> & {update: () => void} {
    const config = useContext(ConfigContext);
    const eventBroker = useContext(EventBrokerContext);
    const [, rerender] = useReducer((x: number) => x + 1, 0);
    const requestData = useCallback(() => {
        isLoading = true;

        getFavouriteProductsLists(config)
            .then((favouriteLists) => {
                isLoading = false;
                error = undefined;
                eventBroker.broadcast(FavouriteProductsListsEvents.UPDATE, favouriteLists);
            })
            .catch((loadingError) => {
                isLoading = false;
                error = loadingError;
                // TODO: I am not sure what is a better approach, return error for one component
                //       or emit event for all subscribers.
                //       Maybe will be better to find solution which cover both cases
                rerender();
            });
    }, [config, eventBroker]);

    useEffect(() => {
        if (!isLoading && !value) {
            requestData();
        }
    }, []);

    useEffect(
        () =>
            eventBroker.on(FavouriteProductsListsEvents.UPDATE, (_, favouriteLists) => {
                value = favouriteLists;
                rerender();
            }),
        [eventBroker]
    );

    return {
        isLoading: isLoading || (!value && !error),
        value,
        error,
        update: requestData
    };
}
