import {UseAsyncResult} from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {useCallback, useContext, useEffect, useReducer} from 'react';
import {AppError} from 'frontend-core/dist/models/app-error';
import {ConfigContext, EventBrokerContext} from '../components/app-component/app-context';
import {ProductNotesMeta} from '../models/product-note';
import getProductNotesMeta from '../services/product-notes/get-product-notes-meta';
import {ProductNotesEvents} from '../event-broker/event-types';

let isLoading: boolean = false;
let value: ProductNotesMeta | undefined;
let error: Error | AppError | undefined;

// We use this helper function only in tests, to clear global data
export const clearProductNotesMeta = () => {
    isLoading = false;
    value = undefined;
    error = undefined;
};

export default function useProductNotesMeta(): UseAsyncResult<ProductNotesMeta> & {update: () => void} {
    const config = useContext(ConfigContext);
    const eventBroker = useContext(EventBrokerContext);
    const [, rerender] = useReducer((x: number) => x + 1, 0);
    const requestData = useCallback(() => {
        isLoading = true;

        getProductNotesMeta(config)
            .then((productNoteMeta) => {
                isLoading = false;
                error = undefined;
                eventBroker.broadcast(ProductNotesEvents.UPDATE, productNoteMeta);
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
            eventBroker.on(ProductNotesEvents.UPDATE, (_, productNoteMeta) => {
                value = productNoteMeta;
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
