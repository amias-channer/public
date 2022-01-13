import * as React from 'react';

export const nonClickableAreaAttrs = Object.freeze({
    'data-ignore-area-event': 'click'
});

export function isNonClickableArea(event: React.MouseEvent<HTMLElement>): boolean {
    const {currentTarget: item} = event;
    let el: HTMLElement | null = event.target as HTMLElement;

    if (!item.contains(el)) {
        return true;
    }

    while (el && el !== item) {
        if (el.dataset && el.dataset.ignoreAreaEvent === 'click') {
            return true;
        }

        el = el.parentElement;
    }

    return false;
}
