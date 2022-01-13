import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import {NewsArticle} from '../../../../../models/news';
import {subLabel} from './news-article-sub-label.css';
import DateValue from '../../../../value/date';
import RelativeTimeFromNow from '../../../../value/relative-time-from-now';
import {nbsp, valuesDelimiter} from '../../../../value';
import {I18nContext} from '../../../../app-component/app-context';

interface Props extends Partial<Pick<NewsArticle, 'date' | 'lastUpdated'>> {
    className?: string;
}

const {memo, useContext} = React;
const NewsArticleSubLabel: React.FunctionComponent<Props> = memo(({date, lastUpdated, className = ''}) => {
    const i18n = useContext(I18nContext);

    return (
        <div data-name="newsArticleSubLabel" className={`${subLabel} ${className}`}>
            <DateValue field="date" id="newsArticleDate" value={date} onlyTodayTime={true} />
            {lastUpdated && (
                <>
                    {nbsp}
                    {valuesDelimiter}
                    {nbsp}
                    {localize(i18n, 'trader.markets.news.updated')}:{nbsp}
                    <RelativeTimeFromNow
                        id="newsArticleSubLabelLastUpdated"
                        field="lastUpdated"
                        value={lastUpdated}
                        thresholdInDays={4}
                    />
                </>
            )}
        </div>
    );
});

NewsArticleSubLabel.displayName = 'NewsArticleSubLabel';
export default NewsArticleSubLabel;
