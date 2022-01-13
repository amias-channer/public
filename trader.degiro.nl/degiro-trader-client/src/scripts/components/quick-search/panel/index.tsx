import useToggle from 'frontend-core/dist/hooks/use-toggle';
import {ProductType, ProductTypeIds} from 'frontend-core/dist/models/product-type';
import localize from 'frontend-core/dist/services/i18n/localize';
import debounce from 'frontend-core/dist/utils/debounce';
import addEventListenersOutside from 'frontend-core/dist/utils/events/add-event-listeners-outside';
import {Location} from 'history';
import * as React from 'react';
import {useLocation} from 'react-router-dom';
import {I18nContext} from '../../app-component/app-context';
import {focusedInputFieldLayout} from '../../input/input.css';
import SearchInput from '../../input/search';
import useQuickProductsSearch from '../hooks/use-quick-products-search';
import {inputFieldLayout, layout} from './panel.css';
import QuickSearchPopup from './quick-search-popup';

const {useRef, useContext, useMemo, useCallback, useState, useEffect, memo} = React;
const QuickSearchPanel = memo(() => {
    const i18n = useContext(I18nContext);
    const location: Location = useLocation();
    const [searchText, setSearchText] = useState<string>('');
    const setSearchTextDebounced = useMemo(() => debounce(setSearchText, 100, false), []);
    const rootElRef = useRef<HTMLDivElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const popupToggle = useToggle(false);
    const [selectedProductType, setSelectedProductType] = useState<ProductType | undefined>();
    const selectedProductTypeId: ProductTypeIds | undefined = selectedProductType?.id;
    const {isLoading: isSearching, products = []} = useQuickProductsSearch(searchText, selectedProductTypeId);
    const openOnKeyEvent = useCallback(
        ({key, currentTarget}: React.KeyboardEvent<HTMLInputElement>) => {
            if (key !== 'Escape' && (key === 'ArrowDown' || currentTarget.value)) {
                popupToggle.open();
            }
        },
        [popupToggle.open]
    );

    useEffect(() => {
        if (popupToggle.isOpened) {
            const onGlobalKeyboardEvent = ({key, ctrlKey, metaKey}: KeyboardEvent) => {
                const {current: searchInputEl} = searchInputRef;

                if (key === 'Escape') {
                    popupToggle.close();
                    searchInputEl?.focus();
                    return;
                }

                if (
                    searchInputEl &&
                    searchInputEl !== document.activeElement &&
                    !ctrlKey &&
                    !metaKey &&
                    key !== ' ' &&
                    (key === 'Backspace' || key.length === 1)
                ) {
                    const value = key === 'Backspace' ? searchInputEl.value.slice(0, -1) : searchInputEl.value + key;
                    const valueLength = value.length;

                    searchInputEl.value = value;
                    searchInputEl.focus();
                    searchInputEl.setSelectionRange(valueLength, valueLength);
                    searchInputEl.dispatchEvent(new Event('input', {bubbles: true}));
                    searchInputEl.dispatchEvent(new Event('change', {bubbles: true}));
                }
            };

            document.addEventListener('keyup', onGlobalKeyboardEvent, {capture: true});

            return () => document.removeEventListener('keyup', onGlobalKeyboardEvent, {capture: true});
        }
    }, [popupToggle.isOpened]);

    useEffect(() => addEventListenersOutside([rootElRef.current], 'click', popupToggle.close, {capture: true}), [
        popupToggle.isOpened
    ]);
    useEffect(() => addEventListenersOutside([rootElRef.current], 'focus', popupToggle.close, {capture: true}), [
        popupToggle.isOpened
    ]);
    useEffect(() => popupToggle.close(), [location.pathname, location.search]);

    const popupRef = useRef<HTMLDivElement>(null);
    const jumpToPopup = useCallback((event) => {
        if (event.key === 'ArrowDown') {
            event.stopPropagation();
            popupRef.current?.querySelector<HTMLElement>('[tabindex="1"]')?.focus();
        }
    }, []);

    return (
        <div ref={rootElRef} role="search" data-name="quickSearch" className={layout}>
            <SearchInput
                ref={searchInputRef}
                autoComplete="off"
                placeholder={localize(i18n, 'trader.productsSearch.searchFieldPlaceholder')}
                name="quickSearchInput"
                className={`${inputFieldLayout} ${popupToggle.isOpened ? focusedInputFieldLayout : ''}`}
                isSearching={isSearching}
                onValueChange={setSearchTextDebounced}
                onFocus={popupToggle.isOpened ? undefined : popupToggle.open}
                // then next event handler are the helpers to reopen the popup after closing on Escape
                onClick={popupToggle.isOpened ? undefined : popupToggle.open}
                onKeyUp={popupToggle.isOpened ? undefined : openOnKeyEvent}
                onKeyDown={popupToggle.isOpened ? jumpToPopup : undefined}
            />
            {popupToggle.isOpened && (
                <QuickSearchPopup
                    ref={popupRef}
                    searchText={searchText}
                    onProductTypeChange={setSelectedProductType}
                    productType={selectedProductType}
                    products={products}
                    onClose={popupToggle.close}
                />
            )}
        </div>
    );
});

QuickSearchPanel.displayName = 'QuickSearchPanel';
export default QuickSearchPanel;
