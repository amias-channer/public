import * as React from 'react';
import TooltipPopover, {TooltipPopoverProps} from '../tooltip-popover';
import useMenuKeyboardClose from './hooks/use-menu-keyboard-close';
import useMenuKeyboardNavigation from './hooks/use-menu-keyboard-navigation';

export type MenuProps = React.PropsWithChildren<
    Pick<TooltipPopoverProps, 'horizontalPosition' | 'verticalPosition'> & {
        isOpened: boolean;
        target: React.ReactElement;
        onClose?: () => void;
        innerPopupRefs?: (null | string | HTMLElement)[];
        targetWrapperClassName?: string;
        height?: TooltipPopoverProps['height'];
    }
>;

const {useRef, useLayoutEffect, useReducer} = React;
const Menu: React.FunctionComponent<MenuProps> = ({
    isOpened,
    target,
    children,
    onClose,
    innerPopupRefs,
    targetWrapperClassName = '',
    horizontalPosition,
    verticalPosition,
    height
}) => {
    const targetRef = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useMenuKeyboardNavigation(popupRef, isOpened);
    useMenuKeyboardClose(targetRef, isOpened, onClose);

    useLayoutEffect(() => {
        if (isOpened) {
            forceUpdate();
        }
    }, [isOpened]);

    return (
        <>
            <span className={targetWrapperClassName} ref={targetRef}>
                {target}
            </span>
            {isOpened && targetRef.current && (
                <TooltipPopover
                    height={height}
                    horizontalPosition={horizontalPosition}
                    verticalPosition={verticalPosition}
                    innerPopupRefs={innerPopupRefs}
                    ref={popupRef}
                    relatedRef={targetRef}
                    onClose={onClose}>
                    {children}
                </TooltipPopover>
            )}
        </>
    );
};

export default React.memo(Menu);
