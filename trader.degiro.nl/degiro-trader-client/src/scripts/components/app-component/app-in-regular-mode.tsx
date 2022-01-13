import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import isWebViewApp from 'frontend-core/dist/platform/is-web-view-app';
import {getItem, setItem} from 'frontend-core/dist/platform/localstorage';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import * as React from 'react';
import {useLocation} from 'react-router-dom';
import '../../../styles/index.css';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import {informationPanelSideLayout, xMediumViewportMinWidth} from '../../media-queries';
import isInboxLinkActive from '../../services/router/is-inbox-link-active';
import DataVendors from '../about-app/data-vendors';
import FeedbackButton from '../feedback/button';
import GlobalInAppNotifications from '../global-in-app-notifications';
import HeaderNavigationButton from '../header/compact-header/header-navigation-button';
import Modal, {ModalApi, ModalProps} from '../modal';
import {DrawerApi} from '../navigation/drawer-navigation/drawer';
import OrderFormsController from '../order/order-forms-controller';
import ProductTourLoader from '../product-tour/loader';
import Spinner, {SpinnerModes} from '../progress-bar/spinner';
import {
    compactHeaderPlaceholder,
    dataVendors,
    footer,
    fullHeaderPlaceholder,
    globalFeedbackButton
} from './app-component.css';
import {
    AppApiContext,
    ConfigContext,
    CurrentClientContext,
    EventBrokerContext,
    I18nContext,
    MainClientContext
} from './app-context';
import AppRouting from './app-routing';
import useAppProtectedMode from './hooks/use-app-protected-mode';
import useI18n from './hooks/use-i18n';
import useMainModels from './hooks/use-main-models';
import {sideInformationPanelLayoutMap, SideInformationPanelLayouts} from './index';
import {closedPanelLayout} from './side-information-panel/side-information-panel.css';
import AppLayout from './app-layout';

const BottomNavigation = createLazyComponent(
    () => import(/* webpackChunkName: "bottom-navigation" */ '../navigation/bottom-navigation')
);
const CompactHeader = createLazyComponent(
    () => import(/* webpackChunkName: "compact-header" */ '../header/compact-header')
);
const Feedback = createLazyComponent(() => import(/* webpackChunkName: "feedback" */ '../feedback'));
const FullHeader = createLazyComponent(() => import(/* webpackChunkName: "full-header" */ '../header/full-header'));
const DrawerNavigation = createLazyComponent(
    () => import(/* webpackChunkName: "drawer-navigation" */ '../navigation/drawer-navigation')
);
const SideNavigation = createLazyComponent(
    () => import(/* webpackChunkName: "side-navigation" */ '../navigation/side-navigation')
);

interface AppComponentApi {
    openDrawer: DrawerApi['open'];
    openModal: ModalApi['open'];
    closeModal: ModalApi['close'];
    openSideInformationPanel(props: SideInformationPanelProps): void;
    closeSideInformationPanel(): void;
}

interface SideInformationPanelProps {
    content: React.ReactNode | React.ReactNode[];
    layout?: SideInformationPanelLayouts;
}

