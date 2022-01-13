import buildUrlPath from 'frontend-core/dist/utils/url/build-url-path';
import {ClipInfo, ThumbnailResizeTypes} from '../../models/refinitiv-video';

/**
 * @description Clip thumbnail URL
 * @param {ClipInfo.id} clipId
 * @param {number} width – width in pixels
 * @param {number} height – height in pixels
 * @param {number} [quality] – JPEG quality. Default is 75
 * @param {ThumbnailResizeTypes} [resizeType]
 * @returns {string}
 */
export default function getClipThumbnailUrl(
    clipId: ClipInfo['id'],
    width: number,
    height: number,
    quality: number = 75,
    resizeType?: ThumbnailResizeTypes
): string {
    return `https://www.kaltura.com/p/1851201/thumbnail/${buildUrlPath({
        // eslint-disable-next-line camelcase
        entry_id: clipId,
        width,
        height,
        quality,
        type: resizeType
    })}`;
}
