import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {activeButtonWithBackdrop, selectableButtonWithBackdrop} from '../../../../button/button.css';
import {activeFilter, labelIcon, fullLayoutSelect} from '../filters.css';
import {activeFiltersButtonIcon} from '../../../../filters/filters.css';
import {I18nContext} from '../../../../app-component/app-context';
import {layout, favouritesSelect, arrowIcon} from './news-filter-select.css';
import {layoutWithDefaultIcon} from '../../../../hint/hint.css';
import {NewsFiltersContext} from '../../..';
import {toggleIconWrapper} from '../../../../product-actions-button/product-actions-button.css';
import Hint from '../../../../hint';

interface Props {
    toggle(): void;
    isOpened: boolean;
    isDisabled: boolean;
    isFavouritesSelect?: boolean;
    hasGreyBackground?: boolean;
}

const {useContext, memo} = React;
const FilterButton = memo<Props>(({isDisabled, isFavouritesSelect, hasGreyBackground, isOpened, toggle}) => {
    const i18n = useContext(I18nContext);
    const {filters} = useContext(NewsFiltersContext);
    const {hasPortfolio, favouritesListsIds} = filters;
    const hasSelectedFilters: boolean = favouritesListsIds.length > 0 || hasPortfolio;
    const className: string = isFavouritesSelect
        ? `${favouritesSelect} ${hasGreyBackground ? '' : fullLayoutSelect} ${
              favouritesListsIds.length > 0 ? activeFilter : ''
          }`
        : `${layout} ${layoutWithDefaultIcon} ${toggleIconWrapper} ${
              isOpened ? activeButtonWithBackdrop : selectableButtonWithBackdrop
          }`;
    const filterButton: React.ReactElement = (
        <button
            aria-label={localize(i18n, 'trader.markets.news.filterBy')}
            type="button"
            disabled={isDisabled}
            className={className}
            onClick={toggle}>
            {isFavouritesSelect ? (
                <>
                    <Icon className={labelIcon} type="star" />
                    {localize(i18n, 'trader.productActions.watchlist.names.default')}
                    <Icon className={arrowIcon} type={isOpened ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} />
                </>
            ) : (
                <>
                    <Icon type="tune" />
                    {hasSelectedFilters && <Icon type="bullet" className={activeFiltersButtonIcon} />}
                </>
            )}
        </button>
    );

    return isDisabled ? (
        <Hint
            horizontalPosition="inside-start"
            verticalPosition="after"
            content={
                isFavouritesSelect
                    ? localize(i18n, 'trader.markets.newsFilter.tooltip.favourites')
                    : localize(i18n, 'trader.markets.newsFilter.tooltip')
            }>
            {filterButton}
        </Hint>
    ) : (
        filterButton
    );
});

FilterButton.displayName = 'FilterButton';
export default FilterButton;
