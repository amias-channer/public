import React, { createRef } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { replace } from 'ramda';
import Logger from '../../../../utils/logger';
import PushableDefault from '../../../PushManager/PushableDefault';
import { MARKET_INSTRUMENT_IDENTIFIER } from '../../MarketGenericLayout/MarketGenericLayout.helper';
import PushablePercentWithBar from '../../../PushManager/PushablePercentWithBar';
import PushableTimestamp from '../../../PushManager/PushableTimestamp';
import PushableChangeAbsolute from '../../../PushManager/PushableChangeAbsolute';
import PushableChangePercent from '../../../PushManager/PushableChangePercent';
import { DESKTOP_MODE, MOBILE_MODE } from '../../../../utils/responsive';
import MarketInstrumentDetailsComp from '../../MarketInstrumentDetails';
import {
  marketInstrumentTableDetailsHide,
  marketInstrumentTableDetailsWillUnmount,
  marketInstrumentTableFetchInstrumentDetails,
  marketInstrumentTableSetActiveGroup, marketInstrumentTableSetChartTimeSpan,
} from '../actions';
import { generateUniqId } from '../../../../utils/utils';

const getPriceField = (instrument) => ({ valor: instrument.valor, ...instrument.price });
const getAbsoluteField = (instrument) => ({
  ...instrument.price,
  value: instrument.change2PreviousClose,
  valor: instrument.valor,
});
const getPercentField = (instrument) => ({
  ...instrument.price,
  valor: instrument.valor,
});
const getLastChangeField = (instrument) => ({ valor: instrument.valor, ...instrument.lastChange });

export class MarketInstrumentRowComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.toggleInstrument = this.toggleInstrument.bind(this);
    this.onActiveGroupChange = this.onActiveGroupChange.bind(this);
    this.toggleChartTimespan = this.toggleChartTimespan.bind(this);
    this.ref = createRef();
  }

  componentDidUpdate(prevProps) {
    const { instrumentDetails, instrument } = this.props;

    if (instrumentDetails
        && !instrumentDetails.isLoading
        && instrument
        && instrument[MARKET_INSTRUMENT_IDENTIFIER]
        && instrument[MARKET_INSTRUMENT_IDENTIFIER]
        === prevProps.instrument[MARKET_INSTRUMENT_IDENTIFIER]) {
      return;
    }
    if (this.ref && instrumentDetails) {
      try {
        this.ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } catch (e) {
        Logger.warn('MARKET_INSTRUMENT_TABLE_ROW', 'Unable to scroll to clicked row', e);
      }
    }
  }

  componentWillUnmount() {
    const { dispatch, tableUniqKey } = this.props;
    dispatch(marketInstrumentTableDetailsWillUnmount(tableUniqKey));
  }

  onActiveGroupChange(e) {
    const {
      instrument, instrumentDetails, dispatch, tableUniqKey,
    } = this.props;
    const groupName = e.currentTarget.textContent;
    if (instrumentDetails && instrumentDetails.data.activeGroup === groupName) {
      return;
    }
    dispatch(marketInstrumentTableSetActiveGroup(tableUniqKey, {
      [MARKET_INSTRUMENT_IDENTIFIER]: instrument[MARKET_INSTRUMENT_IDENTIFIER],
    }, groupName));
  }

  getPrice() {
    const { instrument } = this.props;
    return (<PushableDefault identifierProperty="valor" field={getPriceField(instrument)} />);
  }

  getChange2PreviousClose() {
    const { instrument } = this.props;
    return (
      <PushableChangeAbsolute
        identifierProperty="valor"
        field={getAbsoluteField(instrument)}
      />
    );
  }

  getChange2PreviousClosePercent(responsiveMode) {
    const { instrument, maxForPercentCalc } = this.props;

    if (responsiveMode === MOBILE_MODE) {
      return (
        <PushableChangePercent
          identifierProperty="valor"
          field={getPercentField(instrument)}
          maxForPercentCalc={maxForPercentCalc}
        />
      );
    }

    return (
      <PushablePercentWithBar
        identifierProperty="valor"
        field={getPercentField(instrument)}
        maxForPercentCalc={maxForPercentCalc}
      />
    );
  }

  getLastChange() {
    const { instrument } = this.props;
    return (
      <PushableTimestamp
        identifierProperty="valor"
        field={getLastChangeField(instrument)}
        showInitialValue
      />
    );
  }

  getColumnsContentConfig() {
    const { instrument } = this.props;
    return {
      default: {
        name: instrument.name,
        price: this.getPrice(),
        change2PreviousClose: this.getChange2PreviousClose(),
        change2PreviousClosePercent: this.getChange2PreviousClosePercent(),
        lastChange: this.getLastChange(),
      },
      [MOBILE_MODE]: {
        change2PreviousClosePercent: this.getChange2PreviousClosePercent(MOBILE_MODE),
      },
    };
  }

  getColumnContent(columnKey) {
    const { responsiveMode } = this.props;
    const columnsContent = this.getColumnsContentConfig();

    if (responsiveMode && columnsContent[responsiveMode]) {
      if (columnKey in columnsContent[responsiveMode]) {
        return columnsContent[responsiveMode][columnKey];
      }
    }
    if (columnsContent.default && (columnKey in columnsContent.default)) {
      return columnsContent.default[columnKey];
    }
    return (`Column '${columnKey}' do not have configured content in default Layout`);
  }

  getColumnsContent(columns) {
    if (columns && columns.length) {
      return columns.map((col) => {
        if (col && Array.isArray(col) && col.length) {
          return (
            <td key={col[0].columnKey} className={classNames(col[0].columnClass)}>
              {col.map((c) => (
                <div key={c.columnKey} style={c.style}>
                  { this.getColumnContent(c.columnKey)}
                </div>
              ))}
            </td>
          );
        }
        return (
          <td key={col.columnKey} className={classNames(col.columnClass)}>
            <div style={col.style}>{this.getColumnContent(col.columnKey)}</div>
          </td>
        );
      });
    }
    return null;
  }

  getRowContent() {
    const {
      instrument, instrumentDetails, columns, responsiveMode,
    } = this.props;
    const chartTimespan = instrumentDetails && instrumentDetails.data ? instrumentDetails.data.chartTimespan : '';
    return (
      <>
        <tr
          onClick={this.toggleInstrument}
          ref={this.ref}
          className={classNames('clickable', instrumentDetails ? 'open' : '')}
          key={generateUniqId()}
        >
          {this.getColumnsContent(columns)}
        </tr>
        {instrumentDetails && (
        <tr className="instrument-table-details">
          <td colSpan={columns && columns.length ? columns.length : 1}>
            {instrumentDetails.isLoading && (
            <div className="mt-n4 is-loading" />
            )}

            <MarketInstrumentDetailsComp
              instrument={instrument}
              instrumentDetails={instrumentDetails.data ? instrumentDetails.data : {}}
              onActiveGroupChange={this.onActiveGroupChange}
              responsiveMode={responsiveMode}
              toggleChartTimespan={this.toggleChartTimespan}
              chartTimespan={chartTimespan}
            />
          </td>
        </tr>
        )}
      </>
    );
  }

  toggleInstrument() {
    const {
      instrument, instrumentDetails, dispatch, tableUniqKey, parentTrackingName,
    } = this.props;
    if (instrumentDetails) {
      dispatch(marketInstrumentTableDetailsHide(tableUniqKey, instrument));
    } else {
      dispatch(marketInstrumentTableDetailsHide(tableUniqKey));
      dispatch(marketInstrumentTableFetchInstrumentDetails(tableUniqKey, instrument, {
        text: replace('*', '', instrument.name),
        parent: parentTrackingName,
      }));
    }
  }

  toggleChartTimespan(timespan) {
    const { dispatch, tableUniqKey, instrument } = this.props;
    dispatch(marketInstrumentTableSetChartTimeSpan(tableUniqKey, instrument, timespan));
  }

  render() {
    return (
      <>
        {this.getRowContent()}
      </>
    );
  }
}

