import * as React from 'react';
import {submenuItemHoverOverlay} from './submenu-panel.css';

interface Props {
    menuRef: React.RefObject<HTMLElement>;
    menuItemRef: React.RefObject<HTMLElement>;
}

type PlaceholderRect = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>;

const {useLayoutEffect, useState} = React;
const defaultPlaceholderRect: PlaceholderRect = {top: 0, left: 0, width: 0, height: 0};
const SubmenuItemHoverOverlay: React.FunctionComponent<Props> = ({menuRef, menuItemRef}) => {
    const [placeholderRect, setPlaceholderRect] = useState<PlaceholderRect>(defaultPlaceholderRect);
    const [placeholderPoints, setPlaceholderPoints] = useState<string | undefined>();

    useLayoutEffect(() => {
        const {current: menu} = menuRef;
        const {current: menuItem} = menuItemRef;

        if (!menu || !menuItem) {
            return;
        }

        const frameHandlerId = requestAnimationFrame(() => {
            const menuRect: DOMRect = menu.getBoundingClientRect();
            const menuItemRect: DOMRect = menuItem.getBoundingClientRect();
            const placeholderRect: PlaceholderRect = {
                top: Math.min(menuRect.top - menuItemRect.top, 0),
                left: 0,
                width: menuItemRect.width,
                height: menuRect.height
            };

            setPlaceholderRect(placeholderRect);
            setPlaceholderPoints(`
                ${Math.round(placeholderRect.width * 0.5)},${
                Math.abs(placeholderRect.top) + Math.round(menuItemRect.height * 0.5)
            }
                ${placeholderRect.width},${0}
                ${placeholderRect.width},${placeholderRect.height}
            `);
        });

        return () => cancelAnimationFrame(frameHandlerId);
    }, [menuRef, menuItemRef]);

    return (
        // eslint-disable-next-line react/forbid-dom-props
        <svg className={submenuItemHoverOverlay} style={placeholderRect} pointer-events="none">
            <polygon fill="transparent" pointer-events="auto" points={placeholderPoints} />
        </svg>
    );
};

export default React.memo(SubmenuItemHoverOverlay);
