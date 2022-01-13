import {ProductId} from 'frontend-core/dist/models/product';
import {useMemo} from 'react';
import useProductNotesMeta from '../../../hooks/use-product-notes-meta';

/**
 * @param {ProductId | undefined} productId Product ID
 * @returns {boolean | undefined} `true` if product has notes, `false` if product does not have notes,
 *     `undefined` if product notes status is unknown (e.g. missing notes data)
 */
export default function useProductNotesFlag(productId: ProductId | undefined): boolean | undefined {
    const {value: productNotesMeta} = useProductNotesMeta();

    return useMemo(() => {
        if (productId == null) {
            return undefined;
        }

        return productNotesMeta?.notedProductsIds.includes(String(productId));
    }, [productNotesMeta, productId]);
}
