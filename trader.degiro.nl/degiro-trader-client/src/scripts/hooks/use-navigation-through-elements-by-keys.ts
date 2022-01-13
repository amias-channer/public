import {addDocumentKeydownStackableEventListener} from 'frontend-core/dist/utils/events/add-stackable-event-listener';
import {useLayoutEffect} from 'react';
import isNull from 'frontend-core/dist/utils/is-null';
import useLatest from 'frontend-core/dist/hooks/use-latest';

const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];

export default function useNavigationThroughElementsByKeys(
    containerRef: React.RefObject<HTMLElement>,
    callback: (element: HTMLElement) => void = (element) => element.focus(),
    primaryElementsSelector: string = '[tabindex="1"]',
    allNavigationElementsSelector: string = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
): void {
    const callbackRef = useLatest(callback);
    const primaryElementsSelectorRef = useLatest(primaryElementsSelector);
    const allNavigationElementsSelectorRef = useLatest(allNavigationElementsSelector);

    useLayoutEffect(() => {
        return addDocumentKeydownStackableEventListener(
            (event) => {
                if (isNull(containerRef.current)) {
                    return;
                }

                const {key} = event;
                const allNavigationElements: HTMLElement[] = Array.from(
                    containerRef.current.querySelectorAll<HTMLElement>(allNavigationElementsSelectorRef.current)
                );
                const focusedIndex = allNavigationElements.findIndex((el) => el === document.activeElement);
                let nextFocusElement;

                if (key === 'ArrowDown') {
                    nextFocusElement = allNavigationElements
                        .slice(focusedIndex + 1)
                        .find((el) => el.matches(primaryElementsSelectorRef.current));
                }

                if (key === 'ArrowUp') {
                    nextFocusElement = allNavigationElements
                        .slice(0, focusedIndex)
                        .reverse()
                        .find((el) => el.matches(primaryElementsSelectorRef.current));
                }

                if (key === 'ArrowRight') {
                    nextFocusElement = allNavigationElements[focusedIndex + 1];
                }

                if (key === 'ArrowLeft') {
                    nextFocusElement = allNavigationElements[focusedIndex - 1];
                }

                if (nextFocusElement) {
                    callbackRef.current?.(nextFocusElement);
                }
                event.preventDefault();
            },
            ({key}) =>
                navigationKeys.includes(key) &&
                !isNull(containerRef.current) &&
                containerRef.current.contains(document.activeElement)
        );
    }, []);
}
