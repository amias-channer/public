import * as React from 'react';
import {FavouriteProductsList} from 'frontend-core/dist/models/favourite-product';
import {Position, ProductId} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import usePortfolioPositions from '../../../hooks/use-portfolio-positions';
import useFavouriteLists from '../../favourites/hooks/use-favourite-lists';
import {NewsFilters} from './filters';

interface Result {
    productIds: ProductId[];
    isLoading: boolean;
}

const {useMemo} = React;

export default function useNewsFiltersProductIds({hasPortfolio, favouritesListsIds}: NewsFilters): Result {
    const {value: favouriteLists, isLoading: isFavouritesListsLoading} = useFavouriteLists();
    const {positions, isLoading: isPositionsLoading} = usePortfolioPositions(ProductTypeIds.STOCK);
    const favouritesListsIdsCount: number = favouritesListsIds.length;
    const isFilterDataLoading: boolean = isFavouritesListsLoading || isPositionsLoading;
    const productIds: ProductId[] = useMemo(() => {
        if ((!hasPortfolio && !favouritesListsIdsCount) || isFilterDataLoading) {
            return [];
        }

        const positionsProductIds: ProductId[] = hasPortfolio
            ? positions.map(({productInfo}: Position) => productInfo.id)
            : [];
        const favouriteListsProductIds: ProductId[] =
            favouritesListsIdsCount > 0 && favouriteLists
                ? favouriteLists.reduce(
                      (allFavouriteListsProductIds: ProductId[], {id, productIds}: FavouriteProductsList) => {
                          if (favouritesListsIds.includes(id)) {
                              allFavouriteListsProductIds.push(...productIds);
                          }

                          return allFavouriteListsProductIds;
                      },
                      []
                  )
                : [];

        return [...positionsProductIds, ...favouriteListsProductIds];
    }, [
        hasPortfolio,
        favouritesListsIds,
        positions,
        favouriteLists,
        isFavouritesListsLoading,
        isPositionsLoading,
        favouritesListsIdsCount
    ]);

    return {
        productIds,
        isLoading: isFilterDataLoading
    };
}
