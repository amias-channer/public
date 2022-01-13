import * as React from 'react';
import {ProductInfo} from 'frontend-core/dist/models/product';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import localize from 'frontend-core/dist/services/i18n/localize';
import useProductNotesMeta from '../../hooks/use-product-notes-meta';
import {ConfigContext, I18nContext} from '../app-component/app-context';
import getProductNotes from '../../services/product-notes/get-product-notes';

interface Props {
    productInfo: ProductInfo;
}

const {useContext, useMemo} = React;
const ProductNoteText: React.FunctionComponent<Props> = ({productInfo}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const {isLoading: productNotesMetaIsLoading, value: productNotesMeta} = useProductNotesMeta();
    const {isLoading: isNotesLoading, value: notes} = useAsyncWithProgressiveState(() => {
        const isNoteForProduct = productNotesMeta?.notedProductsIds.includes(String(productInfo.id));

        if (!isNoteForProduct) {
            return Promise.resolve(undefined);
        }

        return getProductNotes(config, String(productInfo.id));
    }, [productNotesMeta]);
    const isLoading = useMemo(
        () => (productNotesMetaIsLoading && productNotesMeta === undefined) || (isNotesLoading && notes === undefined),
        [productNotesMetaIsLoading, productNotesMeta, isNotesLoading]
    );

    return (
        <>
            {isLoading && localize(i18n, 'trader.productNotes.loading')}
            {!isLoading && isNonEmptyArray(notes) && notes[0].text}
        </>
    );
};

ProductNoteText.displayName = 'ProductNoteText';
export default ProductNoteText;
