import * as React from 'react';
import {ProductInfo} from 'frontend-core/dist/models/product';
import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {AppApiContext} from '../app-component/app-context';
import {selectableButtonWithBackdrop} from '../button/button.css';
import {icon, productNoteHint} from '../data-table/products-table/products-table.css';
import ProductNoteText from '../product-note/product-note-text';
import ProductNoteIcon from '../product-notes/product-note-icon';
import Hint from '../hint';

const ProductNotes = createLazyComponent(() => import(/* webpackChunkName: "product-notes" */ '../product-notes'));

interface Props {
    productInfo: ProductInfo;
}

const {useContext, useCallback, memo} = React;
const ProductNoteHint = memo<Props>(({productInfo}) => {
    const {openSideInformationPanel} = useContext(AppApiContext);
    const openProductNotesPanelButton = useCallback(
        () =>
            productInfo &&
            openSideInformationPanel({
                content: <ProductNotes productInfo={productInfo} />
            }),
        [openSideInformationPanel, productInfo]
    );

    return (
        <Hint
            className={selectableButtonWithBackdrop}
            onClick={openProductNotesPanelButton}
            content={
                <div className={productNoteHint}>
                    <ProductNoteText productInfo={productInfo} />
                </div>
            }>
            <ProductNoteIcon className={icon} active={true} />
        </Hint>
    );
});

ProductNoteHint.displayName = 'ProductNoteHint';
export default ProductNoteHint;
