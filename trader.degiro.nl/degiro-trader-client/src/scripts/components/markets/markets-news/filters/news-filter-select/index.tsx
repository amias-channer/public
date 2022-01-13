import useToggle from 'frontend-core/dist/hooks/use-toggle';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {FavouriteProductsListId, FavouriteProductsList} from 'frontend-core/dist/models/favourite-product';
import * as React from 'react';
import {actionsMenu} from '../../../../menu/actions-menu.css';
import {NewsFiltersContext} from '../../../index';
import FilterButton from './filter-button';
import FilterListItems from './filter-list-items';
import Menu, {MenuProps} from '../../../../menu';
import useFavouriteLists from '../../../../favourites/hooks/use-favourite-lists';
import usePortfolioPositions from '../../../../../hooks/use-portfolio-positions';

interface NewsFilterMenuProps extends Pick<MenuProps, 'horizontalPosition' | 'verticalPosition'> {
    isFavouritesSelect?: boolean;
    hasGreyBackground?: boolean;
}

const {useContext, memo, useEffect} = React;
const NewsFilterSelect = memo<NewsFilterMenuProps>(({isFavouritesSelect, hasGreyBackground}) => {
    const {isOpened, toggle} = useToggle();
    const {filters, onChange} = useContext(NewsFiltersContext);
    const {value: favouriteLists} = useFavouriteLists();
    const {favouritesListsIds} = filters;
    const {positions} = usePortfolioPositions(ProductTypeIds.STOCK);
    const hasOnlyEmptyFavouritesLists: boolean = Boolean(
        favouriteLists?.every(({productIds}: FavouriteProductsList) => productIds.length === 0)
    );
    const isDisable: boolean =
        (isFavouritesSelect && hasOnlyEmptyFavouritesLists) ||
        (hasOnlyEmptyFavouritesLists && !isNonEmptyArray(positions));

    // [REFINITIV-2132] - favouriteLists came updated from useFavouriteLists() after update event in EventBroker
    // we need to sync news filters as well if there is some updated empty favourite list
    useEffect(() => {
        if (!favouriteLists?.length) {
            return;
        }

        const updatedFavouritesListsIds = favouritesListsIds.reduce<FavouriteProductsListId[]>(
            (updatedFavouriteListsIds, favouriteListsId) => {
                const updatedFavouriteList: FavouriteProductsList | undefined = favouriteLists.find(
                    ({id}: FavouriteProductsList) => id === favouriteListsId
                );

                if (updatedFavouriteList?.productIds.length) {
                    updatedFavouriteListsIds.push(favouriteListsId);
                }

                return updatedFavouriteListsIds;
            },
            []
        );

        onChange({
            ...filters,
            favouritesListsIds: updatedFavouritesListsIds
        });
    }, [favouriteLists]);

    return (
        <Menu
            data-name="newsFilterSelect"
            isOpened={isOpened}
            horizontalPosition="inside-start"
            verticalPosition="after"
            onClose={toggle}
            target={
                <FilterButton
                    toggle={toggle}
                    isOpened={isOpened}
                    isDisabled={isDisable}
                    isFavouritesSelect={isFavouritesSelect}
                    hasGreyBackground={hasGreyBackground}
                />
            }>
            <div className={actionsMenu}>
                <FilterListItems toggle={toggle} isFavouritesSelect={isFavouritesSelect} />
            </div>
        </Menu>
    );
});

NewsFilterSelect.displayName = 'NewsFilterSelect';
export default NewsFilterSelect;
