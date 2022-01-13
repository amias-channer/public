import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from 'frontend-core/dist/models/config';

export default async function removeProductNote(config: Config, noteId: string): Promise<true> {
    await requestToApi({
        method: 'DELETE',
        config,
        url: `${config.productNotesUrl}notes/${noteId}`
    });
    return true;
}
