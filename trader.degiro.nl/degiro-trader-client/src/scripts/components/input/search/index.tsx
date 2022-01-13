import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import Spinner, {SpinnerModes} from '../../progress-bar/spinner';
import Input, {InputProps} from '../index';
import {clearButton, inputField, inputFieldLayout, searchBadge, spinner, spinnerLayout} from './search.css';

export interface SearchInputProps extends InputProps {
    controlClassName?: string;
    isSearching?: boolean;
    onValueChange(searchText: string): void;
}

const {useCallback} = React;
const SearchInput: React.ForwardRefRenderFunction<HTMLInputElement, React.PropsWithChildren<SearchInputProps>> = (
    {onValueChange, isSearching, controlClassName = '', className = '', ...inputProps},
    ref
) => {
    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onValueChange(event.currentTarget.value);
        },
        [onValueChange]
    );
    const onClearButtonClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            const input = event.currentTarget.parentElement?.firstElementChild as HTMLInputElement | null | undefined;

            if (input) {
                input.value = '';
                onValueChange('');
            }
        },
        [onValueChange]
    );

    return (
        <Input
            type="text"
            minLength={1}
            maxLength={100}
            aria-label={inputProps.placeholder}
            {...inputProps}
            ref={ref}
            hideFloatPlaceholder={true}
            onChange={onChange}
            controlClassName={`${inputField} ${controlClassName}`}
            className={`${inputFieldLayout} ${className}`}>
            <Icon type="search" className={searchBadge} />
            {isSearching ? (
                <div className={spinnerLayout}>
                    <Spinner mode={SpinnerModes.INLINE} className={spinner} />
                </div>
            ) : (
                <button
                    type="button"
                    data-name="searchInputClearButton"
                    /*
                        We assume that this button is mostly accessed by a mouse and additional focusable element
                        makes a keyboard navigation harder (user needs to do one more action to switch a focus).
                        We assume that when a client uses a keyboard navigation it's faster for him to press
                        Backspace or "Ctrl(Cmd) + A and Delete" than switch a focus to a specific button and press on it
                    */
                    tabIndex={-1}
                    className={clearButton}
                    onClick={onClearButtonClick}>
                    <Icon type="close" />
                </button>
            )}
        </Input>
    );
};

export default React.memo(React.forwardRef(SearchInput));
