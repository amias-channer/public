import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import localize from 'frontend-core/dist/services/i18n/localize';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import padNumber from 'frontend-core/dist/utils/number/pad-number';
import * as React from 'react';
import {AuthConfig, ClipInfo, ClipsListInfo} from '../../../models/refinitiv-video';
import getAuthConfig from '../../../services/refinitiv-video/get-auth-config';
import getClipThumbnailUrl from '../../../services/refinitiv-video/get-clip-thumbnail-url';
import getLatestClips from '../../../services/refinitiv-video/get-latest-clips';
import {AppApiContext, ConfigContext, I18nContext} from '../../app-component/app-context';
import Button, {ButtonVariants} from '../../button';
import CardHeader from '../../card/header';
import Card from '../../card';
import {ModalSizes} from '../../modal';
import DateValue from '../../value/date';
import {LayoutColumnsCount} from '../index';
import {
    clipItem,
    clipItemImg,
    clipItemImgLabel,
    clipItemImgLabelIcon,
    clipItemImgWrapper,
    clipItemSubTitle,
    clipItemTitle,
    clipModalButtons,
    clipModalContent,
    clipsList,
    clipsListSection,
    prevVideoButton,
    promoClipInfo,
    promoClipItem,
    twoColumnsClipsList
} from './latest-videos.css';
import RefinitivVideoPlayer from './video-player';

interface Props {
    layoutColumnsCount: LayoutColumnsCount;
}

const {useState, useEffect, useContext} = React;
const LatestVideos: React.FunctionComponent<Props> = ({layoutColumnsCount}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const app = useContext(AppApiContext);
    const [clipsListInfo, setClipsListInfo] = useState<ClipsListInfo | undefined>(undefined);
    const [authConfig, setAuthConfig] = useState<AuthConfig | undefined>(undefined);
    const [hasPlayingClipInModal, setPlayingClipInModalStatus] = useState<boolean>(false);
    const clips: ClipInfo[] = clipsListInfo?.clips || [];
    const [firstClip] = clips;
    const openClip = (index: number) => {
        const prevClipIndex: number = index - 1;
        const nextClipIndex: number = index + 1;
        const prevClipInfo: ClipInfo | undefined = clips[prevClipIndex];
        const clipInfo: ClipInfo = clips[index];
        const nextClipInfo: ClipInfo | undefined = clips[nextClipIndex];

        app.openModal({
            size: ModalSizes.MEDIUM,
            title: localize(i18n, 'trader.markets.latestVideos.clipInfo.title'),
            content: (
                <div className={clipModalContent}>
                    <RefinitivVideoPlayer
                        clipInfo={clipInfo}
                        authConfig={authConfig!}
                        autoplay={true}
                        defaultHeight={320}
                        title={clipInfo.name}
                    />
                    <h1 className={clipItemTitle}>{clipInfo.name}</h1>
                    <DateValue
                        className={clipItemSubTitle}
                        id={clipInfo.id}
                        field="startDate"
                        value={clipInfo.startDate}
                        format="DD/MM/YYYY HH:mm"
                        onlyTodayTime={true}
                    />
                    <div>{clipInfo.description}</div>
                </div>
            ),
            footer: (
                <div className={clipModalButtons}>
                    <button
                        className={prevVideoButton}
                        type="button"
                        data-name="prevClipButton"
                        disabled={!prevClipInfo}
                        onClick={openClip.bind(null, prevClipIndex)}>
                        {localize(i18n, 'trader.markets.latestVideos.playPrevious')}
                    </button>
                    <Button
                        type="button"
                        data-name="nextClip"
                        variant={ButtonVariants.ACCENT}
                        disabled={!nextClipInfo}
                        onClick={openClip.bind(null, nextClipIndex)}>
                        {localize(i18n, 'trader.markets.latestVideos.playNext')}
                    </Button>
                </div>
            ),
            onCancel: () => setPlayingClipInModalStatus(false)
        });
        setPlayingClipInModalStatus(true);
    };
    const renderClipsSubList = (start: number, end: number): React.ReactElement[] => {
        const imgWidth: number = 128;
        const devicePixelRatio: number = Math.max(window.devicePixelRatio, 1);
        const imgHeight: number = Math.round((imgWidth * 9) / 16);

        return clips.slice(start, end).map((clipInfo: ClipInfo, index: number) => {
            const {id, name, startDate, duration} = clipInfo;
            const durationRestSeconds: number = duration % 60;
            const durationFullMinutes: number = (duration - durationRestSeconds) / 60;

            return (
                <button key={id} type="button" className={clipItem} onClick={openClip.bind(null, index + start)}>
                    <div className={clipItemImgWrapper}>
                        <img
                            loading="lazy"
                            className={clipItemImg}
                            src={getClipThumbnailUrl(id, imgWidth * devicePixelRatio, imgHeight * devicePixelRatio)}
                            width={imgWidth}
                            height={imgHeight}
                            alt={name}
                        />
                        <span className={clipItemImgLabel}>
                            <Icon className={clipItemImgLabelIcon} type="play_circle" />
                            {padNumber(durationFullMinutes)}:{padNumber(durationRestSeconds)}
                        </span>
                    </div>
                    <div>
                        <h3 className={clipItemTitle}>{name}</h3>
                        <DateValue
                            className={clipItemSubTitle}
                            id={id}
                            field="startDate"
                            value={startDate}
                            format="DD/MM/YYYY HH:mm"
                            onlyTodayTime={true}
                        />
                    </div>
                </button>
            );
        });
    };

    useEffect(() => {
        const clipsInfoPromise = createCancellablePromise(
            getAuthConfig(config).then((authConfig: AuthConfig) => {
                setAuthConfig(authConfig);
                return getLatestClips(config, authConfig);
            })
        );

        clipsInfoPromise.promise.then(setClipsListInfo).catch(logErrorLocally);

        return clipsInfoPromise.cancel;
    }, []);

    if (!firstClip) {
        return null;
    }

    return (
        <Card
            innerHorizontalGap={layoutColumnsCount > 2}
            data-name="refinitivVideos"
            header={<CardHeader title={localize(i18n, 'trader.markets.latestVideos.title')} />}
            footer={true}>
            <div className={`${clipsList} ${layoutColumnsCount > 2 ? twoColumnsClipsList : ''}`}>
                <section className={clipsListSection}>
                    <div className={promoClipItem}>
                        <RefinitivVideoPlayer
                            clipInfo={firstClip}
                            authConfig={authConfig!}
                            importance="low"
                            loading="lazy"
                            isPaused={hasPlayingClipInModal}
                            title={firstClip.name}
                        />
                        <button className={promoClipInfo} type="button" onClick={openClip.bind(null, 0)}>
                            <h3 className={clipItemTitle}>{firstClip.name}</h3>
                            <DateValue
                                className={clipItemSubTitle}
                                id={firstClip.id}
                                field="startDate"
                                value={firstClip.startDate}
                                format="DD/MM/YYYY HH:mm"
                                onlyTodayTime={true}
                            />
                        </button>
                    </div>
                    {renderClipsSubList(1, 3)}
                </section>
                <section className={clipsListSection}>{renderClipsSubList(3, clips.length)}</section>
            </div>
        </Card>
    );
};

export default React.memo(LatestVideos);
