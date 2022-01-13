import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { produce } from 'immer';
import MarketRealTimeIndications, { MARKET_INDICATIONS_DISPLAY_MODE } from '../MarketRealTimeIndications';
import {
  marketGenericFetchContent,
  marketGenericSetActiveGroup,
  marketGenericWillUnmount,
  marketGenericFetchSortedTableData, marketGenericSetActiveChartTimespan,
} from './actions';
import MarketInstrumentDetailsComp from '../MarketInstrumentDetails';
import { DESKTOP_MODE, MOBILE_MODE, NOTEBOOK_MODE } from '../../../utils/responsive';
import { generateUniqId, inverseSortDirection, SORT_ASC } from '../../../utils/utils';
import MarketGenericInstrumentTable from './MarketGenericInstrumentTable';
import mediaQueries from '../../../utils/mediaQueries';
import './MarketGenericLayout.scss';
import MarketGenericInstrumentTableMobile from './MarketGenericInstrumentTable/MarketGenericInstrumentTableMobile';

const columns = {
  default: [
    {
      columnKey: 'name',
    },
    {
      columnKey: 'price',
    },
    {
      columnKey: 'change2PreviousClose',
      style: { textAlign: 'right' },
    },
    {
      columnKey: 'change2PreviousClosePercent',
    },
    {
      columnKey: 'lastChange',
      style: { textAlign: 'right' },
    },
    {
      columnKey: 'productLink',
      columnText: '', // this overrides the default columnKey text
      columnClass: 'flyout-td',
    },
  ],
  [NOTEBOOK_MODE]: [
    {
      columnKey: 'name',
    },
    {
      columnKey: 'price',
    },
    [
      {
        columnKey: 'change2PreviousClose',
        style: { textAlign: 'right' },
      },
      {
        columnKey: 'change2PreviousClosePercent',
      },
    ],
    {
      columnKey: 'lastChange',
      style: { textAlign: 'right' },
    },
    {
      columnKey: 'productLink',
      columnText: '', // this overrides the default columnKey text
    },
  ],
  [MOBILE_MODE]: [
    {
      columnKey: 'price',
    },
    {
      columnKey: 'change2PreviousClose',
    },
    {
      columnKey: 'change2PreviousClosePercent',
    },
    {
      columnKey: 'lastChange',
    },
  ],
};
const DEFAULT_SORT_COLUMN = {
  name: SORT_ASC,
};

export class MarketGenericLayoutComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch, stateName } = props;
    this.state = {
      sortedByColumn: DEFAULT_SORT_COLUMN,
    };
    dispatch(marketGenericFetchContent(null, stateName));
    this.onActiveGroupChange = this.onActiveGroupChange.bind(this);
    this.fetchSortedTableData = this.fetchSortedTableData.bind(this);
    this.toggleChartTimespan = this.toggleChartTimespan.bind(this);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(marketGenericWillUnmount());
  }

  onActiveGroupChange(e) {
    const { marketGeneric, dispatch } = this.props;
    const groupName = e.currentTarget.textContent;
    if (marketGeneric && marketGeneric.activeGroup === groupName) {
      return;
    }
    dispatch(marketGenericSetActiveGroup(groupName));
  }

  fetchSortedTableData(sortBy, sortDirection) {
    const { dispatch, stateName } = this.props;
    dispatch(marketGenericFetchSortedTableData(sortBy, sortDirection, stateName));
    const sortData = {};
    sortData[sortBy] = inverseSortDirection(sortDirection);
    this.setState(produce((draft) => {
      draft.sortedByColumn = sortData;
    }));
  }

  toggleChartTimespan(timespan) {
    const { dispatch } = this.props;
    dispatch(marketGenericSetActiveChartTimespan(timespan));
  }

  render() {
    const {
      marketGeneric, dispatch, stateName, responsiveMode,
    } = this.props;
    const { sortedByColumn } = this.state;
    return (
      <div className="MarketGenericLayout col-lg">
        {marketGeneric.tiles && (
        <MarketRealTimeIndications
          tiles={marketGeneric.tiles}
          activeInstrument={marketGeneric.activeInstrument}
          dispatch={dispatch}
          marketPageStateName={stateName}
          displayMode={MARKET_INDICATIONS_DISPLAY_MODE.WITH_CHART}
        />
        )}

        {marketGeneric.isLoading && (
          <div className="mt-5 is-loading" />
        )}

        <MarketInstrumentDetailsComp
          instrument={marketGeneric.activeInstrument}
          instrumentDetails={marketGeneric}
          onActiveGroupChange={this.onActiveGroupChange}
          responsiveMode={responsiveMode}
          toggleChartTimespan={this.toggleChartTimespan}
          chartTimespan={marketGeneric.chartTimeSpan}
        />

        {marketGeneric.columnsToRender && marketGeneric.rows && (
          <>
            <MediaQuery query={mediaQueries.mobileTabletOnly}>
              <MarketGenericInstrumentTableMobile
                tableUniqKey={generateUniqId()}
                marketInstrumentTableData={marketGeneric}
                columns={columns[MOBILE_MODE]}
                className="MarketGenericInstrumentTableMobile"
              />
            </MediaQuery>
            <MediaQuery query={mediaQueries.notebook}>
              {marketGeneric.tableTitle && (
              <h2>{marketGeneric.tableTitle}</h2>
              )}
              <MarketGenericInstrumentTable
                tableUniqKey={generateUniqId()}
                marketInstrumentTableData={marketGeneric}
                columns={columns[responsiveMode] ? columns[responsiveMode] : columns.default}
                onTableSort={this.fetchSortedTableData}
                sortedByColumn={sortedByColumn}
                isLoading={marketGeneric.tableIsLoading}
              />
            </MediaQuery>
          </>
        )}
      </div>
    );
  }
}

MarketGenericLayoutComponent.propTypes = {
  marketGeneric: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  stateName: PropTypes.string,
  responsiveMode: PropTypes.string,
  tableTitle: PropTypes.string,
};

MarketGenericLayoutComponent.defaultProps = {
  marketGeneric: {
    chartUrl: null,
  },
  dispatch: () => {},
  stateName: '',
  responsiveMode: DESKTOP_MODE,
  tableTitle: '',
};

const mapStateToProps = (state) => ({
  marketGeneric: state.marketGeneric,
  responsiveMode: state.global.responsiveMode,
});

const MarketGenericLayout = connect(mapStateToProps)(MarketGenericLayoutComponent);
export default MarketGenericLayout;
