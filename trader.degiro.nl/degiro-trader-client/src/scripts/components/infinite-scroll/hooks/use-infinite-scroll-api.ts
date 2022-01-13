import * as React from 'react';
import replaceItemAtIndex from 'frontend-core/dist/utils/collection/replace-item-at-index';

export interface FrameState {
    status: 'not-reached' | 'loading' | 'ready' | 'cleared';
    height?: number;
}

export interface InfiniteScrollApi {
    frames: FrameState[];
    observe: (element: HTMLElement | null) => void;
    setFrameReady: (index: number) => void;
    stopAutoloadNextFrame: () => void;
}

const {useState, useMemo, useCallback, useEffect} = React;

export default function useInfiniteScrollApi(
    scrollContainerDOMElement: HTMLElement,
    initialFrames: FrameState[] = [{status: 'not-reached'}]
): InfiniteScrollApi {
    const [frames, setFrames] = useState<FrameState[]>(window.history.state?.frames || initialFrames);
    const [isAutoLoadNextFrameEnabled, setAutoloadNextFrameFlag] = useState<boolean>(false);
    const intersectionObserver = useMemo(
        () =>
            new IntersectionObserver(
                (entries) => {
                    setFrames((frames) =>
                        entries.reduce((frames, entry) => {
                            const index = Number((entry.target as HTMLElement).dataset.frameIndex);
                            const prevFrame = frames[index];

                            if (entry.isIntersecting) {
                                return replaceItemAtIndex(frames, index, {...prevFrame, status: 'loading'});
                            }

                            if (!entry.isIntersecting && frames[index].status !== 'not-reached') {
                                return replaceItemAtIndex(frames, index, {
                                    ...prevFrame,
                                    status: 'cleared',
                                    height: entry.target.getBoundingClientRect().height
                                });
                            }
                            return frames;
                        }, frames)
                    );
                },
                {
                    root: scrollContainerDOMElement,
                    rootMargin: '300px 0px 300px 0px',
                    threshold: 0
                }
            ),
        [scrollContainerDOMElement]
    );
    const observeFrame = useCallback(
        (element: HTMLElement | null) => {
            if (element) {
                intersectionObserver.observe(element);
            }
        },
        [intersectionObserver]
    );
    const setReadyStatus = useCallback(
        (index: number) => {
            if (frames[index].status !== 'ready') {
                return setFrames((frames) => replaceItemAtIndex(frames, index, {status: 'ready'}));
            }
        },
        [frames]
    );
    const stopAutoLoadNextFrame = useCallback(() => setAutoloadNextFrameFlag(true), []);

    useEffect(() => {
        if (!isAutoLoadNextFrameEnabled && frames[frames.length - 1].status === 'ready') {
            setFrames([...frames, {status: 'not-reached'}]);
        }
    }, [isAutoLoadNextFrameEnabled, frames]);

    useEffect(() => () => intersectionObserver.disconnect(), [intersectionObserver]);

    return useMemo(
        () => ({
            frames,
            observe: observeFrame,
            setFrameReady: setReadyStatus,
            stopAutoloadNextFrame: stopAutoLoadNextFrame
        }),
        [frames, observeFrame, setReadyStatus, stopAutoLoadNextFrame]
    );
}
