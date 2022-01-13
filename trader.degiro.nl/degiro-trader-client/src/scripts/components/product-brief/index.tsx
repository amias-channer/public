import areComponentChildrenEmpty from 'frontend-core/dist/components/ui-common/component/are-component-children-empty';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {Exchange} from 'frontend-core/dist/models/exchange';
import {ProductInfo} from 'frontend-core/dist/models/product';
import getExchange from 'frontend-core/dist/services/exchange/get-exchange';
import * as React from 'react';
import {ConfigContext, CurrentClientContext} from '../app-component/app-context';
import {valuesDelimiter} from '../value';
import {content} from './product-brief.css';
import SearchHighlight from '../search-highlight';

function addInfoSection(sections: React.ReactNode[], sectionOrSections: React.ReactNode | React.ReactNode[]) {
    if (sections.length) {
        sections.push(valuesDelimiter);
    }

    if (Array.isArray(sectionOrSections)) {
        (sectionOrSections as React.ReactNode[]).forEach((node, index, nodes) => {
            sections.push(node);

            if (nodes[index + 1]) {
                sections.push(valuesDelimiter);
            }
        });
    } else {
        sections.push(sectionOrSections);
    }
}

export type ProductBriefField = 'exchangeAbbr' | 'symbol' | 'isin' | 'currency' | 'exchangeName';

type Props = React.PropsWithChildren<{
    productInfo: ProductInfo;
    className?: string;
    fields?: ProductBriefField[];
}>;

const {useContext, memo} = React;
const defaultFields: ProductBriefField[] = ['exchangeAbbr', 'symbol', 'isin', 'currency'];
const ProductBrief = memo<Props>(({productInfo, children, className = '', fields = defaultFields}) => {
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const {isin, id: productId, exchangeId, exchange: productExchange, symbol: productSymbol} = productInfo;
    // Use ISIN as default symbol value (already happens at API level with certain products)
    const symbol = productSymbol || isin;
    const {value: exchange} = useAsync<Exchange | undefined>(() => {
        return productExchange
            ? Promise.resolve(productExchange)
            : getExchange(config, currentClient, {id: exchangeId});
    }, [exchangeId, productExchange]);
    const canShowSymbol: boolean = Boolean(symbol && fields.includes('symbol'));
    const sections: React.ReactNode[] = fields.reduce((sections: React.ReactNode[], field: string) => {
        switch (field) {
            case 'exchangeAbbr':
                if (exchange?.hiqAbbr) {
                    addInfoSection(sections, <SearchHighlight>{exchange.hiqAbbr}</SearchHighlight>);
                }
                break;
            case 'exchangeName':
                if (exchange?.name) {
                    addInfoSection(sections, <SearchHighlight>{exchange.name}</SearchHighlight>);
                }
                break;
            case 'symbol':
                if (canShowSymbol) {
                    addInfoSection(sections, <SearchHighlight>{String(symbol)}</SearchHighlight>);
                }
                break;
            case 'isin':
                if (isin && (isin !== symbol || !canShowSymbol)) {
                    addInfoSection(sections, <SearchHighlight>{isin}</SearchHighlight>);
                }
                break;
            case 'currency':
                addInfoSection(sections, productInfo.currency);
                break;
            default:
            //
        }

        return sections;
    }, []);

    if (!areComponentChildrenEmpty(children)) {
        addInfoSection(sections, children);
    }

    return (
        <span className={`${content} ${className}`} data-id={productId} data-name="productBriefInfo">
            {sections}
        </span>
    );
});

ProductBrief.displayName = 'ProductBrief';
export default ProductBrief;
