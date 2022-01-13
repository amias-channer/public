export const MY_MARKETS_FETCH_UNDERLYINGS_LIST = 'MyMarkets/MY_MARKETS_FETCH_UNDERLYINGS';
export const MY_MARKETS_GOT_UNDERLYINGS_LIST = 'MyMarkets/MY_MARKETS_GOT_UNDERLYINGS_LIST';

export const MY_MARKETS_PUT_UNDERLYING = 'MyMarkets/MY_MARKETS_PUT_UNDERLYING';
export const MY_MARKETS_GOT_PUT_UNDERLYING = 'MyMarkets/MY_MARKETS_GOT_PUT_UNDERLYING';

export const MY_MARKETS_GET_SEARCH_RESULTS = 'MyMarkets/MY_MARKETS_GET_SEARCH_RESULTS';
export const MY_MARKETS_GOT_SEARCH_RESULTS = 'MyMarkets/MY_MARKETS_GOT_SEARCH_RESULTS';
export const MY_MARKETS_SET_DISPLAY_SEARCHBOX_FLYOUT = 'MyMarkets/MY_MARKETS_SET_DISPLAY_SEARCHBOX_FLYOUT';
export const MY_MARKETS_LIST_RESET_FLYOUT_SEARCH_BOX_DATA = 'MyMarkets/MY_MARKETS_LIST_RESET_FLYOUT_SEARCH_BOX_DATA';

export const MY_MARKETS_DELETE_UNDERLYING = 'MyMarkets/MY_MARKETS_DELETE_UNDERLYING';
export const MY_MARKETS_GOT_DELETE_UNDERLYING = 'MyMarkets/MY_MARKETS_GOT_DELETE_UNDERLYING';

export const MY_MARKETS_SET_ACTIVE_UNDERLYING = 'MyMarkets/MY_MARKETS_SET_ACTIVE_UNDERLYING';

export const MY_MARKETS_SET_ACTIVE_CHART_TIME_SPAN = 'MyMarkets/MY_MARKETS_SET_ACTIVE_CHART_TIME_SPAN';

export const MY_MARKETS_WILL_UNMOUNT = 'MyMarkets/MY_MARKETS_PAGE_WILL_UNMOUNT';


export function myMarketsFetchUnderlyingsList() {
  return {
    type: MY_MARKETS_FETCH_UNDERLYINGS_LIST,
  };
}

export function myMarketsGotUnderlyingsList(data) {
  return {
    type: MY_MARKETS_GOT_UNDERLYINGS_LIST,
    data,
  };
}

export function myMarkersGetSearchResults(url, searchText) {
  return {
    type: MY_MARKETS_GET_SEARCH_RESULTS,
    url,
    searchText,
  };
}

export function myMarketsGotSearchResults(data, failure) {
  return {
    type: MY_MARKETS_GOT_SEARCH_RESULTS,
    data,
    failure,
  };
}

export function myMarketsSetDisplaySearchBoxFlyout(status) {
  return {
    type: MY_MARKETS_SET_DISPLAY_SEARCHBOX_FLYOUT,
    status,
  };
}


export function myMarketsListResetFlyoutSearchBoxData() {
  return {
    type: MY_MARKETS_LIST_RESET_FLYOUT_SEARCH_BOX_DATA,
  };
}

export function myMarketsPutUnderlying(url) {
  return {
    type: MY_MARKETS_PUT_UNDERLYING,
    url,
  };
}

export function myMarketsGotPutUnderlying(data, failure) {
  return {
    type: MY_MARKETS_GOT_PUT_UNDERLYING,
    data,
    failure,
  };
}

export function myMarketsDeleteUnderlying(underlyingData) {
  return {
    type: MY_MARKETS_DELETE_UNDERLYING,
    underlyingData,
  };
}

export function myMarketsGotDeleteUnderlying(removedUnderlying, failure) {
  return {
    type: MY_MARKETS_GOT_DELETE_UNDERLYING,
    removedUnderlying,
    failure,
  };
}
export function myMarketsWillUnmount() {
  return {
    type: MY_MARKETS_WILL_UNMOUNT,
  };
}

export function myMarketsSetActiveUnderlying(underlyingData) {
  return {
    type: MY_MARKETS_SET_ACTIVE_UNDERLYING,
    underlyingData,
  };
}

export function myMarketsSetActiveChartTimespan(timespan) {
  return {
    type: MY_MARKETS_SET_ACTIVE_CHART_TIME_SPAN,
    timespan,
  };
}
