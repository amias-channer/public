import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import uuid from 'boundless-utils-uuid';
import { connect, batch } from 'react-redux';
import ProductExpandableTileComp from '../../ProductExpandableTile';
import {
  myWatchListFetchData,
  myWatchListGetSearchResults,
  myWatchListGetSortedList,
  myWatchListProductTileEditableFieldChange,
  myWatchListProductTileToggleNotificationAlert,
  myWatchListRemoveProduct,
  myWatchListResetAddProductPopup, myWatchListResetFlyoutSearchBoxData,
  myWatchListSetDisplaySearchboxFlyout,
  myWatchListUnmounted,
} from './actions';
import {
  getProductTilesList,
  getSortDirection,
  MY_WATCHLIST_API_GET_PRODUCT_ASK_PRICE_ENDPOINT,
  MY_WATCHLIST_API_GET_PRODUCTS_ENDPOINT,
  MY_WATCHLIST_PRODUCT_SEARCH_URL,
  shouldGetTilesWithoutGroups,
} from './MyWatchList.helper';
import { MOBILE_MODE, TABLET_MODE } from '../../../utils/responsive';
import i18n from '../../../utils/i18n';
import ButtonFlyoutSearchBox from '../../ButtonFlyoutSearchBox';
import ToolsBar from '../../ToolsBar';
import AddProductPopup from '../../WatchlistAddProductPopup';
import SortingControls from './SortingControls';
import SetAlertNotificationPopup from './SetAlertNotificationPopup';
import withAuth from '../../Authentication/withAuth';
import { SEARCH_LIST_DISPLAY_PRODUCTS } from '../../FlyoutSearchBox/SearchList';
import './MyWatchList.scss';
import { ALERT_TYPE } from '../../Alert/Alert.helper';
import Alert from '../../Alert';
import {
  myWatchListGetAskPriceForProduct,
  myWatchListToggleAddProductPopup,
} from '../../WatchlistAddProductPopup/actions';
import HtmlText from '../../HtmlText';