MarketInstrumentRowComponent.propTypes = {
  instrumentDetails: PropTypes.objectOf(PropTypes.any),
  instrument: PropTypes.objectOf(PropTypes.any).isRequired,
  columns: PropTypes.arrayOf(PropTypes.any),
  maxForPercentCalc: PropTypes.number,
  dispatch: PropTypes.func,
  responsiveMode: PropTypes.string,
  parentTrackingName: PropTypes.string,
  tableUniqKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};
MarketInstrumentRowComponent.defaultProps = {
  parentTrackingName: '',
  instrumentDetails: null,
  columns: null,
  maxForPercentCalc: undefined,
  dispatch: () => {},
  responsiveMode: DESKTOP_MODE,
};
const getInstrumentDetailsFromStore = (state, ownProps) => {
  if (
    ownProps.instrument
    && ownProps.tableUniqKey
    && ownProps.instrument[MARKET_INSTRUMENT_IDENTIFIER]
    && state.marketInstrumentTable
    && state.marketInstrumentTable[ownProps.tableUniqKey]
    && state.marketInstrumentTable[ownProps.tableUniqKey].instrumentDetails
    && state.marketInstrumentTable[ownProps.tableUniqKey].instrumentDetails[
      ownProps.instrument[MARKET_INSTRUMENT_IDENTIFIER]
    ]
  ) {
    return state.marketInstrumentTable[ownProps.tableUniqKey].instrumentDetails[
      ownProps.instrument[MARKET_INSTRUMENT_IDENTIFIER]
    ];
  }
  return null;
};
export const MarketInstrumentRowMapStateToProps = (state, ownProps) => ({
  instrumentDetails: getInstrumentDetailsFromStore(state, ownProps),
  responsiveMode: state.global.responsiveMode,
});
const MarketInstrumentRow = connect(
  MarketInstrumentRowMapStateToProps,
)(MarketInstrumentRowComponent);

export default MarketInstrumentRow;
