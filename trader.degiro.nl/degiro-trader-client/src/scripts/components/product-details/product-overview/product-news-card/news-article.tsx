import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import * as React from 'react';
import {NewsArticle as NewsArticleModel} from '../../../../models/news';
import formatArticleContent from '../../../../services/news/format-article-content';
import ExternalHtmlContent from '../../../external-html-content/index';
import DateValue from '../../../value/date';
import {articleTable} from '../../../markets/markets-news/news-article-page/news-article-page.css';
import NewsArticleProducts from '../../../markets/news/news-article-products';
import {articleBody, newsArticleContent, newsArticleSubTitle, newsArticleTitle} from './news-card.css';

type Props = Pick<NewsArticleModel, 'id' | 'title' | 'date' | 'products' | 'content' | 'hasHtmlContent' | 'isins'>;

const NewsArticle: React.FunctionComponent<Props> = ({title, date, id, products, content, hasHtmlContent, isins}) => (
    <article data-name="newsArticle" className={articleBody} data-isins={isins?.toString()}>
        <InnerHtml className={newsArticleTitle}>{title}</InnerHtml>
        {date && (
            <DateValue id={id} field="date" value={date} format="HH:mm DD/MM/YYYY" className={newsArticleSubTitle} />
        )}
        <div className={newsArticleContent}>
            {isNonEmptyArray(products) && <NewsArticleProducts products={products} />}
            <ExternalHtmlContent selectableText={true}>
                {formatArticleContent(content, {isHtml: hasHtmlContent, tableClassName: articleTable})}
            </ExternalHtmlContent>
        </div>
    </article>
);

export default React.memo(NewsArticle);
