export const MARKET_GENERIC_FETCH_CONTENT = 'MarketGenericLayout/MARKET_GENERIC_PAGE_FETCH_CONTENT';
export const MARKET_GENERIC_GOT_CONTENT = 'MarketGenericLayout/MARKET_GENERIC_PAGE_GOT_CONTENT';
export const MARKET_GENERIC_SET_ACTIVE_GROUP = 'MarketGenericLayout/MARKET_GENERIC_SET_ACTIVE_GROUP';
export const MARKET_GENERIC_WILL_UNMOUNT = 'MarketGenericLayout/MARKET_GENERIC_PAGE_WILL_UNMOUNT';
export const MARKET_GENERIC_FETCH_SORTED_TABLE_DATA = 'MarketGenericLayout/MARKET_GENERIC_FETCH_SORTED_TABLE_DATA';
export const MARKET_GENERIC_GOT_SORTED_TABLE_DATA = 'MarketGenericLayout/MARKET_GENERIC_GOT_SORTED_TABLE_DATA';
export const MARKET_GENERIC_SET_ACTIVE_CHART_TIME_SPAN = 'MarketGenericLayout/MARKET_GENERIC_SET_ACTIVE_CHART_TIME_SPAN';

export function marketGenericFetchContent(instrument, stateName) {
  return {
    type: MARKET_GENERIC_FETCH_CONTENT,
    instrument,
    stateName,
  };
}

export function marketGenericGotContent(instrument, data) {
  return {
    type: MARKET_GENERIC_GOT_CONTENT,
    instrument,
    data,
  };
}
export function marketGenericWillUnmount() {
  return {
    type: MARKET_GENERIC_WILL_UNMOUNT,
  };
}

export function marketGenericSetActiveGroup(group) {
  return {
    type: MARKET_GENERIC_SET_ACTIVE_GROUP,
    group,
  };
}

export function marketGenericFetchSortedTableData(sortBy, sortDirection, stateName) {
  return {
    type: MARKET_GENERIC_FETCH_SORTED_TABLE_DATA,
    sortBy,
    sortDirection,
    stateName,
  };
}

export function marketGenericGotSortedTableData(data) {
  return {
    type: MARKET_GENERIC_GOT_SORTED_TABLE_DATA,
    data,
  };
}

export function marketGenericSetActiveChartTimespan(timespan) {
  return {
    type: MARKET_GENERIC_SET_ACTIVE_CHART_TIME_SPAN,
    timespan,
  };
}
