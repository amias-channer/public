import {addDocumentKeydownStackableEventListener} from 'frontend-core/dist/utils/events/add-stackable-event-listener';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import {RefObject, useLayoutEffect} from 'react';

export const focusableElementsQuerySelector = [
    'a[href]',
    'button:enabled',
    'input:enabled',
    'select:enabled',
    'textarea:enabled',
    '[tabindex]:not([tabindex="-1"])'
].join(', ');

export default function useMenuKeyboardNavigation(containerRef: RefObject<HTMLElement>, isActive: boolean) {
    useLayoutEffect(() => {
        const {current: container} = containerRef;

        if (isActive && container) {
            return addDocumentKeydownStackableEventListener(
                (event) => {
                    stopEvent(event);

                    const {key} = event;
                    const isNavigatingForward = key === 'ArrowRight' || key === 'ArrowDown';
                    const navigationDirection = isNavigatingForward ? 1 : -1;
                    const allFocusableElements = Array.from(
                        container.querySelectorAll<HTMLElement>(focusableElementsQuerySelector)
                    );
                    const focusedElementIndex = allFocusableElements.findIndex((el) => el === document.activeElement);
                    const hasFocusedElement = focusedElementIndex !== -1;
                    const elementCount = allFocusableElements.length;
                    const elementIndex = isNavigatingForward || hasFocusedElement ? focusedElementIndex : elementCount;

                    allFocusableElements[(elementIndex + navigationDirection + elementCount) % elementCount]?.focus();
                },
                ({key}) => key === 'ArrowRight' || key === 'ArrowDown' || key === 'ArrowUp' || key === 'ArrowLeft'
            );
        }
    }, [isActive, containerRef]);
}
