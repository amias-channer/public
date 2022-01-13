import localize from 'frontend-core/dist/services/i18n/localize';
import capitalize from 'frontend-core/dist/utils/string/capitalize';
import * as React from 'react';
import {RouteComponentProps, useParams} from 'react-router-dom';
import {NewsCategory, NewsCategoryIds, NewsSubCategory, NewsTypes} from '../../../models/news';
import {Routes} from '../../../navigation';
import getNewsCategories from '../../../services/news/get-news-categories';
import getNewsCategoryBySubCategoryId from '../../../services/news/get-news-category-by-sub-category-id';
import getNewsSubCategoryById from '../../../services/news/get-news-sub-category-by-id';
import {I18nContext} from '../../app-component/app-context';
import Breadcrumbs, {BackLinkProps, BreadcrumbsItem} from '../../navigation/breadcrumbs';

interface RouteMatchParams {
    subCategoryId: string;
    id: string;
}

export type NewsBreadcrumbsRouteComponentProps = RouteComponentProps<RouteMatchParams>;

const {useMemo, useContext} = React;
const NewsBreadcrumbs: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const routeMatchParams = useParams<RouteMatchParams>();
    const {subCategoryId} = routeMatchParams;
    const newsCategories: NewsCategory[] = useMemo(() => getNewsCategories(), []);
    const backLinkProps: BackLinkProps = useMemo(
        () => ({
            to: Routes.MARKETS_NEWS,
            content: localize(i18n, 'trader.markets.news.backToNews')
        }),
        [i18n]
    );
    const breadcrumbsItems: BreadcrumbsItem[] = useMemo(() => {
        const subCategory: NewsSubCategory | undefined = getNewsSubCategoryById(newsCategories, subCategoryId);
        const items: BreadcrumbsItem[] = [
            {id: 'market', content: localize(i18n, 'trader.navigation.markets'), to: Routes.MARKETS},
            {id: 'news', content: localize(i18n, 'trader.navigation.markets.news'), to: Routes.MARKETS_NEWS}
        ];

        if (subCategoryId === NewsTypes.LATEST_NEWS) {
            items.push({
                id: NewsTypes.LATEST_NEWS,
                content: capitalize(localize(i18n, 'trader.markets.news.latestNews.title')),
                selected: true
            });
        } else {
            const category: NewsCategory | undefined = getNewsCategoryBySubCategoryId(newsCategories, subCategoryId);

            items.push({id: NewsTypes.TOP_NEWS, content: localize(i18n, 'trader.markets.news.topNews.title')});
            if (category) {
                items.push({id: category.id, content: category.label, selected: true});
            } else {
                return [];
            }
        }

        if (subCategory && subCategoryId !== NewsCategoryIds.ALL.toLowerCase()) {
            items.push({id: subCategory.id, content: subCategory.label, selected: true});
        }

        return items;
    }, [newsCategories, subCategoryId, i18n]);

    if (!breadcrumbsItems.length) {
        return null;
    }

    return <Breadcrumbs data-name="newsBreadcrumbs" items={breadcrumbsItems} backLinkProps={backLinkProps} />;
};

export default React.memo(NewsBreadcrumbs);