export class MyWatchList extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.onSearch = this.onSearch.bind(this);
    this.onSearchListItemClick = this.onSearchListItemClick.bind(this);
    this.onToggleAddProductPopup = this.onToggleAddProductPopup.bind(this);
    this.setDisplaySearchboxFlyout = this.setDisplaySearchboxFlyout.bind(this);
    this.onRemoveProduct = this.onRemoveProduct.bind(this);
    this.onWatchListSort = this.onWatchListSort.bind(this);
    this.onSetupNotificationAlert = this.onSetupNotificationAlert.bind(this);
    this.onToggleNotificationAlert = this.onToggleNotificationAlert.bind(this);
    this.onWatchlistProductAdded = this.onWatchlistProductAdded.bind(this);
    this.onClickOutsideFlyoutSearchBox = this.onClickOutsideFlyoutSearchBox.bind(this);
    this.onProductRemoveSuccess = this.onProductRemoveSuccess.bind(this);
    dispatch(myWatchListFetchData(MY_WATCHLIST_API_GET_PRODUCTS_ENDPOINT));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(myWatchListUnmounted());
  }

  onSearch(searchText) {
    const { dispatch } = this.props;
    dispatch(myWatchListGetSearchResults(MY_WATCHLIST_PRODUCT_SEARCH_URL, searchText));
  }

  onSearchListItemClick(productData) {
    const { dispatch } = this.props;
    batch(() => {
      dispatch(myWatchListGetAskPriceForProduct(
        MY_WATCHLIST_API_GET_PRODUCT_ASK_PRICE_ENDPOINT,
        productData,
      ));
      dispatch(myWatchListSetDisplaySearchboxFlyout(false));
      dispatch(myWatchListToggleAddProductPopup());
      dispatch(myWatchListResetFlyoutSearchBoxData());
    });
  }

  onRemoveProduct(url) {
    const { dispatch } = this.props;
    dispatch(myWatchListRemoveProduct(url, this.onProductRemoveSuccess));
  }

  onProductRemoveSuccess() {
    const { dispatch, watchlistSortDirection, watchlistSortedBy } = this.props;
    dispatch(myWatchListGetSortedList(
      MY_WATCHLIST_API_GET_PRODUCTS_ENDPOINT,
      watchlistSortedBy,
      watchlistSortDirection,
    ));
  }

  onWatchListSort(sortBy) {
    const { dispatch, watchlistSortDirection } = this.props;
    const sortDirection = getSortDirection(watchlistSortDirection);
    dispatch(myWatchListGetSortedList(
      MY_WATCHLIST_API_GET_PRODUCTS_ENDPOINT,
      sortBy,
      sortDirection,
    ));
  }

  onSetupNotificationAlert(isin) {
    const { dispatch } = this.props;
    dispatch(myWatchListProductTileToggleNotificationAlert(isin));
  }

  onToggleNotificationAlert(isin) {
    const { dispatch } = this.props;
    dispatch(myWatchListProductTileToggleNotificationAlert(isin));
  }

  onToggleAddProductPopup() {
    const { dispatch } = this.props;
    dispatch(myWatchListToggleAddProductPopup());
  }

  onWatchlistProductAdded() {
    const { dispatch, watchlistSortDirection, watchlistSortedBy } = this.props;
    batch(() => {
      dispatch(myWatchListToggleAddProductPopup());
      dispatch(myWatchListResetAddProductPopup());
      dispatch(myWatchListGetSortedList(
        MY_WATCHLIST_API_GET_PRODUCTS_ENDPOINT,
        watchlistSortedBy,
        watchlistSortDirection,
      ));
    });
  }

  onClickOutsideFlyoutSearchBox() {
    const { dispatch } = this.props;
    dispatch(myWatchListResetFlyoutSearchBoxData());
  }

  getProductTiles() {
    const { data } = this.props;
    const productTilesData = getProductTilesList(data);
    if (!productTilesData) {
      return null;
    }

    if (shouldGetTilesWithoutGroups(productTilesData)) {
      const tiles = productTilesData.map(
        (tileData, index) => this.getProductTile(index, tileData),
      );
      return (<Row>{tiles}</Row>);
    }
    return this.getProductGroupsWithTiles(productTilesData);
  }

  getProductGroupsWithTiles(data) {
    return Object.keys(data).map(
      (productGroup) => (
        <Fragment key={productGroup}>
          <Row className="product-group-tiles-row">
            <div className="col">
              <h2>{productGroup}</h2>
            </div>
          </Row>
          <Row>
            {this.getProductTilesForGroup(productGroup)}
          </Row>
        </Fragment>
      ),
    );
  }

  getProductTilesForGroup(productGroup) {
    const { data } = this.props;
    const productExpandableTilesData = getProductTilesList(data);
    return productExpandableTilesData[productGroup].map(
      (groupTile, index) => this.getProductTile(index, groupTile),
    );
  }

  setDisplaySearchboxFlyout(status) {
    const { dispatch } = this.props;
    dispatch(myWatchListSetDisplaySearchboxFlyout(status));
  }

  getProductTile(index, data) {
    const { isMobileMode } = this.props;
    return (
      <ProductExpandableTileComp
        key={data.isin || uuid()}
        isMobileMode={isMobileMode}
        data={data}
        className="col-sm-12 col-lg-6"
        indexInList={index}
        onRemoveProduct={this.onRemoveProduct}
        onSetupNotificationAlert={this.onSetupNotificationAlert}
        onEditableFieldChangeAction={myWatchListProductTileEditableFieldChange}
      />
    );
  }

  render() {
    const {
      searchData, addProductPopup, flyoutSearchBox, watchlistSortedBy,
      watchlistSortDirection, isSearchLoading, notificationAlertPopup,
      isLoading, isMobileTabletMode, isBackendError,
    } = this.props;
    return (
      <div className="MyWatchList">
        <h2 className="section-title">{i18n.t('My Watchlist')}</h2>
        <div className="section-tools">
          <Row>
            <div className="col-auto col-sm-12 col-md-auto">
              <ButtonFlyoutSearchBox
                onSearch={this.onSearch}
                searchResults={searchData}
                onSearchListItemClick={this.onSearchListItemClick}
                shouldDisplayFlyout={flyoutSearchBox.shouldDisplay}
                setDisplaySearchboxFlyout={this.setDisplaySearchboxFlyout}
                displayResultListOf={SEARCH_LIST_DISPLAY_PRODUCTS}
                isSearchLoading={isSearchLoading}
                onClickOutsideFlyoutSearchBox={this.onClickOutsideFlyoutSearchBox}
              />
              {addProductPopup.shouldDisplay && (
                <AddProductPopup
                  togglePopup={this.onToggleAddProductPopup}
                  onProductAddSuccessful={this.onWatchlistProductAdded}
                />
              )}
            </div>
            <div className="col col-sm-12 col-md sorting-wrapper">
              <ToolsBar>
                <SortingControls
                  onWatchListSort={this.onWatchListSort}
                  currentSortedBy={watchlistSortedBy}
                  currentSortDirection={watchlistSortDirection}
                  isMobileMode={isMobileTabletMode}
                />
                {/* eslint-disable-next-line max-len */}
                {/* {!isMobileTabletMode && exportButtons && exportButtons.map((type, index) => ( */}
                {/*  <ExportButton */}
                {/*    key={type} */}
                {/*    className={`col col-auto ${index === 0 ? 'ml-auto' : ''}`} */}
                {/*    type={type} */}
                {/*  /> */}
                {/* ))} */}
              </ToolsBar>
            </div>
          </Row>
        </div>
        {isLoading && (
          <div className="is-loading" />
        )}
        <div className="section-content">
          {isBackendError && (
            <Alert type={ALERT_TYPE.ERROR} dismissible>
              <div className="title">{i18n.t('my_watchlist_backend_error')}</div>
              <div className="message">
                <HtmlText
                  tag="span"
                  data={{
                    text: isBackendError.message || i18n.t('my_watchlist_backend_error_default'),
                  }}
                />
              </div>
            </Alert>
          )}
          {notificationAlertPopup.shouldDisplay && (
            <SetAlertNotificationPopup
              data={notificationAlertPopup}
              onTogglePopup={this.onToggleNotificationAlert}
            />
          )}
          {this.getProductTiles()}
        </div>
      </div>
    );
  }
}

