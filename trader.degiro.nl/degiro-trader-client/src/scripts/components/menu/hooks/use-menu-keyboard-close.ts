import {addDocumentKeydownStackableEventListener} from 'frontend-core/dist/utils/events/add-stackable-event-listener';
import {RefObject, useLayoutEffect} from 'react';
import {focusableElementsQuerySelector} from './use-menu-keyboard-navigation';

export default function useMenuKeyboardClose(
    targetRef: RefObject<HTMLElement>,
    isOpened: boolean,
    onClose: undefined | (() => void)
) {
    useLayoutEffect(() => {
        if (isOpened) {
            return addDocumentKeydownStackableEventListener(
                () => {
                    targetRef.current?.querySelector<HTMLElement>(focusableElementsQuerySelector)?.focus();
                    onClose?.();
                },
                ({key}) => key === 'Escape' || key === 'Tab'
            );
        }
    }, [isOpened, onClose]);
}
