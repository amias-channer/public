import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import {Link} from 'react-router-dom';
import {newsListId, NewsSubCategory} from '../../../models/news';
import {Routes} from '../../../navigation';
import {I18nContext} from '../../app-component/app-context';
import CardHeader from '../../card/header';
import Filters from './filters/index';
import {
    compactHeaderContent,
    mobileNavigationButton,
    newsCategoriesMenuToggleLabel,
    select,
    compactHeader
} from './top-news/top-news.css';
import {fullLayoutSelect} from './filters/filters.css';
import NewsFilterSelect from './filters/news-filter-select/index';

interface Props {
    subCategory?: NewsSubCategory;
    className?: string;
    hasGreyBackground: boolean;
    hasNewsListIdInLink: boolean;
    hasOneColumnLayout: boolean;
}

const {useContext} = React;
const CompactHeader: React.FunctionComponent<Props> = ({
    subCategory,
    className = '',
    hasGreyBackground,
    hasNewsListIdInLink,
    hasOneColumnLayout
}) => {
    const i18n = useContext(I18nContext);

    return (
        <CardHeader
            className={`${compactHeader} ${className}`}
            title={hasOneColumnLayout ? undefined : localize(i18n, 'trader.navigation.markets.news')}>
            <div className={compactHeaderContent}>
                {!hasOneColumnLayout && <Filters hasGreyBackground={hasGreyBackground} />}
                {subCategory && (
                    <Link
                        to={`${Routes.MARKETS_NEWS_CATEGORIES}/${subCategory.id}${
                            hasNewsListIdInLink ? `/${newsListId}` : ''
                        }`}
                        className={`${select} ${mobileNavigationButton} ${hasGreyBackground ? '' : fullLayoutSelect}`}>
                        <span className={newsCategoriesMenuToggleLabel}>{subCategory.label}</span>
                        <Icon type="keyboard_arrow_down" />
                    </Link>
                )}
                {hasOneColumnLayout && <NewsFilterSelect />}
            </div>
        </CardHeader>
    );
};

export default React.memo(CompactHeader);
