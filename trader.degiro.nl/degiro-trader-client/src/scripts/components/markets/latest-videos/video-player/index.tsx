import useElementSize, {ElementSize} from 'frontend-core/dist/hooks/use-element-size';
import * as React from 'react';
import {AuthConfig, ClipInfo, PlayerFeatures} from '../../../../models/refinitiv-video';
import getVideoPlayerUrl from '../../../../services/refinitiv-video/get-video-player-url';
import {player} from './video-player.css';

declare module 'react' {
    interface IframeHTMLAttributes<T> extends React.HTMLAttributes<T> {
        importance?: 'low' | 'high' | 'auto';
    }
}

interface Props extends Pick<React.IframeHTMLAttributes<HTMLIFrameElement>, 'importance' | 'loading' | 'title'> {
    clipInfo: ClipInfo;
    authConfig: AuthConfig;
    autoplay?: boolean;
    defaultHeight?: number;
    isPaused?: boolean;
}

const {useRef, useEffect} = React;
const RefinitivVideoPlayer: React.FunctionComponent<Props> = ({
    clipInfo,
    authConfig,
    autoplay,
    defaultHeight,
    isPaused,
    ...domProps
}) => {
    const frameRef = useRef<HTMLIFrameElement | null>(null);
    const frameSize: ElementSize | undefined = useElementSize(frameRef);
    const reversedAspectRatio: number = 9 / 16;
    const playerUrl: string = getVideoPlayerUrl(clipInfo, authConfig, {autoplay, features: PlayerFeatures.NO_HEADER});

    useEffect(() => {
        if (isPaused) {
            const {origin: playerOrigin} = new URL(playerUrl, location.href);
            const pauseCommand = {context: 'player.js', method: 'pause'};

            // reverse-engineered SDK https://toolkit.insider.refinitiv.com/trtoolkit/sdk/#ui/methods
            frameRef.current?.contentWindow?.postMessage(JSON.stringify(pauseCommand), playerOrigin);
        }
    }, [isPaused]);

    return (
        <iframe
            ref={frameRef}
            height={frameSize ? Math.round(frameSize.width * reversedAspectRatio) : defaultHeight}
            allow={`fullscreen 'src'; allow-scripts 'src'; ${autoplay ? "autoplay 'src';" : ''}`}
            allowFullScreen={true}
            className={player}
            {...domProps}
            src={playerUrl}
        />
    );
};

export default React.memo(RefinitivVideoPlayer);
