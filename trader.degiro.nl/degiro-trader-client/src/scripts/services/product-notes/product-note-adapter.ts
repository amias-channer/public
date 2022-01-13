import {ProductNote, ProductNoteResponse} from '../../models/product-note';

export default function productNoteAdapter({stampCreated, stampModified, ...data}: ProductNoteResponse): ProductNote {
    return {
        ...data,
        stampCreated: new Date(stampCreated),
        stampModified: new Date(stampModified)
    };
}
