import {formLine} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import {Position} from 'frontend-core/dist/models/product';
import {FavouriteProductsList, FavouriteProductsListId} from 'frontend-core/dist/models/favourite-product';
import localize from 'frontend-core/dist/services/i18n/localize';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import * as React from 'react';
import {
    layout,
    optionsList,
    optionsListWrapper
} from '../../../../../favourites/favourite-product-settings/favourite-product-settings.css';
import {header} from '../news-filter-select.css';
import {I18nContext} from '../../../../../app-component/app-context';
import useFavouriteLists from '../../../../../favourites/hooks/use-favourite-lists';
import usePortfolioPositions from '../../../../../../hooks/use-portfolio-positions';
import {NewsFiltersContext} from '../../../../index';
import OptionItem from './option-item';
import Footer from './footer';

export type Option = FavouriteProductsList;
export type OptionId = FavouriteProductsList['id'];
interface Props {
    toggle(): void;
    isFavouritesSelect?: boolean;
}
// We need some unique id and -1 was in used with default favourite list
export const portfolioId = -99999;
const {useState, useContext, useEffect, memo, useCallback, useMemo} = React;
const FilterListItems = memo<Props>(({toggle, isFavouritesSelect}) => {
    const i18n = useContext(I18nContext);
    const {positions} = usePortfolioPositions(ProductTypeIds.STOCK);
    const {filters, onChange} = useContext(NewsFiltersContext);
    const portfolioOption = useMemo<Option>(() => {
        return {
            id: portfolioId,
            name: localize(i18n, 'trader.navigation.portfolio'),
            productIds: positions.map(({productInfo}: Position) => String(productInfo.id))
        };
    }, [i18n, positions]);
    const {id: portfolioOptionId} = portfolioOption;
    const {value: favouriteLists = []} = useFavouriteLists();
    const options = useMemo<Option[]>(
        () => (isFavouritesSelect ? favouriteLists : [portfolioOption, ...favouriteLists]),
        [isFavouritesSelect, favouriteLists, portfolioOption]
    );
    const [selectedOptionsListsIds, setSelectedOptionsListsIds] = useState<OptionId[]>([]);
    const apply = useCallback(() => {
        const favouritesListsIds: FavouriteProductsListId[] = selectedOptionsListsIds.filter(
            (value) => value !== portfolioOptionId
        );

        onChange({
            hasPortfolio: selectedOptionsListsIds.includes(portfolioOptionId),
            favouritesListsIds
        });
        toggle();
    }, [selectedOptionsListsIds, toggle, onChange]);

    useEffect(() => {
        const selectedOptionsListsIds: FavouriteProductsListId[] = options
            .filter(({id}) => filters.favouritesListsIds.includes(id))
            .map(({id}) => id);

        if (filters.hasPortfolio) {
            selectedOptionsListsIds.push(portfolioOptionId);
        }
        setSelectedOptionsListsIds(selectedOptionsListsIds);
    }, [filters]);

    return (
        <div className={layout}>
            {!isFavouritesSelect && <h6 className={header}>{localize(i18n, 'trader.markets.news.filterBy')}</h6>}
            <div className={formLine}>
                <div className={optionsListWrapper}>
                    <div className={optionsList} role="listbox" aria-multiselectable="true">
                        {options.map((option: Option) => (
                            <OptionItem
                                key={option.id}
                                option={option}
                                portfolioId={portfolioOptionId}
                                selectedOptionsListsIds={selectedOptionsListsIds}
                                onChange={setSelectedOptionsListsIds}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Footer
                apply={apply}
                onChange={setSelectedOptionsListsIds}
                options={options}
                hasSelectedValues={selectedOptionsListsIds.length > 0}
            />
        </div>
    );
});

FilterListItems.displayName = 'FilterListItems';
export default FilterListItems;
