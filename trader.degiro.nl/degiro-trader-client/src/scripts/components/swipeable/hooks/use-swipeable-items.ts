import {useCallback, useEffect, useState} from 'react';
import {SwipePosition} from '../../swipeable';

export type SwipeableItemId = number | string;
export type OnSwipeHandler = (id: SwipeableItemId, position: SwipePosition) => void;
export interface SwipeableItem {
    id: SwipeableItemId;
    position: SwipePosition;
}

const scrollEventListenerOptions: AddEventListenerOptions = {once: true, passive: true};

export default function useSwipeableItems(
    scrollContainerElement: HTMLElement
): {
    onItemSwipe: OnSwipeHandler;
    getItemSwipePosition: (id: SwipeableItemId) => SwipePosition;
    undoItemSwipe: () => void;
} {
    const [swipedItem, setSwipedItem] = useState<SwipeableItem>();
    const onItemSwipe = useCallback<OnSwipeHandler>((id, position) => setSwipedItem({id, position}), []);
    const undoItemSwipe = useCallback(() => setSwipedItem(undefined), []);
    const getItemSwipePosition = useCallback(
        (id: SwipeableItemId) => (swipedItem && String(swipedItem.id) === String(id) ? swipedItem.position : null),
        [swipedItem]
    );
    const hasSwipedItem = Boolean(swipedItem?.position);

    useEffect(() => {
        // Undo item swipes on container scroll
        if (hasSwipedItem) {
            scrollContainerElement.addEventListener('scroll', undoItemSwipe, scrollEventListenerOptions);
            return () =>
                scrollContainerElement.removeEventListener('scroll', undoItemSwipe, scrollEventListenerOptions);
        }
    }, [scrollContainerElement, hasSwipedItem, undoItemSwipe]);

    return {onItemSwipe, getItemSwipePosition, undoItemSwipe};
}
