import {ProductInfo} from 'frontend-core/dist/models/product';
import getQuotecastRequestProductInfo from 'frontend-core/dist/services/quotecast/get-quotecast-request-product-info';
import * as React from 'react';
import {QuotecastEvents} from '../../event-broker/event-types';
import {QuotecastUpdate, QuotecastUpdateEvent} from '../../event-broker/resources/quotecast';
import getProductExternalName from '../../services/product/get-product-external-name';
import getProductName from '../../services/product/get-product-name';
import {EventBrokerContext, MainClientContext} from '../app-component/app-context';
import SearchHighlight from '../search-highlight';

export interface ProductNameProps {
    productInfo: ProductInfo;
    subscribeToExternalName?: boolean;
    className?: string;
}

const {useState, useEffect, useContext} = React;
const ProductName: React.FunctionComponent<ProductNameProps> = ({
    productInfo,
    subscribeToExternalName,
    className,
    children
}) => {
    const mainClient = useContext(MainClientContext);
    const eventBroker = useContext(EventBrokerContext);
    const productId: string = String(productInfo.id);
    const [productName, setProductName] = useState<string>(() => getProductName(mainClient, productInfo));

    useEffect(() => {
        setProductName(getProductName(mainClient, productInfo));

        /*
         * TODO: REMOVE whole logic for external (VWD) names about implementation of "neat names" [WEB-568]
         * - So components may have already a valid names (positions in portfolio have names from VWD),
         *   so we don't need them again. It also improve a performance of VWD subscriptions [WF-822]
         * - We can have already the external product name
         */
        if (subscribeToExternalName && !getProductExternalName(mainClient, productInfo)) {
            const unsubscribe = eventBroker.on(
                QuotecastEvents.CHANGE,
                {products: [getQuotecastRequestProductInfo(productInfo)], fields: ['FullName']},
                (_event: QuotecastUpdateEvent, update: QuotecastUpdate) => {
                    // check if it's not a response from previous subscription for another product
                    if (String(productInfo.vwdId) !== String(update.vwdId)) {
                        return;
                    }

                    // unsubscribe after first update, .once() is not supported for ProductsEvents
                    unsubscribe();
                    // update `productInfo` because `getProductName` takes the data from this object
                    productInfo.FullName = update.values.FullName;
                    setProductName(getProductName(mainClient, productInfo));
                }
            );

            return unsubscribe;
        }
    }, [subscribeToExternalName, productId]);

    return (
        <span data-id={productId} data-name="productName" className={className} title={productName}>
            <SearchHighlight>{productName}</SearchHighlight>
            {children}
        </span>
    );
};

export default React.memo(ProductName);
