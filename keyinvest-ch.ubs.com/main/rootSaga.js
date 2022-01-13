import {
  all,
} from 'redux-saga/effects';
import { analyticsSagas } from '../analytics/sagas';
import { cmsComponentsRendererSagas } from '../pages/CmsPage/sagas';
import { pushManagerSagas } from '../components/PushManager/sagas';
import { fileDownloadManagerSagas } from '../components/FileDownloadManager/sagas';
import { searchBarSagas } from '../components/MainHeader/SearchBar/sagas';
import { marketOverviewSagas } from '../components/Market/MarketGenericLayout/sagas';
import { discountBarometerSagas } from '../components/Market/DiscountBarometer/sagas';
import { asyncChartSagas } from '../components/Chart/AsyncChart/sagas';
import { chartManagerSagas } from '../components/Chart/ChartManager/sagas';
import { volatilityMonitorSagas } from '../components/Market/VolatilityMonitor/sagas';
import { marketMembersSagas } from '../components/Market/MarketMembersTable/sagas';
import { marketInstrumentTableSagas } from '../components/Market/MarketInstrumentTable/sagas';
import { quickSearchSagas } from '../components/QuickSearch/sagas';
import { deriRiskIndicatorSagas } from '../components/Market/DeriRiskIndicator/saga';
import { defaultListFilterableSagas } from '../components/DefaultListFilterable/sagas';
import { productDetailPageSagas } from '../pages/ProductDetailPage/sagas';
import { disclaimerPopupSagas } from '../components/DisclaimerPopup/sagas';
import { publicationsDownloadSagas } from '../components/Service/PublicationsDownload/sagas';
import { mainRegisterSagas } from '../pages/MainRegisterPage/sagas';
import { knockoutMapSagas } from '../components/Tools/KnockoutMap/sagas';
import { yieldMonitorFilterableSagas } from '../components/ProductYieldMonitorFilterable/sagas';
import { myWatchListSagas } from '../components/UserDashboard/MyWatchList/sagas';
import { myMarketOverviewSagas } from '../components/UserDashboard/MyMarketsOverview/sagas';
import { watchlistAddProductPopup } from '../components/WatchlistAddProductPopup/sagas';
import { mySearchesSagas } from '../components/UserDashboard/MySearches/sagas';
import { savedItemsListSagas } from '../components/UserDashboard/MyTrendRadar/MySavedItemsList/sagas';
import { myNewsSagas } from '../components/UserDashboard/MyNews/sagas';
import { userProfileEditPageSagas } from '../pages/UserProfileEditPage/sagas';
import { trendRadarDetailsPageSagas } from '../pages/TrendRadarDetailsPage/sagas';
import { trendRadarAlarmPopupSagas } from '../components/TrendRadarAlarmPopup/sagas';
import { backendSearchableDropdownSagas } from '../components/BackendSearchableDropdownList/sagas';
import { adformTrackingSagas } from '../adformTracking/sagas';

export default function* rootSaga() {
  yield all([
    ...analyticsSagas,
    ...adformTrackingSagas,
    ...cmsComponentsRendererSagas,
    ...marketOverviewSagas,
    ...marketMembersSagas,
    ...marketInstrumentTableSagas,
    ...discountBarometerSagas,
    ...volatilityMonitorSagas,
    ...deriRiskIndicatorSagas,
    ...asyncChartSagas,
    ...chartManagerSagas,
    ...pushManagerSagas,
    ...fileDownloadManagerSagas,
    ...searchBarSagas,
    ...quickSearchSagas,
    ...defaultListFilterableSagas,
    ...yieldMonitorFilterableSagas,
    ...productDetailPageSagas,
    ...disclaimerPopupSagas,
    ...publicationsDownloadSagas,
    ...mainRegisterSagas,
    ...knockoutMapSagas,
    ...myWatchListSagas,
    ...myNewsSagas,
    ...mySearchesSagas,
    ...savedItemsListSagas,
    ...watchlistAddProductPopup,
    ...myMarketOverviewSagas,
    ...userProfileEditPageSagas,
    ...trendRadarDetailsPageSagas,
    ...trendRadarAlarmPopupSagas,
    ...backendSearchableDropdownSagas,
  ]);
}
