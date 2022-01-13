import * as React from 'react';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {InfiniteScrollApi} from './hooks/use-infinite-scroll-api';

const errorText = `You are trying to use InfiniteScrollContext without context provider. 
Please check InfiniteScrollContext.Provider`;
const InfiniteScrollContext = React.createContext<InfiniteScrollApi>({
    frames: [],
    observe: () => logErrorLocally(errorText),
    setFrameReady: (_index: number) => logErrorLocally(errorText),
    stopAutoloadNextFrame: () => logErrorLocally(errorText)
});

export default InfiniteScrollContext;
