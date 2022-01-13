import * as React from 'react';
import {NewsArticle} from '../../../../../models/news';
import {subCategoryLabel as subCategoryLabelClassName} from './news-sub-category-label.css';

export interface Props {
    newsArticle: NewsArticle;
}

const NewsSubCategoryLabel: React.FunctionComponent<Props> = ({newsArticle: {subCategoryLabel}}) => {
    return subCategoryLabel ? <span className={subCategoryLabelClassName}>{subCategoryLabel}</span> : null;
};

export default React.memo(NewsSubCategoryLabel);
