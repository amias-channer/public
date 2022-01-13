import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import * as React from 'react';
import FeedbackPromotion from '../feedback/promotion';
import InvitationPromotion from '../profile/invitation/promotion';
import CommodityProducts from './commodity-products';
import MarketCurrencies from './currencies';
import MarketFutures from './futures';
import MarketIndices from './indices';
import LatestVideos from './latest-videos';
import MarketMovers from './market-movers';
import {MarketsNewsProps} from './markets-news';
import MarketsHomeLayout from './markets-home-layout';

const LatestNews = createLazyComponent(
    () => import(/* webpackChunkName: "markets-latest-news" */ './markets-news/latest-news')
);
const MarketsAgendaCard = createLazyComponent(
    () => import(/* webpackChunkName: "markets-agenda-card" */ './agenda/markets-agenda-card')
);
const TopNewsPreview = createLazyComponent(
    () => import(/* webpackChunkName: "markets-top-news-preview" */ './markets-news/top-news/top-news-preview')
);
const {memo} = React;
const MarketsHome = memo<MarketsNewsProps>(({layoutColumnsCount}) => (
    <MarketsHomeLayout
        layoutColumnsCount={layoutColumnsCount}
        indices={<MarketIndices isListView={layoutColumnsCount === 1} />}
        movers={<MarketMovers />}
        currencies={<MarketCurrencies />}
        futures={<MarketFutures />}
        commodity={<CommodityProducts />}
        agenda={<MarketsAgendaCard />}
        latestNews={
            <LatestNews
                layoutColumnsCount={layoutColumnsCount}
                hasFullHeight={layoutColumnsCount === 4}
                // the limit is defined in [TRADER-1999]
                limit={10}
                hasCompactFilters={true}
                isNewsPreview={true}
            />
        }
        topNews={<TopNewsPreview hasCompactView={layoutColumnsCount < 4} />}
        latestVideos={<LatestVideos layoutColumnsCount={layoutColumnsCount} />}
        invitationPromotion={<InvitationPromotion />}
        feedbackPromotion={<FeedbackPromotion />}
    />
));

MarketsHome.displayName = 'MarketsHome';
export default MarketsHome;
