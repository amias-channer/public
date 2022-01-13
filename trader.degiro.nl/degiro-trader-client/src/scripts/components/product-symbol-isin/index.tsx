import * as React from 'react';
import {valuesDelimiter, valuePlaceholder} from '../value';
import {layout} from './product-symbol-isin.css';
import SearchHighlight from '../search-highlight';

export interface Props {
    productInfo: {
        id: number | string;
        isin?: string;
        symbol?: string | number;
        [key: string]: any;
    };
    className?: string;
}

const ProductSymbolIsin: React.FunctionComponent<Props> = ({productInfo, className = ''}) => {
    const {id, symbol, isin} = productInfo;
    const hasSymbol: boolean = Boolean(symbol || symbol === 0);
    const hasIsin: boolean = Boolean(isin && isin !== symbol);

    return (
        <span data-id={id} data-name="symbolIsin" className={`${layout} ${className}`}>
            {hasSymbol && <SearchHighlight>{String(symbol)}</SearchHighlight>}
            {hasSymbol && hasIsin && valuesDelimiter}
            {hasIsin && <SearchHighlight>{String(isin)}</SearchHighlight>}
            {!hasSymbol && !hasIsin && valuePlaceholder}
        </span>
    );
};

export default React.memo(ProductSymbolIsin);
