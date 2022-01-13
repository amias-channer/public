import {AppError} from 'frontend-core/dist/models/app-error';
import {Config} from 'frontend-core/dist/models/config';
import {I18n, I18nModules} from 'frontend-core/dist/models/i18n';
import getI18n from 'frontend-core/dist/services/i18n/get-i18n';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import {useEffect, useState} from 'react';

export default function useI18n(
    config: Config | undefined,
    country: string | undefined,
    language: string | undefined
): {isLoading: boolean; i18n: I18n | undefined; error: Error | AppError | undefined} {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [i18n, setI18n] = useState<I18n | undefined>();
    const [error, setError] = useState<Error | AppError | undefined>();

    useEffect(() => {
        if (!config || !country || !language) {
            return;
        }

        setIsLoading(true);
        setError(undefined);

        const loadRequest = createCancellablePromise(
            getI18n(config, {
                language,
                country,
                modules: [I18nModules.COMMON, I18nModules.ORDER_ERRORS, I18nModules.TASK_MANAGER, I18nModules.TRADER]
            })
        );

        loadRequest.promise
            .then((i18n: I18n) => {
                document.documentElement.lang = language;
                setI18n(i18n);
            })
            .catch(setError)
            .finally(() => setIsLoading(false));

        return loadRequest.cancel;
    }, [country, language]);

    return {isLoading, i18n, error};
}
