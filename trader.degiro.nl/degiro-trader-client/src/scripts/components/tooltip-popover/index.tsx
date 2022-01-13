import Popover, {PopoverProps} from 'frontend-core/dist/components/ui-trader4/popover';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import addEventListenersOutside from 'frontend-core/dist/utils/events/add-event-listeners-outside';
import * as React from 'react';
import {popup} from './tooltip-popover.css';

export const tooltipPopoverClassName = popup;

export type TooltipPopoverProps = React.PropsWithChildren<
    Pick<PopoverProps, 'verticalPosition' | 'horizontalPosition'> & {
        relatedRef: React.RefObject<HTMLElement>;
        onClose?: () => void;
        className?: string;
        innerPopupRefs?: (null | string | HTMLElement)[];
        height?: PopoverProps['height'];
    }
>;

const {useLayoutEffect, useRef, useMemo} = React;
const TooltipPopover: React.ForwardRefRenderFunction<HTMLDivElement, TooltipPopoverProps> = (
    {
        relatedRef,
        children,
        onClose,
        innerPopupRefs = [],
        // Transitive props
        verticalPosition,
        horizontalPosition,
        height
    },
    ref
) => {
    const globalPointerEventName: 'touchend' | 'mousedown' = useMemo(
        () => (isTouchDevice() ? 'touchend' : 'mousedown'),
        []
    );
    const defaultPopupRef = useRef<HTMLInputElement | null>(null);
    const popupRef = (ref as React.MutableRefObject<HTMLDivElement | null> | null) || defaultPopupRef;

    useLayoutEffect(() => {
        return addEventListenersOutside(
            [relatedRef.current, popupRef.current, ...innerPopupRefs],
            globalPointerEventName,
            () => onClose?.(),
            {capture: false}
        );
    }, [globalPointerEventName, onClose, relatedRef, innerPopupRefs]);

    return (
        relatedRef.current && (
            <Popover
                relatedElement={relatedRef.current}
                verticalPosition={verticalPosition}
                horizontalPosition={horizontalPosition}
                height={height}>
                <div
                    data-test-key="popover-container"
                    ref={popupRef}
                    onClick={(event) => event.stopPropagation()}
                    className={tooltipPopoverClassName}>
                    {children}
                </div>
            </Popover>
        )
    );
};

export default React.memo(React.forwardRef(TooltipPopover));
