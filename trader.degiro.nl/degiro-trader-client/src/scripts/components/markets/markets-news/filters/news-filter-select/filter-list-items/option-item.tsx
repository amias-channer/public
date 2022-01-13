import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import getFavouriteProductsListName from 'frontend-core/dist/services/favourite-product/get-favourite-products-list-name';
import {
    activeCheckbox,
    checkbox,
    checkboxIcon
} from 'frontend-core/dist/components/ui-trader4/select/multiple/multi-select.css';
import {I18nContext} from '../../../../../app-component/app-context';
import {optionItem} from '../news-filter-select.css';
import {Option, OptionId} from './index';

interface Props {
    option: Option;
    portfolioId: OptionId;
    selectedOptionsListsIds: OptionId[];
    onChange: React.Dispatch<React.SetStateAction<number[]>>;
}

const {memo, useContext} = React;
const OptionItem = memo<Props>(({option, selectedOptionsListsIds, portfolioId, onChange}) => {
    const i18n = useContext(I18nContext);
    const {id: optionId} = option;
    const isSelected: boolean = selectedOptionsListsIds.includes(optionId);
    const deselectOption = (optionId: OptionId) => {
        const selectedOptionsIds: OptionId[] = selectedOptionsListsIds.filter((id: OptionId) => id !== optionId);

        onChange(selectedOptionsIds);
    };
    const selectOption = (optionId: OptionId) => {
        onChange([...selectedOptionsListsIds, optionId]);
    };

    return (
        <button
            disabled={option.productIds?.length === 0}
            data-name="filterListItem"
            key={String(optionId)}
            aria-checked={isSelected}
            type="button"
            role="option"
            className={optionItem}
            onClick={isSelected ? deselectOption.bind(null, optionId) : selectOption.bind(null, optionId)}>
            <span className={`${checkbox} ${isSelected ? activeCheckbox : ''}`}>
                {isSelected && <Icon type="check" className={checkboxIcon} />}
            </span>
            {optionId === portfolioId ? option.name : getFavouriteProductsListName(i18n, option)}
        </button>
    );
});

OptionItem.displayName = 'OptionItem';
export default OptionItem;
