import React from 'react';
import { batch, connect } from 'react-redux';
import PropTypes from 'prop-types';
import AsyncChart from '../../Chart/AsyncChart';
import {
  myMarkersGetSearchResults,
  myMarketsFetchUnderlyingsList, myMarketsListResetFlyoutSearchBoxData,
  myMarketsPutUnderlying,
  myMarketsSetActiveChartTimespan,
  myMarketsSetDisplaySearchBoxFlyout,
  myMarketsWillUnmount,
} from './actions';
import MyMarketsRealTimeIndications, { MARKET_INDICATIONS_DISPLAY_MODE } from './MyMarketsRealTimeIndications';
import i18n from '../../../utils/i18n';
import { removeStarSymbol } from '../../Market/MarketInstrumentDetails';
import { getChartUrl } from '../../InstrumentChart';
import ButtonFlyoutSearchBox from '../../ButtonFlyoutSearchBox';
import {
  getMyMarketsUnderlyingSearchUrl,
  MY_MARKETS_CHART_OPTIONS,
} from './MyMarketsOverview.helper';
import {
  SEARCH_LIST_DISPLAY_UNDERLYINGS,
} from '../../FlyoutSearchBox/SearchList';
import { replaceParamsInPath } from '../../../utils/utils';
import Alert from '../../Alert';
import { ALERT_TYPE } from '../../Alert/Alert.helper';
import HtmlText from '../../HtmlText';

export class MyMarketsOverviewComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.toggleChartTimespan = this.toggleChartTimespan.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchListItemClick = this.onSearchListItemClick.bind(this);
    this.setDisplaySearchBoxFlyout = this.setDisplaySearchBoxFlyout.bind(this);
    this.onClickOutsideFlyoutSearchBox = this.onClickOutsideFlyoutSearchBox.bind(this);
    dispatch(myMarketsFetchUnderlyingsList());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(myMarketsWillUnmount());
  }

  onSearch(searchText) {
    const { dispatch } = this.props;
    dispatch(myMarkersGetSearchResults(getMyMarketsUnderlyingSearchUrl(), searchText));
  }

  onSearchListItemClick(underlyingData) {
    const { dispatch, myMarkets } = this.props;
    const url = replaceParamsInPath(myMarkets.urlAddUnderlying, { isin: underlyingData.isin });
    batch(() => {
      dispatch(myMarketsPutUnderlying(url));
      dispatch(myMarketsSetDisplaySearchBoxFlyout(false));
      dispatch(myMarketsListResetFlyoutSearchBoxData());
    });
  }

  onClickOutsideFlyoutSearchBox() {
    const { dispatch } = this.props;
    dispatch(myMarketsListResetFlyoutSearchBoxData());
  }

  setDisplaySearchBoxFlyout(status) {
    const { dispatch } = this.props;
    dispatch(myMarketsSetDisplaySearchBoxFlyout(status));
  }

  getActiveChartUrl() {
    const { myMarkets } = this.props;
    return getChartUrl(myMarkets.activeTimespan, myMarkets.activeInstrument);
  }

  toggleChartTimespan(timespan) {
    const { dispatch } = this.props;
    dispatch(myMarketsSetActiveChartTimespan(timespan));
  }

  render() {
    const {
      myMarkets, dispatch,
    } = this.props;
    const activeChartUrl = this.getActiveChartUrl();
    return (
      <div className="MarketGenericLayout MyMarketsOverview col-lg">
        <h2 className="section-title">{i18n.t('My Market Overview')}</h2>
        <div className="section-tools">
          {((!myMarkets.count || !myMarkets.limit) || (myMarkets.count < myMarkets.limit)) && (
            <ButtonFlyoutSearchBox
              className="d-inline-block"
              onSearch={this.onSearch}
              isSearchLoading={myMarkets.isSearchLoading}
              searchResults={myMarkets.searchData}
              onSearchListItemClick={this.onSearchListItemClick}
              shouldDisplayFlyout={myMarkets.flyoutSearchBox.shouldDisplay}
              setDisplaySearchboxFlyout={this.setDisplaySearchBoxFlyout}
              displayResultListOf={SEARCH_LIST_DISPLAY_UNDERLYINGS}
              onClickOutsideFlyoutSearchBox={this.onClickOutsideFlyoutSearchBox}
            />
          )}
        </div>
        <div>
          {!myMarkets.isLoading && myMarkets.failure && (
            <Alert type={ALERT_TYPE.ERROR} dismissible>
              <div className="title">{i18n.t('underlying_add_failure')}</div>
              <div className="content">
                <HtmlText tag="span" data={{ text: myMarkets.failure.message || i18n.t('underlying_add_failure_default') }} />
              </div>
            </Alert>
          )}
        </div>
        {myMarkets.isLoading && (
          <div className="mt-5 is-loading" />
        )}
        <div className="section-content">
          {myMarkets.underlyings && (
            <MyMarketsRealTimeIndications
              tiles={myMarkets.underlyings}
              activeInstrument={myMarkets.activeInstrument}
              dispatch={dispatch}
              displayMode={MARKET_INDICATIONS_DISPLAY_MODE.WITH_CHART}
              isLoading={myMarkets.isLoading}
            />
          )}

          {myMarkets.activeInstrument && (
            <>
              {myMarkets.activeInstrument.name && (
              <div className="section-title mt-4 pt-4">
                {`${i18n.t('Chart auf')} ${removeStarSymbol(myMarkets.activeInstrument.name)}`}
              </div>
              )}
              {activeChartUrl && (
                <AsyncChart
                  uniqKey={`MyMarketsOverview-${myMarkets.activeInstrument.id}`}
                  url={activeChartUrl}
                  timespan={myMarkets.activeTimespan}
                  options={MY_MARKETS_CHART_OPTIONS}
                  toggleChartTimespan={this.toggleChartTimespan}
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

MyMarketsOverviewComponent.propTypes = {
  myMarkets: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
};

MyMarketsOverviewComponent.defaultProps = {
  myMarkets: {
    activeInstrument: null,
    activeTimespan: null,
  },
  dispatch: () => {},
};

const mapStateToProps = (state) => ({
  myMarkets: state.userDashboardPageMyMarket,
  responsiveMode: state.global.responsiveMode,
});

const MyMarketsOverview = connect(mapStateToProps)(MyMarketsOverviewComponent);
export default MyMarketsOverview;
