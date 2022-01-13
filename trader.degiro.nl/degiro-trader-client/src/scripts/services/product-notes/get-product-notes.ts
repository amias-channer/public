import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from 'frontend-core/dist/models/config';
import {ProductNote, ProductNoteResponse} from '../../models/product-note';
import productNoteAdapter from './product-note-adapter';

export default async function getProductNotes(config: Config, productId: string): Promise<ProductNote[]> {
    const notes: ProductNoteResponse[] = await requestToApi<ProductNoteResponse[]>({
        config,
        url: `${config.productNotesUrl}notes?productId=${productId}`
    });

    return notes.map(productNoteAdapter);
}
