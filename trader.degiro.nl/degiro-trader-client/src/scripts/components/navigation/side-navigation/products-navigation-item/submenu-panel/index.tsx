import useToggle from 'frontend-core/dist/hooks/use-toggle';
import addEventListenersOutside from 'frontend-core/dist/utils/events/add-event-listeners-outside';
import * as React from 'react';
import useMenuKeyboardClose from '../../../../menu/hooks/use-menu-keyboard-close';
import {submenuPanel} from './submenu-panel.css';

interface SubmenuPanelApi {
    open(): void;
    close(): void;
}

interface SubmenuPanelChildrenProps extends SubmenuPanelApi {
    isOpened: boolean;
}

export interface SubmenuPanelProps {
    renderTarget(props: SubmenuPanelChildrenProps): React.ReactElement;
    children(props: SubmenuPanelChildrenProps): React.ReactElement;
}

const {useEffect, useRef} = React;
const SubmenuPanel: React.FunctionComponent<SubmenuPanelProps> = ({renderTarget, children}) => {
    const rootElementRef = useRef<HTMLDivElement>(null);
    const {isOpened, open, close} = useToggle(false);
    const childrenProps: SubmenuPanelChildrenProps = {isOpened, open, close};

    useMenuKeyboardClose(rootElementRef, isOpened, close);

    useEffect(() => {
        const {current: rootElement} = rootElementRef;

        if (!isOpened || !rootElement) {
            return;
        }

        return addEventListenersOutside([rootElement], 'focus', close, {capture: true});
    }, [isOpened, close]);

    return (
        <div ref={rootElementRef} onMouseLeave={close} onMouseOver={open}>
            {renderTarget(childrenProps)}
            {isOpened && <div className={submenuPanel}>{children(childrenProps)}</div>}
        </div>
    );
};

export default React.memo(SubmenuPanel);
