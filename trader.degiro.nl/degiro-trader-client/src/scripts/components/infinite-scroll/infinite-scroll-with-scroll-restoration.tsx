import * as React from 'react';
import {useHistory} from 'react-router-dom';
import useInfiniteScrollApi, {InfiniteScrollApi} from './hooks/use-infinite-scroll-api';
import InfiniteScrollContext from './infinite-scroll-context';
import {frame} from './infinite-scroll.css';

interface Props {
    children: (frameNumber: number, api: InfiniteScrollApi) => React.ReactNode;
    scrollContainerDOMElement: HTMLElement;
}

const {useEffect} = React;
const InfiniteScrollWithScrollRestoration: React.FunctionComponent<Props> = ({
    children,
    scrollContainerDOMElement
}: Props): React.ReactElement => {
    const history = useHistory();
    const infiniteScrollApi = useInfiniteScrollApi(scrollContainerDOMElement, window.history?.state?.frames);
    const {frames, observe} = infiniteScrollApi;

    useEffect(() => {
        return history.block(() => {
            window.history.replaceState(
                {
                    frames: frames.map((state, index) => {
                        return state.status === 'ready'
                            ? {
                                  ...state,
                                  status: 'cleared',
                                  height: scrollContainerDOMElement
                                      .querySelector(`[data-frame-index="${index}"]`)
                                      ?.getBoundingClientRect().height
                              }
                            : state;
                    }),
                    scrollTop: scrollContainerDOMElement.scrollTop
                },
                '',
                window.location.href
            );
        });
    }, [frames]);
    useEffect(() => {
        scrollContainerDOMElement.scrollTop = window.history.state?.scrollTop;
    }, []);
    useEffect(() => {
        const clearHistoryState = () => window.history.replaceState(undefined, '', window.location.href);

        window.addEventListener('beforeunload', clearHistoryState);

        return () => window.removeEventListener('beforeunload', clearHistoryState);
    }, []);

    return (
        <InfiniteScrollContext.Provider value={infiniteScrollApi}>
            {frames.map(({status, height}, index) => (
                <div
                    className={frame}
                    key={index}
                    data-frame-index={index}
                    // eslint-disable-next-line react/forbid-dom-props
                    style={status !== 'ready' ? {height} : undefined}
                    ref={observe}>
                    {status === 'loading' || status === 'ready' ? children(index, infiniteScrollApi) : null}
                </div>
            ))}
        </InfiniteScrollContext.Provider>
    );
};

export default InfiniteScrollWithScrollRestoration;
