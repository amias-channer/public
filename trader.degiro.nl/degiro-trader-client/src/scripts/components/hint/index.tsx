import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import Popover, {PopoverProps} from 'frontend-core/dist/components/ui-trader4/popover';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import addEventListenersOutside from 'frontend-core/dist/utils/events/add-event-listeners-outside';
import throttle, {ThrottleWithNoReturn} from 'frontend-core/dist/utils/throttle';
import * as React from 'react';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import ExternalHtmlContent from '../external-html-content/index';
import {
    closeButton,
    closeButtonIcon,
    content as contentClassName,
    contentWithExtraPadding,
    icon,
    layout,
    layoutWithDefaultIcon,
    popup
} from './hint.css';

type Props = Pick<PopoverProps, 'verticalPosition' | 'horizontalPosition'> &
    React.PropsWithChildren<{
        hoverTriggerDisabled?: boolean;
        content?: string | React.ReactNode | React.ReactNode[];
        popupClassName?: string;
        className?: string;
        onClick?: React.MouseEventHandler<HTMLElement>;
        'data-name'?: string;
        'aria-label'?: string;
        hasCloseButton?: boolean;
        delay?: number;
    }>;

const {useRef, useEffect, useMemo, memo} = React;
const Hint = memo<Props>(
    ({
        className = '',
        popupClassName = '',
        children,
        content,
        hoverTriggerDisabled,
        verticalPosition,
        horizontalPosition,
        onClick,
        hasCloseButton = false,
        delay = 100,
        ...nativeProps
    }) => {
        const globalPointerEventName: 'touchend' | 'mousedown' = useMemo(
            () => (isTouchDevice() ? 'touchend' : 'mousedown'),
            []
        );
        const isHoverTriggerSupported: boolean = useMemo(() => !isTouchDevice(), []);
        const toggle = useToggle();
        const isTriggerOnHover = isHoverTriggerSupported && !hoverTriggerDisabled;
        const rootRef = useRef<HTMLButtonElement>(null);
        const popupRef = useRef<HTMLDivElement>(null);
        const mouseLeaveHandler = useMemo<undefined | ThrottleWithNoReturn<() => void>>(
            () => (isTriggerOnHover ? throttle(toggle.close, delay, false) : undefined),
            [isTriggerOnHover]
        );
        const mouseOverHandler = useMemo<undefined | ThrottleWithNoReturn<() => void>>(
            () => (isTriggerOnHover ? throttle(toggle.open, delay, false) : undefined),
            [isTriggerOnHover]
        );

        useEffect(() => {
            if (toggle.isOpened) {
                return addEventListenersOutside(
                    [rootRef.current, popupRef.current],
                    globalPointerEventName,
                    toggle.close,
                    {
                        capture: false
                    }
                );
            }
        }, [toggle.isOpened]);

        return (
            <button
                aria-label={nativeProps['aria-label'] || 'Hint'}
                data-test-key="trigger-button"
                data-name={nativeProps['data-name'] || 'tooltipButton'}
                type="button"
                ref={rootRef}
                className={`
                    ${layout} 
                    ${children ? '' : layoutWithDefaultIcon} 
                    ${className}
                `}
                onBlur={toggle.close}
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                    toggle.toggle();
                    onClick?.(event);
                }}
                onMouseLeave={() => {
                    mouseOverHandler?.cancel();
                    mouseLeaveHandler?.();
                }}
                onMouseOver={() => {
                    mouseLeaveHandler?.cancel();
                    mouseOverHandler?.();
                }}>
                {children || <Icon className={icon} hintIcon={true} />}
                {toggle.isOpened && rootRef.current && (
                    <Popover
                        relatedElement={rootRef.current}
                        verticalPosition={verticalPosition}
                        horizontalPosition={horizontalPosition}>
                        <div
                            data-test-key="popover-container"
                            ref={popupRef}
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                // prevent closing by inner clicks (e.g. by button or dropdown)
                                event.stopPropagation();
                            }}
                            onMouseLeave={() => {
                                mouseOverHandler?.cancel();
                                mouseLeaveHandler?.();
                            }}
                            onMouseOver={() => {
                                mouseLeaveHandler?.cancel();
                                mouseOverHandler?.();
                            }}
                            className={`${popup} ${popupClassName}`}>
                            {hasCloseButton ? (
                                <button type="button" className={closeButton} onClick={toggle.close}>
                                    <Icon className={closeButtonIcon} type="close" />
                                </button>
                            ) : null}
                            <div
                                className={`
                                    ${contentClassName} 
                                    ${isHoverTriggerSupported ? '' : contentWithExtraPadding}
                                `}>
                                {typeof content === 'string' ? (
                                    <ExternalHtmlContent>{content}</ExternalHtmlContent>
                                ) : (
                                    content
                                )}
                            </div>
                        </div>
                    </Popover>
                )}
            </button>
        );
    }
);

Hint.displayName = 'Hint';
export default Hint;
