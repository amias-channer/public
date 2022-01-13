import { produce } from 'immer';
import {
  MARKET_INSTRUMENT_TABLE_DETAILS_HIDE,
  MARKET_INSTRUMENT_TABLE_DETAILS_WILL_UNMOUNT,
  MARKET_INSTRUMENT_TABLE_FETCH_INSTRUMENT_DETAILS,
  MARKET_INSTRUMENT_TABLE_GOT_INSTRUMENT_DETAILS,
  MARKET_INSTRUMENT_TABLE_WILL_UNMOUNT,
  MARKET_INSTRUMENT_TABLE_SET_INSTRUMENT_ACTIVE_GROUP,
  MARKET_INSTRUMENT_TABLE_SET_CHART_TIMESPAN,
} from './actions';
import { MARKET_INSTRUMENT_IDENTIFIER } from '../MarketGenericLayout/MarketGenericLayout.helper';
import { TIMESPAN_5Y } from '../../Chart/Chart.helper';

const getTableByUniqKey = (draft, tableUniqKey) => {
  if (draft && tableUniqKey && draft[tableUniqKey]) {
    return draft[tableUniqKey];
  }
  return undefined;
};
export const initialState = {};
const marketInstrumentTableReducer = (state = initialState, action) => produce(state, (draft) => {
  const table = getTableByUniqKey(draft, action.tableUniqKey);
  switch (action.type) {
    case MARKET_INSTRUMENT_TABLE_WILL_UNMOUNT:
      if (table) {
        delete draft[action.tableUniqKey];
      }
      break;
    case MARKET_INSTRUMENT_TABLE_FETCH_INSTRUMENT_DETAILS:
      if (action.instrument && action.tableUniqKey) {
        draft[action.tableUniqKey] = {
          instrumentDetails: {
            [action.instrument[MARKET_INSTRUMENT_IDENTIFIER]]: {
              isLoading: true,
            },
          },
        };
      }
      break;
    case MARKET_INSTRUMENT_TABLE_GOT_INSTRUMENT_DETAILS:
      if (action.instrument && action.tableUniqKey) {
        draft[action.tableUniqKey] = {
          instrumentDetails: {
            [action.instrument[MARKET_INSTRUMENT_IDENTIFIER]]: {
              isLoading: false,
              data: { ...action.data, chartTimespan: TIMESPAN_5Y },
            },
          },
        };
      }
      break;
    case MARKET_INSTRUMENT_TABLE_DETAILS_WILL_UNMOUNT:
    case MARKET_INSTRUMENT_TABLE_DETAILS_HIDE:
      if (action.instrument
        && action.instrument[MARKET_INSTRUMENT_IDENTIFIER]
        && table
        && table.instrumentDetails
        && table.instrumentDetails[
          action.instrument[MARKET_INSTRUMENT_IDENTIFIER]
        ]) {
        delete draft[action.tableUniqKey].instrumentDetails[
          action.instrument[MARKET_INSTRUMENT_IDENTIFIER]
        ];
      } else if (table && table.instrumentDetails) {
        draft[action.tableUniqKey].instrumentDetails = {};
      } else {
        return initialState;
      }
      break;
    case MARKET_INSTRUMENT_TABLE_SET_INSTRUMENT_ACTIVE_GROUP:
      if (action.instrument
          && action.group
          && action.tableUniqKey
          && table
          && table.instrumentDetails
          && table.instrumentDetails[action.instrument[MARKET_INSTRUMENT_IDENTIFIER]]
          && table.instrumentDetails[action.instrument[MARKET_INSTRUMENT_IDENTIFIER]].data
      ) {
        draft[action.tableUniqKey].instrumentDetails[
          action.instrument[MARKET_INSTRUMENT_IDENTIFIER]
        ].data.activeGroup = action.group;
      }
      break;
    case MARKET_INSTRUMENT_TABLE_SET_CHART_TIMESPAN:
      if (action.tableUniqKey
        && action.timespan
        && draft[action.tableUniqKey]
        && draft[action.tableUniqKey].instrumentDetails
        // eslint-disable-next-line max-len
        && draft[action.tableUniqKey].instrumentDetails[action.instrument[MARKET_INSTRUMENT_IDENTIFIER]]
        // eslint-disable-next-line max-len
        && draft[action.tableUniqKey].instrumentDetails[action.instrument[MARKET_INSTRUMENT_IDENTIFIER]].data) {
        // eslint-disable-next-line max-len
        draft[action.tableUniqKey].instrumentDetails[action.instrument[MARKET_INSTRUMENT_IDENTIFIER]].data.chartTimespan = action.timespan;
      }
      break;
    default:
      break;
  }
});

export default marketInstrumentTableReducer;
