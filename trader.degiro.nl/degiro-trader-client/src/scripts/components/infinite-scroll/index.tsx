import * as React from 'react';
import useInfiniteScrollApi, {InfiniteScrollApi} from './hooks/use-infinite-scroll-api';
import InfiniteScrollContext from './infinite-scroll-context';
import {frame} from './infinite-scroll.css';

interface Props {
    children: (frameNumber: number, api: InfiniteScrollApi) => React.ReactNode;
    scrollContainerDOMElement: HTMLElement;
}

const InfiniteScroll = React.memo<Props>(({children, scrollContainerDOMElement}) => {
    const infiniteScrollApi = useInfiniteScrollApi(scrollContainerDOMElement);
    const {frames, observe} = infiniteScrollApi;

    return (
        <InfiniteScrollContext.Provider value={infiniteScrollApi}>
            {frames.map(({status, height}, index) => (
                <div
                    className={frame}
                    key={index}
                    data-frame-index={index}
                    // eslint-disable-next-line react/forbid-dom-props
                    style={status === 'ready' ? undefined : {height}}
                    ref={observe}>
                    {status === 'loading' || status === 'ready' ? children(index, infiniteScrollApi) : null}
                </div>
            ))}
        </InfiniteScrollContext.Provider>
    );
});

InfiniteScroll.displayName = 'InfiniteScroll';

export default InfiniteScroll;
