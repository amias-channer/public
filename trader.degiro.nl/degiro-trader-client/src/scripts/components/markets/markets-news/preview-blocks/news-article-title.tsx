import * as React from 'react';
import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {newsTitle} from './news-article-item/news-article-item.css';

interface Props {
    text: string;
    className?: string;
}

const NewsArticleTitle: React.FunctionComponent<Props> = ({text, className = ''}) => (
    <h3 className={`${newsTitle} ${className}`}>
        <InnerHtml>{text}</InnerHtml>
    </h3>
);

export default React.memo(NewsArticleTitle);
