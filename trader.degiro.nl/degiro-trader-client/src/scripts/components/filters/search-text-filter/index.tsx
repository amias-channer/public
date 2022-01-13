import {formLine} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import {InputSizes} from '../../input';
import SearchInput, {SearchInputProps} from '../../input/search/index';
import {filtersSection, outlinedControl} from '../filters.css';
import {formLineInputLayout} from './search-text-filter.css';

interface Props<FiltersValues> {
    value?: string;
    field?: keyof FiltersValues & string;
    outlined?: boolean;
    isFormLine?: boolean;
    autoFocus?: SearchInputProps['autoFocus'];
    placeholder?: string;
    debounced?: boolean;
    className?: string;
    onChange(field: keyof FiltersValues & string, value: string): void;
}

const {useCallback, useRef, useEffect, useContext} = React;
const SearchTextFilter = <FiltersValues extends Record<string, any>>({
    field = 'searchText',
    value,
    debounced,
    outlined,
    isFormLine,
    className = '',
    placeholder,
    onChange
}: React.PropsWithChildren<Props<FiltersValues>>) => {
    const i18n = useContext(I18nContext);
    const debounceTimerRef = useRef<number | undefined>(undefined);
    const onSearchTextChange = useCallback(
        (value: string) => {
            const callOnChange = () => onChange(field, value as FiltersValues[keyof FiltersValues]);

            clearTimeout(debounceTimerRef.current);

            if (debounced) {
                debounceTimerRef.current = window.setTimeout(callOnChange, 500);
            } else {
                callOnChange();
            }
        },
        [field, onChange]
    );

    useEffect(() => () => clearTimeout(debounceTimerRef.current), []);

    return (
        <div className={`${isFormLine ? formLine : filtersSection} ${className}`}>
            <SearchInput
                size={isFormLine ? InputSizes.WIDE : undefined}
                name={field}
                className={isFormLine ? formLineInputLayout : outlined ? outlinedControl : undefined}
                placeholder={placeholder || localize(i18n, 'trader.productsTable.searchProduct')}
                value={value}
                onValueChange={onSearchTextChange}
            />
        </div>
    );
};

export default React.memo(SearchTextFilter) as <T extends Record<string, any>>(
    props: React.PropsWithChildren<Props<T>>
) => JSX.Element;
