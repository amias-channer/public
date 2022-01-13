export enum ThumbnailResizeTypes {
    FILLED_REMAINING_SPACE = 2,
    CROP_KEEP_ASPECT_RATIO = 3,
    CROP_KEEP_UPPER_PART = 4,
    RESIZE_KEEP_ASPECT_RATIO = 1
}

export enum PlayerLayouts {
    PLAYER = 'player',
    PLAYLIST = 'playlist',
    PLAYLIST_HORIZONTAL = 'playlist-horizontal'
}

export enum PlayerFeatures {
    ALL = 'all',
    NO_HEADER = 'noheader',
    NO_TOP_FEATURES = 'notopfeatures',
    NO_TRANSCRIPT = 'notranscript'
}

export interface ClipInfo {
    id: string;
    name: string;
    description: string;
    duration: number; // in seconds
    mediaType: number;
    startDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClipsListInfo {
    clips: ClipInfo[];
    total: number;
}

export interface PlayerOptions {
    mediaType?: 'mid' | 'cid';
    features?: PlayerFeatures;
    layout?: PlayerLayouts;
    autoplay?: boolean;
    showQuality?: boolean;
    showFullScreen?: boolean;
}

export interface AuthConfig {
    instanceId: string;
    token: string;
}
