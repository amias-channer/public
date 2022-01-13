export const MARKET_INSTRUMENT_TABLE_WILL_UNMOUNT = 'MarketInstrumentTable/MARKET_INSTRUMENT_TABLE_WILL_UNMOUNT';

export const MARKET_INSTRUMENT_TABLE_FETCH_INSTRUMENT_DETAILS = 'MarketInstrumentTable/MARKET_INSTRUMENT_TABLE_FETCH_INSTRUMENT_DETAILS';
export const MARKET_INSTRUMENT_TABLE_GOT_INSTRUMENT_DETAILS = 'MarketInstrumentTable/MARKET_INSTRUMENT_TABLE_GOT_INSTRUMENT_DETAILS';
export const MARKET_INSTRUMENT_TABLE_DETAILS_WILL_UNMOUNT = 'MarketInstrumentTable/MARKET_INSTRUMENT_TABLE_DETAILS_WILL_UNMOUNT';
export const MARKET_INSTRUMENT_TABLE_DETAILS_HIDE = 'MarketInstrumentTable/MARKET_INSTRUMENT_TABLE_DETAILS_HIDE';

export const MARKET_INSTRUMENT_TABLE_SET_INSTRUMENT_ACTIVE_GROUP = 'MarketInstrumentTable/MARKET_INSTRUMENT_TABLE_SET_INSTRUMENT_ACTIVE_GROUP';

export const MARKET_INSTRUMENT_TABLE_SET_CHART_TIMESPAN = 'MarketInstrumentTable/MARKET_INSTRUMENT_TABLE_SET_CHART_TIMESPAN';

export function marketInstrumentTableWillUnmount(tableUniqKey) {
  return {
    type: MARKET_INSTRUMENT_TABLE_WILL_UNMOUNT,
    tableUniqKey,
  };
}

export function marketInstrumentTableFetchInstrumentDetails(
  tableUniqKey, instrument, trackingData,
) {
  return {
    type: MARKET_INSTRUMENT_TABLE_FETCH_INSTRUMENT_DETAILS,
    tableUniqKey,
    instrument,
    trackingData,
  };
}

export function marketInstrumentTableGotInstrumentDetails(tableUniqKey, instrument, data) {
  return {
    type: MARKET_INSTRUMENT_TABLE_GOT_INSTRUMENT_DETAILS,
    tableUniqKey,
    instrument,
    data,
  };
}
export function marketInstrumentTableDetailsWillUnmount(tableUniqKey) {
  return {
    type: MARKET_INSTRUMENT_TABLE_DETAILS_WILL_UNMOUNT,
    tableUniqKey,
  };
}
export function marketInstrumentTableDetailsHide(tableUniqKey, instrument) {
  return {
    type: MARKET_INSTRUMENT_TABLE_DETAILS_HIDE,
    tableUniqKey,
    instrument,
  };
}

export function marketInstrumentTableSetActiveGroup(tableUniqKey, instrument, group) {
  return {
    type: MARKET_INSTRUMENT_TABLE_SET_INSTRUMENT_ACTIVE_GROUP,
    tableUniqKey,
    instrument,
    group,
  };
}

export function marketInstrumentTableSetChartTimeSpan(tableUniqKey, instrument, timespan) {
  return {
    type: MARKET_INSTRUMENT_TABLE_SET_CHART_TIMESPAN,
    instrument,
    tableUniqKey,
    timespan,
  };
}
