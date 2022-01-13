import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {AppApiContext} from '../../app-component/app-context';

interface State<M> {
    modules: M[];
    processModuleSwitch(switchedModule: M, switchPromise: Promise<any>): void;
}

export default function useSettingsModules<SettingsModule extends {id: string | number; inTransition?: boolean}>(
    getModules: () => Promise<SettingsModule[]>
): State<SettingsModule> {
    const app = useContext(AppApiContext);
    const checkingTimerRef = useRef<number | undefined>(undefined);
    const [modules, setModules] = useState<SettingsModule[]>([]);
    const stopCheckingUpdates = () => {
        clearTimeout(checkingTimerRef.current);
        checkingTimerRef.current = undefined;
    };
    const checkUpdates = () => {
        getModules()
            .then((modules: SettingsModule[]) => {
                setModules(modules);

                const isAnyInTransition: boolean = modules.some((storedModule) => storedModule.inTransition);

                if (isAnyInTransition) {
                    checkingTimerRef.current = window.setTimeout(checkUpdates, 2000);
                }
            })
            .catch(logErrorLocally);
    };
    const processModuleSwitch = useCallback(
        (switchedModule: SettingsModule, switchPromise: Promise<void>) => {
            stopCheckingUpdates();
            // set transition state for the module because BE doesn't have such state for some modules,
            // e.g. email notification
            const setTransition = (inTransition: boolean) => {
                setModules((modules: SettingsModule[]) => {
                    return modules.map((storedModule: SettingsModule) => {
                        return switchedModule.id === storedModule.id ? {...storedModule, inTransition} : storedModule;
                    });
                });
            };

            // start a transition
            setTransition(true);
            switchPromise.then(checkUpdates).catch((error: Error | AppError) => {
                // revert failed transition
                setTransition(false);
                logErrorLocally(error);
                app.openModal({error});
            });
        },
        [app]
    );

    useEffect(() => {
        const settingsPromise = createCancellablePromise(getModules());

        settingsPromise.promise.then(setModules).catch(logErrorLocally);

        return () => {
            settingsPromise.cancel();
            stopCheckingUpdates();
        };
    }, []);

    return {modules, processModuleSwitch};
}
