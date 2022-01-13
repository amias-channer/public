import * as React from 'react';
import usePointerDragOffset from '../../hooks/use-pointer-drag-offset';
import {
    root,
    container,
    content,
    repositioningContent,
    actions,
    leadingActions as leadingActionsClassName,
    trailingActions as trailingActionsClassName
} from './swipeable.css';

export type SwipeDirection = 'forwards' | 'backwards';
export type SwipePosition = SwipeDirection | null;
export type SwipeableProps = React.PropsWithChildren<{
    className?: string;
    leadingActions?: React.ReactNode;
    trailingActions?: React.ReactNode;
    onSwipe?: (position: SwipePosition) => void;
    position?: SwipePosition;
}>;

const {memo, useEffect, useRef} = React;
const Swipeable: React.FunctionComponent<SwipeableProps> = ({
    className = '',
    leadingActions,
    trailingActions,
    onSwipe,
    position = null,
    ...domProps
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const leadingRef = useRef<HTMLDivElement>(null);
    const trailingRef = useRef<HTMLDivElement>(null);
    const leadingWidthRef = useRef(0);
    const trailingWidthRef = useRef(0);
    const positionRef = useRef<SwipePosition>(null);
    const hasLeadingActions = leadingActions != null;
    const hasTrailingActions = trailingActions != null;
    const getContentOffset = (position: SwipePosition) =>
        (position === 'forwards' ? leadingWidthRef.current : position === 'backwards' ? -trailingWidthRef.current : 0);
    const translateContainer = (offset: number, withTransition = false) => {
        const {current: contentEl} = containerRef;

        // Translate content to new position, with conditional transition
        if (contentEl) {
            contentEl.classList.toggle(repositioningContent, withTransition);
            contentEl.style.transform = `translateX(${offset}px)`;
        }
    };
    const onDragStart = () => {
        const {current: contentEl} = contentRef;
        const {current: leadingEl} = leadingRef;
        const {current: trailingEl} = trailingRef;

        // Calculate leading actions bounds on first drag
        if (leadingEl && leadingWidthRef.current === 0) {
            leadingWidthRef.current = leadingEl.getBoundingClientRect().width;
        }

        // Calculate trailing actions bounds on first drag
        if (trailingEl && trailingWidthRef.current === 0) {
            trailingWidthRef.current = trailingEl.getBoundingClientRect().width;
        }

        // Disable transition during drag interaction
        contentEl?.classList.remove(repositioningContent);
    };
    const onDragMove = (offset: number) => translateContainer(offset);
    const onDragEnd = (offset: number) => {
        // Accept swipe if drag reveals at least half the actions
        const isForwarding = offset > leadingWidthRef.current / 2;
        const isBackwarding = offset < -trailingWidthRef.current / 2;
        const newPosition = isForwarding ? 'forwards' : isBackwarding ? 'backwards' : null;

        // Animate content to new position (or return to previous one if swipe is denied)
        translateContainer(getContentOffset(newPosition), true);

        // Update internal position if changed and communicate to parent
        if (newPosition !== positionRef.current) {
            positionRef.current = newPosition;
            onSwipe?.(newPosition);
        }
    };
    const mapDragOffset = (offset: number) =>
        // Limit drag offset to leading/trailing actions bounds, and round the number to avoid subpixel transforms
        Math.round(
            Math.min(
                Math.max(getContentOffset(positionRef.current) + offset, -trailingWidthRef.current),
                leadingWidthRef.current
            )
        );

    useEffect(() => {
        // Ignore incoming position change if already in position
        if (position === positionRef.current) {
            return;
        }

        // Animate content to new position and update internal position
        translateContainer(getContentOffset(position), true);
        positionRef.current = position;
    }, [position]);

    usePointerDragOffset(
        leadingActions || trailingActions ? contentRef : null,
        onDragStart,
        onDragMove,
        onDragEnd,
        mapDragOffset
    );

    return (
        <div className={`${root} ${className}`}>
            <div ref={containerRef} className={container}>
                {hasLeadingActions && (
                    <div ref={leadingRef} className={`${actions} ${leadingActionsClassName}`}>
                        {leadingActions}
                    </div>
                )}
                <div ref={contentRef} className={content} {...domProps} />
                {hasTrailingActions && (
                    <div ref={trailingRef} className={`${actions} ${trailingActionsClassName}`}>
                        {trailingActions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(Swipeable);
