import * as React from 'react';
import {SelectApi} from '../select';

export default function useSelectInputKeyBindings<T extends any = any>(options: T[], _value: T) {
    return ({select, isOpened, toggle, activateItem, activeItemIndex}: SelectApi) => (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        const {key} = event;

        if (
            key === 'ArrowUp' || // Prevent cursor move inside input element
            key === 'ArrowDown' ||
            key === 'Enter' // Prevent form submit
        ) {
            event.preventDefault();
        }

        if ((key === 'ArrowUp' || key === 'ArrowDown' || key === 'Enter') && !isOpened) {
            return toggle();
        }

        switch (key) {
            case 'Escape': {
                if (isOpened) {
                    event.stopPropagation();
                    toggle();
                }
                return;
            }
            case 'ArrowDown': {
                return activateItem((activeItemIndex + 1) % options.length);
            }
            case 'ArrowUp': {
                return activateItem(activeItemIndex - 1 < 0 ? options.length - 1 : activeItemIndex - 1);
            }
            case 'Enter': {
                return select(options[activeItemIndex]);
            }
        }
    };
}
