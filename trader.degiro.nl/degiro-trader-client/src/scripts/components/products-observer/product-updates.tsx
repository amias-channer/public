import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import * as React from 'react';
import useProductUpdates from '../../hooks/use-product-updates';

export type ProductUpdatesChildrenRenderer = (values: ReturnType<typeof useProductUpdates>) => React.ReactElement;
interface Props {
    productInfo: ProductInfo;
    fields?: [QuotecastField, ...QuotecastField[]];
    children: ProductUpdatesChildrenRenderer;
}

const ProductUpdates: React.FunctionComponent<Props> = ({productInfo, fields, children}) => {
    const values = useProductUpdates(productInfo, fields);

    return children(values);
};

export default React.memo(ProductUpdates);
