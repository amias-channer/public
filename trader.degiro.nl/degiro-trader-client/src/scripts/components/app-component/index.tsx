import * as React from 'react';
import useGlobalOrderModeFlag from '../../hooks/use-global-order-mode-flag';
import {ModalApi} from '../modal';
import {DrawerApi} from '../navigation/drawer-navigation/drawer';
import AppInGlobalOrderMode from './app-in-global-order-mode';
import AppInRegularMode from './app-in-regular-mode';
import {
    floatPanelLayout,
    fullPagePanelLayout,
    staticPanelLayout
} from './side-information-panel/side-information-panel.css';

export interface SideInformationPanelProps {
    layout?: SideInformationPanelLayouts;
    content: React.ReactNode | React.ReactNode[];
}

export enum SideInformationPanelLayouts {
    FLOAT_PANEL = 'FLOAT_PANEL',
    FULL_PAGE = 'FULL_PAGE',
    STATIC_PANEL = 'STATIC_PANEL'
}

export interface AppComponentApi {
    openDrawer: DrawerApi['open'];
    openModal: ModalApi['open'];
    closeModal: ModalApi['close'];
    openSideInformationPanel(props: SideInformationPanelProps): void;
    closeSideInformationPanel(): void;
}

export const sideInformationPanelLayoutMap = {
    [SideInformationPanelLayouts.STATIC_PANEL]: staticPanelLayout,
    [SideInformationPanelLayouts.FLOAT_PANEL]: floatPanelLayout,
    [SideInformationPanelLayouts.FULL_PAGE]: fullPagePanelLayout
};

const App: React.FunctionComponent = () => (useGlobalOrderModeFlag() ? <AppInGlobalOrderMode /> : <AppInRegularMode />);

export default React.memo(App);
