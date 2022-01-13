import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import * as React from 'react';
import {NewsArticle} from '../../../../models/news';
import formatArticleContent from '../../../../services/news/format-article-content';
import isRefinitivNews from '../../../../services/news/is-refinitiv-news';
import {I18nContext} from '../../../app-component/app-context';
import ExternalHtmlContent from '../../../external-html-content';
import Spinner from '../../../progress-bar/spinner';
import {nbsp, valuesDelimiter} from '../../../value';
import DateValue from '../../../value/date';
import RelativeTimeFromNow from '../../../value/relative-time-from-now';
import {LayoutColumnsCount} from '../../index';
import NewsArticleImage from '../preview-blocks/news-article-image';
import {articleTitleSeparator} from '../preview-blocks/news-article-item/news-article-item.css';
import {
    articleContent,
    articleFooter,
    articlePicture,
    articlePictureWrapper,
    articleTable,
    articleTextContent,
    articleTitle,
    dateTime,
    embeddedCard,
    relatedStocksCard
} from './news-article-page.css';
import RelatedStocks from './related-stocks';

interface Props {
    newsArticle: NewsArticle;
    relatedProducts?: ProductInfo[];
    layoutColumnsCount: LayoutColumnsCount;
}

const {useContext} = React;
const NewsArticleContent: React.FunctionComponent<Props> = ({newsArticle, relatedProducts, layoutColumnsCount}) => {
    const i18n = useContext(I18nContext);
    const {id, title, pictureUrl} = newsArticle;

    return (
        <div data-name="articleContent" className={articleContent}>
            <h2 className={articleTitle}>
                <InnerHtml>{newsArticle.title}</InnerHtml>
            </h2>
            <div className={dateTime}>
                <span>
                    {localize(i18n, 'trader.markets.news.created')}:{nbsp}
                    <DateValue field="date" id={id} value={newsArticle.date} onlyTodayTime={true} />
                </span>
                {newsArticle.lastUpdated && (
                    <>
                        <span className={articleTitleSeparator}>{valuesDelimiter}</span>
                        <span>
                            {localize(i18n, 'trader.markets.news.lastUpdated')}:{nbsp}
                            <RelativeTimeFromNow
                                id="newsArticleSubLabelLastUpdated"
                                field="lastUpdated"
                                value={newsArticle.lastUpdated}
                                thresholdInDays={4}
                            />
                        </span>
                    </>
                )}
            </div>
            {pictureUrl && (
                // We use this wrapper to preserve image aspect ratio
                <div className={articlePictureWrapper}>
                    <NewsArticleImage
                        src={pictureUrl}
                        alt={title}
                        className={articlePicture}
                        width={580}
                        height={290}
                    />
                </div>
            )}
            <ExternalHtmlContent className={articleTextContent}>
                {formatArticleContent(newsArticle.content, {
                    isHtml: newsArticle.hasHtmlContent,
                    tableClassName: articleTable
                })}
            </ExternalHtmlContent>
            {isRefinitivNews(newsArticle) && (
                <footer className={articleFooter}>
                    {`${localize(i18n, 'trader.markets.news.source')}: Refinitiv`}
                </footer>
            )}
            {relatedProducts ? (
                isNonEmptyArray(relatedProducts) &&
                layoutColumnsCount < 4 && (
                    <RelatedStocks
                        className={`${relatedStocksCard} ${embeddedCard}`}
                        relatedProducts={relatedProducts}
                        isEmbeddedCard={true}
                    />
                )
            ) : (
                <Spinner />
            )}
        </div>
    );
};

export default React.memo(NewsArticleContent);
