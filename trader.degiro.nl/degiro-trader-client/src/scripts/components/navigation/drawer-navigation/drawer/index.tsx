import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import deactivateActiveElement from 'frontend-core/dist/platform/deactivate-active-element';
import localize from 'frontend-core/dist/services/i18n/localize';
import useDeviceBackButton from 'frontend-core/dist/hooks/use-device-back-button';
import * as React from 'react';
import {I18nContext} from '../../../app-component/app-context';
import {drawer, layout, openedLayout, toolbar} from './drawer.css';

export interface DrawerApi {
    open(): void;
    close(): void;
}

interface Props {
    children: (api: DrawerApi) => void;
}

const {useCallback, useRef, useContext, useState} = React;
const Drawer: React.FunctionComponent<Props> = ({children}) => {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const i18n = useContext(I18nContext);
    const rootRef = useRef<HTMLDivElement>(null);
    const open = useCallback(() => {
        setIsOpened(true);
        rootRef.current?.classList.add(openedLayout);
        deactivateActiveElement();
    }, []);
    const close = useCallback(() => {
        setIsOpened(false);
        rootRef.current?.classList.remove(openedLayout);
    }, []);

    useDeviceBackButton(isOpened ? close : undefined);

    return (
        <div ref={rootRef} data-name="drawerNavigation" className={layout} onClick={close}>
            <aside className={drawer}>
                <div className={toolbar}>
                    <button type="button" data-name="closeButton" aria-label={localize(i18n, 'modals.closeTitle')}>
                        <Icon type="arrow_back" />
                    </button>
                </div>
                {children({open, close})}
            </aside>
        </div>
    );
};

export default React.memo(Drawer);
