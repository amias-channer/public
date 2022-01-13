import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {newsListId, NewsSubCategory} from '../../../../models/news';
import {Routes} from '../../../../navigation';
import CardHeader from '../../../card/header';
import Filters from '../filters/index';
import {title as titleClassName} from '../top-news/top-news.css';
import {separator} from './news-article-page.css';
import NewsCategoriesFullMenu from '../news-categories-menu/full-menu';

interface Props {
    title?: string;
    subCategory?: NewsSubCategory;
    className?: string;
}

const {useCallback} = React;
const Header: React.FunctionComponent<Props> = ({title, subCategory}) => {
    const history = useHistory();
    const selectNewsSubCategory = useCallback(
        (subCategoryId: string) => {
            history.push(`${Routes.MARKETS_NEWS}/${subCategoryId}/${newsListId}`);
        },
        [history]
    );

    return (
        <CardHeader className={titleClassName} title={title}>
            <Filters hasGreyBackground={false} />
            {subCategory && (
                <>
                    <div className={separator} />
                    <NewsCategoriesFullMenu subCategory={subCategory} onChange={selectNewsSubCategory} />
                </>
            )}
        </CardHeader>
    );
};

export default React.memo(Header);
