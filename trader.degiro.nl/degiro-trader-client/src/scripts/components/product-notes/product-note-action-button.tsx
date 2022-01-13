import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {ProductInfo} from 'frontend-core/dist/models/product';
import * as React from 'react';
import {AppApiContext} from '../app-component/app-context';
import useProductNotesFlag from './hooks/use-product-notes-flag';
import ProductNoteIcon from './product-note-icon';

const ProductNotes = createLazyComponent(() => import(/* webpackChunkName: "product-notes" */ './index'));

export type ProductNoteActionButtonChildrenRenderer = (hasNotes: boolean | undefined) => React.ReactNode;

export interface ProductNoteActionButtonProps extends React.ButtonHTMLAttributes<any> {
    className?: string;
    iconClassName?: string;
    productInfo: ProductInfo;
    children?: ProductNoteActionButtonChildrenRenderer;
}

const {memo, useContext} = React;
const ProductNoteActionButton = memo<ProductNoteActionButtonProps>(
    ({className, iconClassName, productInfo, children, onClick, ...buttonNativeProps}) => {
        const hasNotes = useProductNotesFlag(productInfo.id);
        const {openSideInformationPanel} = useContext(AppApiContext);

        return (
            <button
                type="button"
                onClick={(event) => {
                    onClick?.(event);
                    openSideInformationPanel({content: <ProductNotes productInfo={productInfo} />});
                }}
                className={className}
                {...buttonNativeProps}>
                {children ? children(hasNotes) : <ProductNoteIcon active={hasNotes} className={iconClassName} />}
            </button>
        );
    }
);

ProductNoteActionButton.displayName = 'ProductNoteActionButton';
export default ProductNoteActionButton;