MyWatchList.propTypes = {
  isMobileMode: PropTypes.bool,
  isMobileTabletMode: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSearchLoading: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
  searchData: PropTypes.objectOf(PropTypes.any),
  addProductPopup: PropTypes.objectOf(PropTypes.any),
  flyoutSearchBox: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  watchlistSortDirection: PropTypes.string,
  watchlistSortedBy: PropTypes.string,
  notificationAlertPopup: PropTypes.objectOf(PropTypes.any),
  isBackendError: PropTypes.objectOf(PropTypes.any),
};

MyWatchList.defaultProps = {
  isMobileMode: false,
  isMobileTabletMode: false,
  isLoading: false,
  isSearchLoading: false,
  data: {},
  searchData: {},
  addProductPopup: {
    shouldDisplay: false,
    productIsin: null,
    position: null,
    purchasePrice: null,
  },
  flyoutSearchBox: {
    shouldDisplay: false,
  },
  watchlistSortDirection: null,
  watchlistSortedBy: null,
  notificationAlertPopup: {
    shouldDisplay: false,
  },
  dispatch: () => {},
  isBackendError: null,
};

const mapStateToProps = (state) => ({
  data: state.userDashboardPageMyWatchList && state.userDashboardPageMyWatchList.data,
  searchData: state.userDashboardPageMyWatchList && state.userDashboardPageMyWatchList.searchData,
  isLoading: state.userDashboardPageMyWatchList && state.userDashboardPageMyWatchList.isLoading,
  isSearchLoading: state.userDashboardPageMyWatchList
    && state.userDashboardPageMyWatchList.isSearchLoading,
  isMobileTabletMode: (
    state.global.responsiveMode === MOBILE_MODE || state.global.responsiveMode === TABLET_MODE
  ),
  isMobileMode: (
    state.global.responsiveMode === MOBILE_MODE
  ),
  addProductPopup: state.watchListAddProductPopup,
  flyoutSearchBox: state.userDashboardPageMyWatchList
    && state.userDashboardPageMyWatchList.flyoutSearchBox,
  watchlistSortDirection: state.userDashboardPageMyWatchList
    && state.userDashboardPageMyWatchList.watchlistSortDirection,
  watchlistSortedBy: state.userDashboardPageMyWatchList
    && state.userDashboardPageMyWatchList.watchlistSortedBy,
  notificationAlertPopup: state.userDashboardPageMyWatchList
    && state.userDashboardPageMyWatchList.notificationAlertPopup,
  isBackendError: state.userDashboardPageMyWatchList
    && state.userDashboardPageMyWatchList.isBackendError,
});

export default withAuth(connect(mapStateToProps)(MyWatchList));
