import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import * as React from 'react';
import useProductNotesMeta from '../../hooks/use-product-notes-meta';
import getProductNotes from '../../services/product-notes/get-product-notes';
import {AppApiContext, ConfigContext, I18nContext} from '../app-component/app-context';
import Card from '../card';
import CardHeader from '../card/header';
import {allNotesButton, allNotesButtonPlaceholder, loading, noNotes, note as noteClassName} from './product-note.css';
import {actionLink} from '../../../styles/link.css';

const ProductNotes = createLazyComponent(
    () => import(/* webpackChunkName: "product-notes" */ '../product-notes/index')
);

interface Props {
    productInfo: ProductInfo;
}

const {useContext, useMemo} = React;
const ProductNote: React.FunctionComponent<Props> = ({productInfo}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const {openSideInformationPanel, openModal} = useContext(AppApiContext);
    const {
        isLoading: productNotesMetaIsLoading,
        value: productNotesMeta,
        error: productNotesMetaError
    } = useProductNotesMeta();
    const productId = useMemo(() => String(productInfo.id), [productInfo]);
    const {isLoading: isNotesLoading, value: notes, error: isNotesError} = useAsyncWithProgressiveState(() => {
        const isNoteForProduct = productNotesMeta?.notedProductsIds.includes(productId);

        if (!isNoteForProduct) {
            return Promise.resolve(undefined);
        }

        return getProductNotes(config, productId);
    }, [productNotesMeta]);
    const isLoading = useMemo(
        () => (productNotesMetaIsLoading && productNotesMeta === undefined) || (isNotesLoading && notes === undefined),
        [productNotesMetaIsLoading, productNotesMeta, isNotesLoading]
    );
    const notesCount: number = notes?.length ?? 0;

    if (productNotesMetaError || isNotesError) {
        logErrorLocally(productNotesMetaError || isNotesError);
        openModal({error: productNotesMetaError || isNotesError});
    }

    return (
        <Card
            header={<CardHeader title={localize(i18n, 'trader.productActions.notes')} />}
            footer={
                isLoading ? (
                    <span className={allNotesButtonPlaceholder} />
                ) : (
                    <button
                        type="button"
                        data-test-key="open-product-notes-panel"
                        className={`${actionLink} ${allNotesButtonPlaceholder} ${allNotesButton}`}
                        onClick={() => openSideInformationPanel({content: <ProductNotes productInfo={productInfo} />})}>
                        {notesCount
                            ? `${localize(i18n, 'trader.productNotes.viewAllNotes')} (${notesCount})`
                            : localize(i18n, 'trader.productNotes.addNote')}
                        <Icon type="keyboard_arrow_right" />
                    </button>
                )
            }>
            <span
                className={`
                    ${noteClassName} 
                    ${isLoading ? loading : ''}
                    ${!isLoading && !isNonEmptyArray(notes) ? noNotes : ''}
                `}>
                {isLoading && localize(i18n, 'trader.productNotes.loading')}
                {!isLoading && !isNonEmptyArray(notes) && localize(i18n, 'trader.productNotes.noNotesYet')}
                {!isLoading && isNonEmptyArray(notes) && notes[0].text}
            </span>
        </Card>
    );
};

export default React.memo(ProductNote);
