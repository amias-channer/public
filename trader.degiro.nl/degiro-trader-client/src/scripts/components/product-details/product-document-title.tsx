import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import {ProductInfo} from 'frontend-core/dist/models/product';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import formatNumber, {NumberFormattingOptions} from 'frontend-core/dist/utils/number/format-number';
import * as React from 'react';
import {QuotecastUpdate} from '../../event-broker/resources/quotecast';
import useProductUpdates from '../../hooks/use-product-updates';
import {ConfigContext} from '../app-component/app-context';

interface Props {
    productInfo: ProductInfo;
}

const {useContext} = React;
const getSign = (value: number): string => (value > 0 ? '+' : '-');
const getTitleFromProductInfo = (
    productInfo: ProductInfo,
    values: QuotecastUpdate['values'],
    config: NumberFormattingOptions
): string => {
    const {name, currency} = productInfo;
    const price = values.CurrentPrice?.value;
    const absDiff = values.AbsoluteDifference?.value;
    const relDiff = values.RelativeDifference?.value;

    if (price == null || absDiff == null || relDiff == null) {
        return name;
    }

    const priceStr = `${getCurrencySymbol(currency)} ${formatNumber(price, {...config, preset: 'price'})}`;
    const absDiffStr = `${getSign(absDiff)}${formatNumber(Math.abs(absDiff), {...config, preset: 'amount'})}`;
    const relDiffStr = `${getSign(relDiff)}${formatNumber(Math.abs(relDiff), {...config, preset: 'percent'})}`;

    return `${name} – ${priceStr} | ${absDiffStr} (${relDiffStr}%)`;
};
const ProductDocumentTitle: React.FunctionComponent<Props> = ({productInfo}) => {
    const config = useContext(ConfigContext);
    const values: QuotecastUpdate['values'] = useProductUpdates(productInfo);

    useDocumentTitle(getTitleFromProductInfo(productInfo, values, config));

    return null;
};

export default React.memo(ProductDocumentTitle);
