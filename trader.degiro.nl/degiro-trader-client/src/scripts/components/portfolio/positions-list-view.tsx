import * as React from 'react';
import {Position} from 'frontend-core/dist/models/product';
import getAppTopScrollableElement from '../app-component/get-app-top-scrollable-element';
import InfiniteScroll from '../infinite-scroll';
import useSwipeableItems from '../swipeable/hooks/use-swipeable-items';
import {list, positionsList} from './portfolio.css';
import PositionCompactView, {ItemClickHandler} from './position-compact-view';
import {PositionTypeIds} from './position-types';

interface Props {
    arePositionValuesSwitched: boolean;
    onItemClick: ItemClickHandler;
    positions: Position[];
    positionTypeId: PositionTypeIds;
}
const {useCallback} = React;
const numberOfProductPositionsPerFrame = 10;
const PositionsListView = React.memo<Props>(({arePositionValuesSwitched, onItemClick, positions, positionTypeId}) => {
    const scrollContainerDOMElement = getAppTopScrollableElement();
    const {onItemSwipe, getItemSwipePosition, undoItemSwipe} = useSwipeableItems(scrollContainerDOMElement);
    const handleItemClick = useCallback<ItemClickHandler>(
        (position, event) => {
            undoItemSwipe();
            onItemClick(position, event);
        },
        [onItemClick, undoItemSwipe]
    );

    return (
        <div className={`${list} ${positionsList}`}>
            <InfiniteScroll scrollContainerDOMElement={scrollContainerDOMElement}>
                {(index, {setFrameReady, stopAutoloadNextFrame}) => {
                    if ((index + 1) * numberOfProductPositionsPerFrame >= positions.length) {
                        stopAutoloadNextFrame();
                    }
                    setFrameReady(index);

                    return positions
                        .slice(index * numberOfProductPositionsPerFrame, (index + 1) * numberOfProductPositionsPerFrame)
                        .map((position) => {
                            const {id: positionId} = position;

                            return (
                                <PositionCompactView
                                    key={positionId}
                                    arePositionValuesSwitched={arePositionValuesSwitched}
                                    onAction={undoItemSwipe}
                                    onClick={handleItemClick}
                                    onSwipe={onItemSwipe}
                                    position={position}
                                    positionTypeId={positionTypeId}
                                    swipePosition={getItemSwipePosition(positionId)}
                                />
                            );
                        });
                }}
            </InfiniteScroll>
        </div>
    );
});

PositionsListView.displayName = 'PositionsListView';

export default PositionsListView;
