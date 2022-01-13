import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppSettingsGroup} from 'frontend-core/dist/models/app-settings';
import getAppSettingsGroup from 'frontend-core/dist/services/app-settings/get-app-settings-group';
import setAppSettingsGroup from 'frontend-core/dist/services/app-settings/set-app-settings-group';
import * as React from 'react';
import {ProductTourEvents} from '../../event-broker/event-types';
import {ConfigContext, EventBrokerContext, MainClientContext} from '../app-component/app-context';

const ProductTour = createLazyComponent(() => import(/* webpackChunkName: "product-tour" */ './index'));

export type ProductTourSettings = Pick<AppSettingsGroup, 'hasSeenBetaSalutation' | 'hasSeenProductTour'>;

export interface ProductTourLoaderProps {
    compact: boolean;
}

const {useEffect, useState, useCallback, useMemo, useContext} = React;
const ProductTourLoader: React.FunctionComponent<ProductTourLoaderProps> = ({compact}) => {
    const config = useContext(ConfigContext);
    const eventBroker = useContext(EventBrokerContext);
    const mainClient = useContext(MainClientContext);
    const [settings, setSettings] = useState<ProductTourSettings>(getAppSettingsGroup(mainClient));
    // Do not show initial salutation if client settings were not loaded.
    // E.g. settings service went down and all users get product tour in the app
    const shouldShowInitialSalutation = useMemo<boolean>(
        () => (mainClient.settings ? !settings.hasSeenBetaSalutation || !settings.hasSeenProductTour : false),
        [settings, mainClient.settings]
    );
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const onSettingsChange = useCallback(
        (settingsPatch: Partial<ProductTourSettings>) => {
            const newSettings = {...settings, ...settingsPatch};

            setSettings(newSettings);
            setAppSettingsGroup(config, mainClient, newSettings).catch(logErrorLocally);
        },
        [settings, config, mainClient]
    );
    const onStart = useCallback(() => setIsStarted(true), []);
    const handleEnd = useCallback(() => setIsStarted(false), []);

    useEffect(() => eventBroker.on(ProductTourEvents.START, onStart), []);

    if (!isStarted && !shouldShowInitialSalutation) {
        return null;
    }

    return (
        <ProductTour
            compact={compact}
            isStarted={isStarted}
            settings={settings}
            onStart={onStart}
            onEnd={handleEnd}
            onSettingsChange={onSettingsChange}
        />
    );
};

export default React.memo(ProductTourLoader);
