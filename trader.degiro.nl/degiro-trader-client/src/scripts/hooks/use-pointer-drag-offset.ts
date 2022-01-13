import {RefObject, useEffect, useRef} from 'react';
import useCommittedRef from 'frontend-core/dist/hooks/use-committed-ref';

const pointerEventListenerOptions: AddEventListenerOptions = {passive: true};
const clickEventListenerOptions: AddEventListenerOptions = {capture: true};
const identity = <T>(value: T): T => value;

export default function usePointerDragOffset<T extends HTMLElement>(
    ref: RefObject<T> | null,
    onStart: () => void,
    onMove: (offset: number) => void,
    onEnd: (offset: number) => void,
    offsetMapper: (offset: number) => number = identity
) {
    const startPointRef = useRef(0);
    const offsetRef = useRef(0);
    // Store passed callback references into refs to reduce effect dependencies,
    // thus avoiding adding/removing event listeners due to dependency changes.
    // https://github.com/facebook/react/issues/16091
    const onStartRef = useCommittedRef(onStart);
    const onMoveRef = useCommittedRef(onMove);
    const onEndRef = useCommittedRef(onEnd);
    const offsetMapperRef = useCommittedRef(offsetMapper);

    useEffect(() => {
        const element = ref?.current;

        if (!element) {
            return;
        }

        // Use a context object to avoid `no-use-before-define` errors due to cross-references
        // between event listeners and drag setup/teardown methods.
        const context = {
            onClick(event: MouseEvent) {
                if (offsetRef.current !== 0) {
                    // Prevent `click` events following `pointerup` if offset is not zero,
                    // avoiding dispatching clicks to elements that were just dragged and dropped.
                    // This also effectively makes the element unclickable during a swipe.
                    // https://github.com/jquery-archive/PEP/issues/276#issuecomment-203990412
                    event.preventDefault();
                    event.stopPropagation();

                    // Blur currently focused element (if any) to avoid jumping back to it,
                    // e.g. search input field in touch devices.
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }
                }
            },

            onPointerDown(event: PointerEvent) {
                // Prevent compatibility mouse events when pointer is down
                // https://developer.mozilla.org/docs/Web/API/Pointer_events#compatibility_with_mouse_events
                event.preventDefault();

                const {clientX} = event;

                startPointRef.current = clientX;
                offsetRef.current = 0;

                onStartRef.current();

                context.addDragListeners();
            },

            onPointerMove({clientX}: PointerEvent) {
                const offset = offsetMapperRef.current(clientX - startPointRef.current);

                // Ignore if offset remains unchanged (e.g. clamped out-of-bounds)
                if (offset === offsetRef.current) {
                    return;
                }

                offsetRef.current = offset;

                onMoveRef.current(offset);
            },

            onPointerUp({clientX}: PointerEvent) {
                const offset = offsetMapperRef.current(clientX - startPointRef.current);

                startPointRef.current = 0;
                offsetRef.current = offset;

                onEndRef.current(offset);

                context.removeDragListeners();
            },

            onPointerCancel() {
                startPointRef.current = 0;

                onEndRef.current(offsetRef.current);

                context.removeDragListeners();
            },

            addDragListeners() {
                document.addEventListener('pointermove', context.onPointerMove, pointerEventListenerOptions);
                document.addEventListener('pointerup', context.onPointerUp, pointerEventListenerOptions);
                document.addEventListener('pointercancel', context.onPointerCancel, pointerEventListenerOptions);
            },

            removeDragListeners() {
                document.removeEventListener('pointermove', context.onPointerMove, pointerEventListenerOptions);
                document.removeEventListener('pointerup', context.onPointerUp, pointerEventListenerOptions);
                document.removeEventListener('pointercancel', context.onPointerCancel, pointerEventListenerOptions);
            }
        };

        element.addEventListener('click', context.onClick, clickEventListenerOptions);
        element.addEventListener('pointerdown', context.onPointerDown);

        return () => {
            element.removeEventListener('click', context.onClick, clickEventListenerOptions);
            element.removeEventListener('pointerdown', context.onPointerDown);
            context.removeDragListeners();
        };
    }, [ref]);
}
