import {useRef, useLayoutEffect, useEffect} from 'react';
import {addDocumentKeydownStackableEventListener} from 'frontend-core/dist/utils/events/add-stackable-event-listener';
import addEventListener from 'frontend-core/dist/utils/events/add-event-listener';
import useLatest from 'frontend-core/dist/hooks/use-latest';

export default function useJumpFromOneSectionToAnotherByPressingKey(
    fromRef: React.RefObject<HTMLElement>,
    toRef: React.RefObject<HTMLElement>,
    params: Partial<{
        keysToWatch: KeyboardEvent['key'][];
        targetSelector: string;
    }> = {},
    callback: (element: HTMLElement) => void = (element) => element.focus()
) {
    const {keysToWatch = ['Escape'], targetSelector = '[tabindex = "1"]'} = params;
    const lastFocusedElementInTargetSection = useRef<HTMLElement | null>();
    const keysToWatchRef = useLatest(keysToWatch);
    const targetSelectorRef = useLatest(targetSelector);

    useEffect(() => {
        return addEventListener(
            document.body,
            'focus',
            ({relatedTarget}: FocusEvent) => {
                if (relatedTarget && toRef.current?.contains(relatedTarget as HTMLElement)) {
                    lastFocusedElementInTargetSection.current = relatedTarget as HTMLElement;
                }
            },
            {capture: true}
        );
    }, []);

    useLayoutEffect(
        () =>
            addDocumentKeydownStackableEventListener(
                () => {
                    const nextElement =
                        lastFocusedElementInTargetSection.current &&
                        document.body.contains(lastFocusedElementInTargetSection.current)
                            ? lastFocusedElementInTargetSection.current
                            : toRef.current?.querySelector<HTMLElement>(targetSelectorRef.current);

                    if (nextElement) {
                        callback(nextElement);
                    }
                },
                ({key}) =>
                    Boolean(fromRef.current?.contains(document.activeElement)) && keysToWatchRef.current.includes(key)
            ),
        []
    );
}
