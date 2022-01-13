import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {actionLink} from '../../../../../styles/link.css';
import {availableNewsLanguages, newsListId} from '../../../../models/news';
import getNewsSettings from '../../../../services/news/get-news-settings';
import saveNewsSettings from '../../../../services/news/save-news-settings';
import {CurrentClientContext, I18nContext} from '../../../app-component/app-context';
import CardHeader from '../../../card/header';
import Card from '../../../card';
import {LayoutColumnsCount} from '../../index';
import NewsLanguageSelect from '../news-list/news-language-select';
import {latestNewsFilters, seeMoreButton} from './latest-news.css';
import Filters from '../filters/index';
import NewsFilterSelect from '../filters/news-filter-select';

const LatestNewsCompactView = createLazyComponent(
    () => import(/* webpackChunkName: "markets-latest-news-compact-view" */ './latest-news-compact-view')
);
const LatestNewsFullView = createLazyComponent(
    () => import(/* webpackChunkName: "markets-latest-news-full-view" */ './latest-news-full-view')
);

interface Props {
    layoutColumnsCount: LayoutColumnsCount;
    limit?: number;
    hasFullHeight?: boolean;
    hasCompactFilters?: boolean;
    isNewsPreview?: boolean;
}

const {useState, useEffect, useMemo, useContext} = React;
const LatestNews: React.FunctionComponent<Props> = ({
    limit = 20,
    layoutColumnsCount,
    hasFullHeight,
    hasCompactFilters,
    isNewsPreview = false
}) => {
    const i18n = useContext(I18nContext);
    const currentClient = useContext(CurrentClientContext);
    const hasOneColumnLayout: boolean = layoutColumnsCount === 1;
    const {defaultLanguageCode, ...newsSettings} = useMemo(() => getNewsSettings(currentClient), [currentClient]);
    const [enabledLanguageCodes, setEnabledLanguageCodes] = useState<string[]>(newsSettings.enabledLanguageCodes);

    useEffect(() => {
        saveNewsSettings({enabledLanguageCodes});
    }, [enabledLanguageCodes]);

    return (
        <Card
            data-name="latestNews"
            innerHorizontalGap={false}
            header={
                <CardHeader
                    title={hasOneColumnLayout ? undefined : localize(i18n, 'trader.markets.news.latestNews.title')}>
                    <NewsLanguageSelect
                        hasOneColumnLayout={hasOneColumnLayout}
                        languages={availableNewsLanguages}
                        defaultLanguageCode={defaultLanguageCode}
                        enabledLanguageCodes={enabledLanguageCodes}
                        onChange={setEnabledLanguageCodes}
                    />
                    {layoutColumnsCount === 2 && !hasCompactFilters && (
                        <Filters className={latestNewsFilters} hasGreyBackground={true} />
                    )}
                    {(hasCompactFilters || hasOneColumnLayout) && <NewsFilterSelect />}
                </CardHeader>
            }
            footer={
                !hasOneColumnLayout && (
                    <Link
                        to={isNewsPreview ? Routes.MARKETS_NEWS : `${Routes.MARKETS_NEWS_LATEST_NEWS}/${newsListId}`}
                        className={`${actionLink} ${seeMoreButton}`}>
                        {localize(
                            i18n,
                            isNewsPreview ? 'trader.markets.news.goToNews' : 'trader.markets.news.readMore'
                        )}
                        <Icon type="keyboard_arrow_right" />
                    </Link>
                )
            }>
            {hasOneColumnLayout ? (
                <LatestNewsCompactView enabledLanguageCodes={enabledLanguageCodes} limit={limit} />
            ) : (
                <LatestNewsFullView
                    enabledLanguageCodes={enabledLanguageCodes}
                    limit={limit}
                    hasFullHeight={hasFullHeight}
                />
            )}
        </Card>
    );
};

export default React.memo(LatestNews);
