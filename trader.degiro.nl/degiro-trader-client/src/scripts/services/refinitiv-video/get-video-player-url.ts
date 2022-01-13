import isInternalEnv, {InternalEnvironments} from 'frontend-core/dist/platform/is-internal-env';
import buildUrlPath from 'frontend-core/dist/utils/url/build-url-path';
import {AuthConfig, ClipInfo, PlayerOptions} from '../../models/refinitiv-video';

const defaultOptions: Partial<PlayerOptions> = {
    autoplay: false,
    showQuality: true,
    showFullScreen: true
};

export default function getVideoPlayerUrl(clipInfo: ClipInfo, authConfig: AuthConfig, options?: PlayerOptions): string {
    const {mediaType = 'mid'} = options || {};
    const origin: string = isInternalEnv(InternalEnvironments.INTERNAL_TEST)
        ? 'https://embed.uat.newscasts.refinitiv.com'
        : 'https://embed.newscasts.refinitiv.com';

    return `${origin}/kwf/widget/caas${buildUrlPath({
        [mediaType]: clipInfo.id,
        mediaType,
        instanceid: authConfig.instanceId,
        theme: 'DeGiro',
        ...defaultOptions,
        ...options
    })}`;
}
