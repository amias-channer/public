import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import { marketMembersFetchContent, marketMembersWillUnmount } from './actions';
import { DESKTOP_MODE, MOBILE_MODE, TABLET_MODE } from '../../../utils/responsive';
import MarketInstrumentTableMobileLiveSortingComp from '../MarketInstrumentTable/MarketInstrumentTableMobileLiveSorting';
import mediaQueries from '../../../utils/mediaQueries';
import { generateUniqId } from '../../../utils/utils';
import Annotations from '../../ProductDetail/Annotations';
import MarketInstrumentTableLiveSortingComp from '../MarketInstrumentTable/MarketInstrumentTableLiveSorting';

const columns = {
  default: [
    {
      columnKey: 'name',
    }, {
      columnKey: 'price',
      superScriptText: '1',
      style: { textAlign: 'right' },
    }, {
      columnKey: 'change2PreviousClose',
      style: { textAlign: 'right' },
    }, {
      columnKey: 'change2PreviousClosePercent',
    }, {
      columnKey: 'lastChange',
    },
  ],
  [TABLET_MODE]: [
    {
      columnKey: 'name',
    }, {
      columnKey: 'price',
    },
    [
      {
        columnKey: 'change2PreviousClose',
        style: { textAlign: 'right' },
      }, {
        columnKey: 'change2PreviousClosePercent',
      },
    ],
    {
      columnKey: 'lastChange',
      style: { textAlign: 'right' },
    },
  ],
  [MOBILE_MODE]: [
    {
      columnKey: 'price',
    }, {
      columnKey: 'change2PreviousClose',
    }, {
      columnKey: 'change2PreviousClosePercent',
    }, {
      columnKey: 'lastChange',
    },
  ],
};

export class MarketMembersTableComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    dispatch(marketMembersFetchContent());
  }

  componentDidUpdate(prevProps) {
    const { dispatch, location } = this.props;
    const { search } = prevProps.location;
    if (prevProps.location && search && location.search && location.search !== search) {
      dispatch(marketMembersWillUnmount());
      dispatch(marketMembersFetchContent());
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(marketMembersWillUnmount());
  }

  render() {
    const {
      isLoading, marketData, responsiveMode, className, pageTitle,
    } = this.props;
    const parentTrackingName = pageTitle;
    return (
      <div className={classNames('MarketMembersTable col-lg', className)}>
        {isLoading && (
          <div className="mt-5 is-loading" />
        )}
        {isLoading === false && (
          <div className="table-responsive">
            <MediaQuery query={mediaQueries.mobileOnly}>
              <MarketInstrumentTableMobileLiveSortingComp
                tableUniqKey={generateUniqId()}
                marketInstrumentTableData={marketData}
                columns={columns[MOBILE_MODE]}
                className="MarketInstrumentTableMobile"
                parentTrackingName={parentTrackingName}
                isFirstTableRowSticky
              />
            </MediaQuery>

            <MediaQuery query={mediaQueries.tablet}>
              <MarketInstrumentTableLiveSortingComp
                tableUniqKey={generateUniqId()}
                marketInstrumentTableData={marketData}
                columns={columns[responsiveMode] ? columns[responsiveMode] : columns.default}
                className="MarketInstrumentTable"
                parentTrackingName={parentTrackingName}
                isFirstTableRowSticky
              />
            </MediaQuery>
            {marketData && marketData.priceSource && (
              <Annotations annotations={{ 1: marketData.priceSource }} />
            )}
          </div>
        )}
      </div>
    );
  }
}

MarketMembersTableComponent.propTypes = {
  marketData: PropTypes.objectOf(PropTypes.any),
  isLoading: PropTypes.bool,
  dispatch: PropTypes.func,
  responsiveMode: PropTypes.string,
  location: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  pageTitle: PropTypes.string,
};

MarketMembersTableComponent.defaultProps = {
  marketData: {},
  isLoading: true,
  dispatch: () => {},
  responsiveMode: DESKTOP_MODE,
  location: {},
  className: '',
  pageTitle: '',
};

export const MarketInstrumentTableMapStateToProps = (state) => ({
  isLoading: state.marketMembers.isLoading,
  marketData: state.marketMembers.data,
  responsiveMode: state.global.responsiveMode,
  pageTitle: pathOr('', ['global', 'navigationItemData', 'pageTitle'], state),
});

const MarketMembersTable = connect(
  MarketInstrumentTableMapStateToProps,
)(MarketMembersTableComponent);
export default MarketMembersTable;
