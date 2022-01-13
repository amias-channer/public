import * as React from 'react';
import Select, {SelectOption, SelectSizes} from 'frontend-core/dist/components/ui-trader4/select';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {NewsFiltersContext, NewsFiltersContextType} from '../../index';
import {NewsCategory, NewsCategoryIds, NewsSubCategory} from '../../../../models/news';
import {ConfigContext} from '../../../app-component/app-context';
import GroupSelect, {GroupSelectOption} from '../../../group-select';
import {
    activeDropdownItem,
    dropdown,
    frontPageButton,
    groupActiveSelectButton,
    groupSelectButton,
    menu,
    selectBase
} from './news-categories-menu.css';
import useNewsFiltersProductIds from '../use-news-filters-product-ids';
import getNewsCategories from '../../../../services/news/get-news-categories';
import getFilteredNewsCategoriesByProductIds from '../../../../services/news/get-filtered-news-categories-by-product-ids';

interface Props {
    subCategory: NewsSubCategory | undefined;
    onChange(selectedOptionId: string): void;
}

const {useContext} = React;
const isActiveCategory = (categorySubCategories: NewsSubCategory[], activeSubCategoryCategoryId: string): boolean =>
    categorySubCategories.some((subCategory) => subCategory.id === activeSubCategoryCategoryId);
const getSubCategoryOptions = (subCategories: NewsSubCategory[]): SelectOption[] =>
    subCategories.map(
        ({id, label}): SelectOption => ({
            value: id,
            label
        })
    );
const NewsCategoriesFullMenu: React.FunctionComponent<Props> = ({onChange, subCategory}) => {
    const allNewsCategories: NewsCategory[] = getNewsCategories();
    const subCategoryId = subCategory?.id;
    const config = useContext(ConfigContext);
    const {filters} = useContext<NewsFiltersContextType>(NewsFiltersContext);
    const {productIds, isLoading: isProductIdsLoading} = useNewsFiltersProductIds(filters);
    const allSelectOption: GroupSelectOption = allNewsCategories[0];
    const {value: availableNewsCategories = allNewsCategories} = useAsyncWithProgressiveState<
        NewsCategory[] | undefined
    >(() => {
        return productIds.length > 0
            ? getFilteredNewsCategoriesByProductIds(config, productIds)
            : Promise.resolve(undefined);
    }, [productIds, isProductIdsLoading]);

    return (
        <div className={menu}>
            <GroupSelect
                name="mainSubCategoriesSelect"
                itemClassName={`${groupSelectButton} ${frontPageButton}`}
                activeItemClassName={groupActiveSelectButton}
                onChange={onChange}
                selectedOptionId={subCategoryId || NewsCategoryIds.ALL}
                options={[allSelectOption]}
            />
            {availableNewsCategories.map(({id, label, subCategories}: NewsCategory) => {
                if (id === NewsCategoryIds.ALL) {
                    return null;
                }

                return (
                    <Select
                        key={id}
                        searchable={false}
                        className={`${dropdown} ${selectBase} ${
                            subCategoryId && isActiveCategory(subCategories, subCategoryId) ? activeDropdownItem : ''
                        }`}
                        name={`${id}CategorySelect`}
                        size={SelectSizes.WIDE}
                        placeholder={label}
                        onChange={onChange}
                        options={getSubCategoryOptions(subCategories)}
                    />
                );
            })}
        </div>
    );
};

export default React.memo(NewsCategoriesFullMenu);
