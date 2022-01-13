import * as React from 'react';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import getSubstringEntriesIndices from 'frontend-core/dist/utils/string/get-substring-entries-indices';
import splitAt from 'frontend-core/dist/utils/string/split-at';
import {searchHighlight} from './search-highlight.css';

interface Props {
    children: string;
}

const {useContext, createContext, memo} = React;

export const SearchHighlightContext = createContext<string>('');

const SearchHighlight = memo<Props>(({children}) => {
    const searchQuery = useContext(SearchHighlightContext);
    const substringEntriesIndices: number[] = getSubstringEntriesIndices(children, searchQuery);

    if (searchQuery === '' && !isNonEmptyArray(substringEntriesIndices)) {
        return <>{children}</>;
    }

    return (
        <>
            {substringEntriesIndices
                .reduce<[[string], number]>(
                    ([result, offset], index) => {
                        const last = result.pop() as string;
                        const [prefix, partWithSearchQueryAtStart] = splitAt(last, index - offset);
                        const [query, suffix] = splitAt(partWithSearchQueryAtStart, searchQuery.length);

                        result.push(prefix, query, suffix);

                        return [result, index + searchQuery.length];
                    },
                    [[children], 0]
                )[0]
                .map((str: string, i: number) => {
                    return i % 2 === 0 ? (
                        str
                    ) : (
                        <mark key={i} className={searchHighlight}>
                            {str}
                        </mark>
                    );
                })}
        </>
    );
});

SearchHighlight.displayName = 'SearchHighlight';
export default SearchHighlight;
