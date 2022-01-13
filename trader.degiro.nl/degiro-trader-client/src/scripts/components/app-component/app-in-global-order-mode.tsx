import * as React from 'react';
import '../../../styles/index.css';
import GlobalInAppNotifications from '../global-in-app-notifications';
import Modal, {ModalApi, ModalProps} from '../modal';
import OrderFormsController from '../order/order-forms-controller';
import Spinner, {SpinnerModes} from '../progress-bar/spinner';
import * as classNames from './app-component.css';
import {
    AppApiContext,
    ConfigContext,
    CurrentClientContext,
    EventBrokerContext,
    I18nContext,
    MainClientContext
} from './app-context';
import {appWorkspaceElementId} from './get-app-workspace';
import useAppProtectedMode from './hooks/use-app-protected-mode';
import useI18n from './hooks/use-i18n';
import useMainModels from './hooks/use-main-models';
import {
    AppComponentApi,
    sideInformationPanelLayoutMap,
    SideInformationPanelLayouts,
    SideInformationPanelProps
} from './index';
import {closedPanelLayout} from './side-information-panel/side-information-panel.css';

const {useRef, useState, useCallback} = React;
const AppInGlobalOrderMode: React.FunctionComponent = () => {
    const [sideInformationPanelProps, setSideInformationPanelProps] = useState<SideInformationPanelProps>({
        content: undefined
    });
    const modalApiRef = useRef<ModalApi | null>(null);
    const onModalApi = useCallback((modalApi: ModalApi) => (modalApiRef.current = modalApi), []);
    const appApiRef = useRef<AppComponentApi>({
        openSideInformationPanel: setSideInformationPanelProps,
        closeSideInformationPanel: () => setSideInformationPanelProps({content: undefined}),
        openModal: (props: ModalProps) => modalApiRef.current?.open(props),
        closeModal: () => modalApiRef.current?.close(),
        openDrawer: () => null
    });
    const {isLoading, eventBroker, config, mainClient, currentClient, displayLanguage} = useMainModels();
    const {i18n} = useI18n(config, mainClient?.culture, displayLanguage);
    const sideInformationPanelLayout = sideInformationPanelProps.layout || SideInformationPanelLayouts.FULL_PAGE;

    useAppProtectedMode();

    if (isLoading || !config || config.intAccount == null || !i18n || !currentClient || !mainClient) {
        return <Spinner mode={SpinnerModes.GLOBAL} />;
    }

    return (
        <AppApiContext.Provider value={appApiRef.current}>
            <EventBrokerContext.Provider value={eventBroker}>
                <ConfigContext.Provider value={config}>
                    <I18nContext.Provider value={i18n}>
                        <MainClientContext.Provider value={mainClient}>
                            <CurrentClientContext.Provider value={currentClient}>
                                <div className={classNames.layout}>
                                    <div className={classNames.workspace} id={appWorkspaceElementId}>
                                        <div className={classNames.mainContentWrapper}>
                                            <section
                                                key="sideInformationPanel"
                                                data-name="sideInformationPanel"
                                                className={
                                                    sideInformationPanelLayoutMap[sideInformationPanelLayout] ||
                                                    closedPanelLayout
                                                }>
                                                {sideInformationPanelProps.content}
                                            </section>
                                        </div>
                                    </div>
                                    <Modal onApi={onModalApi} />
                                    <OrderFormsController />
                                    <GlobalInAppNotifications />
                                </div>
                            </CurrentClientContext.Provider>
                        </MainClientContext.Provider>
                    </I18nContext.Provider>
                </ConfigContext.Provider>
            </EventBrokerContext.Provider>
        </AppApiContext.Provider>
    );
};

export default React.memo(AppInGlobalOrderMode);
