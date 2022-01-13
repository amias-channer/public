import * as React from 'react';
import {FavouriteProductsListId} from 'frontend-core/dist/models/favourite-product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import localize from 'frontend-core/dist/services/i18n/localize';
import useFiltersChangeHandlers from '../../../filters/hooks/use-filters-change-handlers';
import PortfolioFilter from './portfolio-filter';
import {filtersWrapper, label, newsFilters} from './filters.css';
import {I18nContext} from '../../../app-component/app-context';
import usePortfolioPositions from '../../../../hooks/use-portfolio-positions';
import {NewsFiltersContext} from '../../index';
import NewsFilterSelect from './news-filter-select';

export interface NewsFilters {
    hasPortfolio: boolean;
    favouritesListsIds: FavouriteProductsListId[];
}

interface Props {
    hasGreyBackground?: boolean;
    className?: string;
}

const {useContext} = React;
const Filters: React.FunctionComponent<Props> = ({hasGreyBackground, className = ''}) => {
    const {positions} = usePortfolioPositions(ProductTypeIds.STOCK);
    const i18n = useContext(I18nContext);
    const {filters, onChange} = useContext(NewsFiltersContext);
    const {onFilterValueChange} = useFiltersChangeHandlers(filters, onChange);

    return (
        <div className={`${filtersWrapper} ${className}`}>
            <span className={label}>{localize(i18n, 'trader.markets.news.filterBy')}</span>
            <div className={newsFilters}>
                <PortfolioFilter
                    field="hasPortfolio"
                    disabled={!positions.length}
                    isActive={filters.hasPortfolio}
                    onChange={onFilterValueChange}
                    hasGreyBackground={hasGreyBackground}
                />
                <NewsFilterSelect isFavouritesSelect={true} hasGreyBackground={hasGreyBackground} />
            </div>
        </div>
    );
};

export default React.memo(Filters);
