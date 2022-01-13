import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastField} from 'frontend-core/dist/models/quotecast';
import getQuotecastRequestProductInfo from 'frontend-core/dist/services/quotecast/get-quotecast-request-product-info';
import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {QuotecastEvents} from '../event-broker/event-types';
import {QuotecastUpdate, QuotecastUpdateEvent} from '../event-broker/resources/quotecast';

type Values = QuotecastUpdate['values'];

const defaultFields: [QuotecastField, ...QuotecastField[]] = [
    'CurrentPrice',
    'CurrentClosePrice',
    'AbsoluteDifference',
    'RelativeDifference'
];

/**
 * @param {ProductInfo | undefined} productInfo – allow productInfo to be undefined to use this hook with conditions
 * @param {[QuotecastDataField, ...QuotecastDataField[]]} fields
 * @returns {Readonly<Values>}
 */
export default function useProductUpdates(
    productInfo: ProductInfo | undefined,
    fields: [QuotecastField, ...QuotecastField[]] = defaultFields
): Readonly<Values> {
    const eventBroker = useContext(EventBrokerContext);
    const [values, setValues] = useState<Values>({});
    // convert id to the string to not react to the change of id from number to string,
    // e.g. from 1234 to '1234' because it's the same product
    const productId: string | undefined = productInfo ? String(productInfo.id) : undefined;

    useEffect(() => {
        if (productId === undefined || productInfo === undefined) {
            return setValues({});
        }

        setValues(Object.fromEntries(fields.map((field: QuotecastField) => [field, productInfo[field]])));

        const onProductUpdate = (_event: QuotecastUpdateEvent, update: QuotecastUpdate) => {
            // we need to mutate a product to keep it updated, e.g. for sorting in tables
            Object.assign(productInfo, update.values);
            setValues((values) => ({...values, ...update.values}));
        };

        return eventBroker.on(
            QuotecastEvents.CHANGE,
            {products: [getQuotecastRequestProductInfo(productInfo)], fields},
            onProductUpdate
        );
    }, [productId]);

    return values;
}
