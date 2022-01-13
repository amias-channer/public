import {Config} from 'frontend-core/dist/models/config';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {AuthConfig, ClipsListInfo} from '../../models/refinitiv-video';

export default function getLatestClips(config: Config, authConfig: AuthConfig): Promise<ClipsListInfo> {
    return requestToApi({
        config,
        url: `${config.refinitivClipsUrl}clips/latest?sessionToken=${authConfig.token}`
    });
}