const {useRef, useState, useEffect, useCallback, memo} = React;
const AppInRegularMode = memo(() => {
    const location = useLocation();
    const [sideInformationPanelProps, setSideInformationPanelProps] = useState<SideInformationPanelProps>({
        content: undefined
    });
    const modalApiRef = useRef<ModalApi | null>(null);
    const drawerApiRef = useRef<DrawerApi | null>(null);
    const appApiRef = useRef<AppComponentApi>({
        openSideInformationPanel: setSideInformationPanelProps,
        closeSideInformationPanel: () => setSideInformationPanelProps({content: undefined}),
        openModal: (props: ModalProps) => modalApiRef.current?.open(props),
        closeModal: () => modalApiRef.current?.close(),
        openDrawer: () => drawerApiRef.current?.open()
    });
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const hasInformationPanelSideLayout: boolean = useMediaQuery(informationPanelSideLayout);
    const hasXMediumViewportLayout: boolean = useMediaQuery(xMediumViewportMinWidth);
    const {isLoading, eventBroker, config, mainClient, currentClient, displayLanguage} = useMainModels();
    const sessionId: string | undefined = config?.sessionId;
    const {i18n} = useI18n(config, mainClient?.culture, displayLanguage);
    const sideInformationPanelLayout =
        sideInformationPanelProps.layout ||
        (hasXMediumViewportLayout
            ? SideInformationPanelLayouts.STATIC_PANEL
            : hasInformationPanelSideLayout
            ? SideInformationPanelLayouts.FLOAT_PANEL
            : SideInformationPanelLayouts.FULL_PAGE);
    const onDrawerApi = useCallback((drawerApi: DrawerApi) => (drawerApiRef.current = drawerApi), []);
    const onModalApi = useCallback((modalApi: ModalApi) => (modalApiRef.current = modalApi), []);

    useEffect(() => {
        if (config && mainClient && currentClient) {
            trackAnalytics.init(mainClient, currentClient);
        }
    }, [mainClient?.id, currentClient]);

    useEffect(() => {
        if (mainClient?.id) {
            trackAnalytics(TrackerEventTypes.LOGIN, {
                location: isWebViewApp()
                    ? 'App'
                    : window.location.pathname.includes('/mobile')
                    ? 'Mobile'
                    : 'WebTrader',
                userId: String(mainClient.id)
            });
        }
    }, [mainClient?.id]);

    useEffect(() => {
        trackAnalytics(TrackerEventTypes.VIRTUAL_PAGEVIEW, {page: `${location.pathname}${location.search}`});
    }, [location.pathname, location.search]);

    useEffect(() => {
        // track this event only per session
        if (sessionId && sessionId !== getItem('sessionId')) {
            trackAnalytics(TrackerEventTypes.FIRST_TRADER_PAGE_LOAD_AFTER_LOGIN, {
                page: `${location.pathname}${location.search}`
            });
            setItem('sessionId', sessionId);
        }
    }, [sessionId]);

    useEffect(() => {
        if (
            // close only full page layout on location change
            sideInformationPanelLayout === SideInformationPanelLayouts.FULL_PAGE
        ) {
            appApiRef.current.closeSideInformationPanel();
        }
    }, [location.pathname, location.search]);

    useAppProtectedMode();

    if (isLoading || !config || config.intAccount == null || !i18n || !currentClient || !mainClient) {
        return <Spinner mode={SpinnerModes.GLOBAL} />;
    }

    const {current: appApi} = appApiRef;

    return (
        <AppApiContext.Provider value={appApi}>
            <EventBrokerContext.Provider value={eventBroker}>
                <ConfigContext.Provider value={config}>
                    <I18nContext.Provider value={i18n}>
                        <MainClientContext.Provider value={mainClient}>
                            <CurrentClientContext.Provider value={currentClient}>
                                <AppLayout
                                    navigation={
                                        hasGlobalFullLayout ? (
                                            <SideNavigation />
                                        ) : (
                                            <DrawerNavigation onApi={onDrawerApi} />
                                        )
                                    }
                                    bottomNavigation={!hasGlobalFullLayout && <BottomNavigation className={footer} />}
                                    header={
                                        hasGlobalFullLayout ? (
                                            <FullHeader fallback={<div className={fullHeaderPlaceholder} />} />
                                        ) : (
                                            <CompactHeader fallback={<div className={compactHeaderPlaceholder} />} />
                                        )
                                    }
                                    modal={<Modal onApi={onModalApi} />}
                                    miscellaneous={
                                        <>
                                            {hasGlobalFullLayout && <FeedbackButton className={globalFeedbackButton} />}
                                            <ProductTourLoader key="product-tour" compact={!hasGlobalFullLayout} />
                                            <OrderFormsController />
                                            <GlobalInAppNotifications />
                                            <Feedback />
                                        </>
                                    }
                                    sidebarPanel={
                                        <section
                                            key="sideInformationPanel"
                                            data-name="sideInformationPanel"
                                            className={
                                                sideInformationPanelProps.content
                                                    ? sideInformationPanelLayoutMap[sideInformationPanelLayout]
                                                    : closedPanelLayout
                                            }>
                                            {Boolean(sideInformationPanelProps.content) &&
                                                sideInformationPanelLayout ===
                                                    SideInformationPanelLayouts.FULL_PAGE && (
                                                    <HeaderNavigationButton
                                                        data-name="sideInformationPanelBackButton"
                                                        onClick={appApi.closeSideInformationPanel}
                                                    />
                                                )}
                                            {sideInformationPanelProps.content}
                                        </section>
                                    }>
                                    <AppRouting />
                                    {!isInboxLinkActive(location) && <DataVendors className={dataVendors} />}
                                </AppLayout>
                            </CurrentClientContext.Provider>
                        </MainClientContext.Provider>
                    </I18nContext.Provider>
                </ConfigContext.Provider>
            </EventBrokerContext.Provider>
        </AppApiContext.Provider>
    );
});

AppInRegularMode.displayName = 'AppInRegularMode';
export default AppInRegularMode;
