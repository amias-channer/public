import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from 'frontend-core/dist/models/config';
import {ProductNotesMeta} from '../../models/product-note';

export default function getProductNotesMeta(config: Config): Promise<ProductNotesMeta> {
    return requestToApi<ProductNotesMeta>({
        config,
        url: `${config.productNotesUrl}notes/meta`
    });
}
