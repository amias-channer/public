import React from 'react';
import { batch, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import AbstractPage from '../AbstractPage';
import Breadcrumb from '../../components/ProductDetail/Breadcrumb';
import PriceTile from '../../components/ProductDetail/PriceTile';
import ToolsButtons from '../../components/ProductDetail/ToolsButtons';
import ProductTablesBlock
  from '../../components/ProductDetail/ProductTablesBlock';
import LifeCycle from '../../components/ProductDetail/LifeCycle';
import Annotations from '../../components/ProductDetail/Annotations';
import KeyInformationDocuments
  from '../../components/ProductDetail/KeyInformationDocuments';
import HistoryDataLink from '../../components/ProductDetail/HistoryDataLink';
import i18n from '../../utils/i18n';
import {
  ASK_FIELD_NAME,
  BID_FIELD_NAME,
  generateFullProductName,
  getAddToMyWatchlistButtonData,
  getAnnotations,
  getHistoryDataLink,
  getIdentifierValueFromProps,
  getInstrumentDataLeft,
  getInstrumentDataRight,
  getInSubscriptionButtonData,
  getIsin,
  getKeyInformationDocuments,
  getLastBidChange,
  getLifecycle,
  getNews,
  getNotifications,
  getPriceTileData,
  getProductBhpChartUrl,
  getProductDataForAddToWatchlist,
  getProductDescription,
  getProductDescriptionText,
  getProductMetaDescription,
  getProductMetaKeywords,
  getProductName,
  getProductPageTitle,
  getSecondaryMarketButton,
  getTenorWeightChartUrl,
  getTrackingPointNameByActionType,
  getUnderlyingsNames,
  PRODUCT_DETAILS_CHART_OPTIONS,
  triggerToolButtonAction,
} from './ProductDetailPage.helper';
import './ProductDetailPage.scss';
import AsyncChart from '../../components/Chart/AsyncChart';
import NewsStoriesBox from '../../components/NewsStoriesBox';
import {
  productDetailPageFetchContent,
  productDetailPageToggleAddProductToWatchlistPopup,
  productDetailPageToggleChartType,
  productDetailPageWillUnmount,
} from './actions';
import { generateUniqId, getProductParams } from '../../utils/utils';
import HtmlText from '../../components/HtmlText';
import UnderlyingChartTable
  from '../../components/ProductDetail/UnderlyingChartTable';
import ChartUnderlyingDisclaimer
  from '../../components/Chart/ChartUnderlyingDisclaimer';
import { dispatchAnalyticsPageLoadTrack } from '../../analytics/Analytics.helper';
import PushableTimestamp from '../../components/PushManager/PushableTimestamp';
import ChartSwitcher from '../../components/ProductDetail/ChartSwitcher';
import ProductIdentifiers
  from '../../components/ProductDetail/ProductIdentifiers';
import AsyncBarChart from '../../components/Chart/AsyncChart/AsyncBarChart';
import SubscriptionButton
  from '../../components/ProductDetail/SubscriptionButton';
import ErrorPage from '../ErrorPage';
import WatchListAddProductPopupComp
  from '../../components/WatchlistAddProductPopup';
import withAuth from '../../components/Authentication/withAuth';
import MessageBoxNonLoggedInUser
  from '../../components/MessageBoxNonLoggedInUser';
import { authTogglePopup } from '../../components/Authentication/actions';
import {
  CHART_TYPE_PRODUCT,
  getIsProductInSubscription,
  getPieChartData,
  getProductChartUrl,
  getTenorChartLastUpdate,
  getUnderlyingChartData,
  hasPieChartData,
  tenorWeightChartOptions,
} from './ProductChart.helper';
import { myWatchListGetAskPriceForProduct } from '../../components/WatchlistAddProductPopup/actions';
import { MY_WATCHLIST_API_GET_PRODUCT_ASK_PRICE_ENDPOINT } from '../../components/UserDashboard/MyWatchList/MyWatchList.helper';
import PieChart from '../../components/PieChart';
import { adformTrackEventClick } from '../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../adformTracking/AdformTrackingVars';

export class ProductDetailPageComponent extends AbstractPage {
  constructor(props) {
    super(props);
    this.triggerToolAction = this.triggerToolAction.bind(this);
    this.toggleChartTimespan = this.toggleChartTimespan.bind(this);
    this.toggleWatchListAddProductPopup = this.toggleWatchListAddProductPopup.bind(this);
    this.closeMessageBoxNonLoggedInUser = this.closeMessageBoxNonLoggedInUser.bind(this);
    this.openLoginRegisterPopup = this.openLoginRegisterPopup.bind(this);
  }

  trackPageChange() {
    const { location } = this.props;
    const pathname = pathOr('', ['pathname'])(location);
    const search = pathOr('', ['search'])(location);
    const isin = getIdentifierValueFromProps(this.props);
    this.trackAdformEventPageView(isin);
    dispatchAnalyticsPageLoadTrack(
      pathname + search,
      pathname,
      isin,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  trackAdformEventPageView() {
  }

  componentDidMount() {
    const { dispatch, uniqId, match } = this.props;
    if (match && match.params) {
      const params = getProductParams(match.params);
      dispatch(productDetailPageFetchContent(uniqId, params));
    }
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    const { dispatch, uniqId, match } = this.props;
    const prevIdentifierValue = getIdentifierValueFromProps(prevProps);
    const identifierValue = getIdentifierValueFromProps(this.props);
    if (
      prevIdentifierValue
      && identifierValue
      && prevIdentifierValue !== identifierValue
    ) {
      if (match && match.params) {
        const params = getProductParams(match.params);
        dispatch(productDetailPageFetchContent(uniqId, params));
      }
    }
  }

  componentWillUnmount() {
    const { dispatch, uniqId } = this.props;
    dispatch(productDetailPageWillUnmount(uniqId));
  }

  triggerToolAction(actionType, event) {
    const { data } = this.props;
    const isin = getIsin(data).value;
    triggerToolButtonAction(actionType, data);
    adformTrackEventClick(
      event,
      getTrackingPointNameByActionType(actionType),
      new AdformTrackingVars().setIsin(isin),
    );
  }

  getPageTitle() {
    const { data } = this.props;
    return getProductPageTitle(data) || generateFullProductName(data);
  }

  getMetaDescription() {
    const { data } = this.props;
    return getProductMetaDescription(data);
  }

  getMetaKeywords() {
    const { data } = this.props;
    return getProductMetaKeywords(data);
  }

  toggleChartTimespan(timespan) {
    const { uniqId, dispatch, currentChartStatus } = this.props;
    if (timespan) {
      dispatch(productDetailPageToggleChartType(uniqId, currentChartStatus.type, timespan));
    }
  }

  openLoginRegisterPopup() {
    const { dispatch } = this.props;
    dispatch(authTogglePopup(true));
    dispatch(productDetailPageToggleAddProductToWatchlistPopup());
  }

  toggleWatchListAddProductPopup(event) {
    const { dispatch, data } = this.props;
    const isin = getIsin(data).value;
    adformTrackEventClick(
      event,
      'watchlist-icon-click',
      new AdformTrackingVars().setIsin(isin),
    );
    batch(() => {
      dispatch(productDetailPageToggleAddProductToWatchlistPopup());
      dispatch(myWatchListGetAskPriceForProduct(
        MY_WATCHLIST_API_GET_PRODUCT_ASK_PRICE_ENDPOINT,
        getProductDataForAddToWatchlist(data),
      ));
    });
  }

  closeMessageBoxNonLoggedInUser() {
    const { dispatch } = this.props;
    dispatch(productDetailPageToggleAddProductToWatchlistPopup());
  }

  render() {
    const {
      dispatch, data, uniqId, isLoading, currentChartStatus, addProductToWatchlistPopup,
      isUserAuthenticated,
    } = this.props;
    const underlyingsNames = getUnderlyingsNames(data);
    const productName = getProductName(data);
    const bidPriceTileData = getPriceTileData(BID_FIELD_NAME, data);
    const askPriceTileData = getPriceTileData(ASK_FIELD_NAME, data);
    const instrumentDataLeft = getInstrumentDataLeft(data);
    const instrumentDataRight = getInstrumentDataRight(data);
    const lifecycle = getLifecycle(data);
    const news = getNews(data);
    const productDescriptionText = getProductDescriptionText(data);
    const annotations = getAnnotations(data);
    const keyInformationDocuments = getKeyInformationDocuments(data);
    const historyDataLinkSection = getHistoryDataLink(data);
    const productBhpChartUrl = getProductBhpChartUrl(data);
    const tenorWeightChartUrl = getTenorWeightChartUrl(data);
    const inSubscriptionButtonData = getInSubscriptionButtonData(data);
    const addProductToWatchlistData = getAddToMyWatchlistButtonData(data);
    const isProductInSubscription = getIsProductInSubscription(data);
    const pieChartData = getPieChartData(data);
    const isin = getIsin(data).value;
    const tenorChartLastUpdate = getTenorChartLastUpdate(data);
    return (
      <div className="ProductDetailPage">
        {this.getHelmetData()}
        {isLoading && (
          <div className="is-loading" />
        )}
        {data.failed && (
          <>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ErrorPage {...this.props} />
          </>
        )}
        {!isLoading && data && !data.failed && (
          <>
            <div className="row">
              <Breadcrumb crumb={productName} />
            </div>

            <div className="row">
              <div className="col-lg-7 col-xl-8">
                <HtmlText className="ubs-header-1 product-name pr-lg-4" tag="h1" data={{ text: productName }} />
                <div className="product-underlyings-names">
                  {underlyingsNames && underlyingsNames.value && (
                    <span>
                      <b>
                        {underlyingsNames.label}
                        {': '}
                      </b>
                      <b>
                        <HtmlText tag="span" data={{ text: underlyingsNames.value }} />
                      </b>
                    </span>
                  )}
                </div>
                <div className="product-description">
                  <HtmlText data={{ text: getProductDescription(data) }} />
                </div>

                <ProductIdentifiers productData={data} dispatch={dispatch} />

                <div className="product-warnings">
                  {getNotifications(data)}
                </div>
              </div>
              <div className="col-lg col-xl align-self-end">
                {bidPriceTileData.showPriceTile && (
                  <div className="row">
                    <div className="col">
                      <div className="last-price-update">
                        <span>{`${i18n.t('Last update:')} `}</span>
                        <PushableTimestamp field={getLastBidChange(data)} />
                      </div>
                    </div>
                  </div>
                )}
                <div className="row price-tiles-container justify-content-end">
                  <PriceTile isin={isin} dispatch={dispatch} className="col" tileData={bidPriceTileData} buttonClassName="btn-green" />
                  <PriceTile isin={isin} className="col" tileData={askPriceTileData} buttonClassName="btn-red" />
                </div>
                {inSubscriptionButtonData
                && inSubscriptionButtonData.showButton
                && (
                  <SubscriptionButton
                    data={inSubscriptionButtonData.modal}
                    buttonText={inSubscriptionButtonData.label}
                    isin={isin}
                  />
                )}
              </div>
            </div>

            {addProductToWatchlistPopup
            && addProductToWatchlistPopup.shouldDisplay
            && !isUserAuthenticated
            && (
              <MessageBoxNonLoggedInUser
                message={i18n.t('my_watchlist_login_required')}
                title={i18n.t('please_login')}
                onCloseMessageButtonClick={this.closeMessageBoxNonLoggedInUser}
                onLoginRegisterButtonClick={this.openLoginRegisterPopup}
              />
            )}
            <ToolsButtons
              className="row d-print-none"
              toolsActionFunc={this.triggerToolAction}
              secondaryMarketButton={getSecondaryMarketButton(data)}
              addToMyWatchListButton={addProductToWatchlistData}
              onMyWatchListButtonClick={this.toggleWatchListAddProductPopup}
            />
            {addProductToWatchlistPopup
            && addProductToWatchlistPopup.shouldDisplay
            && isUserAuthenticated
            && (
              <WatchListAddProductPopupComp
                togglePopup={this.toggleWatchListAddProductPopup}
                productIsin={addProductToWatchlistData.productIsin}
                productName={productName}
              />
            )}

            <div className="row key-value-tables">
              <div className="col-lg-6 tables-left">
                {instrumentDataLeft && (
                  <ProductTablesBlock sections={instrumentDataLeft} isin={isin} />
                )}
              </div>

              <div className="col-lg-6 tables-right">
                {instrumentDataRight && (
                  <>
                    <ProductTablesBlock isin={isin} sections={instrumentDataRight} />
                    {keyInformationDocuments && (
                    <KeyInformationDocuments data={keyInformationDocuments} />
                    )}
                    {historyDataLinkSection && (
                      <HistoryDataLink data={historyDataLinkSection} />
                    )}
                  </>
                )}

                {productBhpChartUrl && (
                  <>
                    <h2 className="title"><HtmlText data={{ text: i18n.t('ko_probability_history') }} /></h2>
                    <AsyncBarChart
                      className="d-block"
                      uniqKey="bhp"
                      url={productBhpChartUrl}
                      labelDecimalDigits={1}
                    />
                  </>
                )}
              </div>
            </div>
            {tenorWeightChartUrl && (
            <div className="row">
              <div className="col-auto tenor-weights-chart">
                <h2 className="title tenor-chart-title">{i18n.t('index_tenor_weights')}</h2>
                {tenorChartLastUpdate && (<span className="last-update-date">{`${i18n.t('as_of')}: ${tenorChartLastUpdate}`}</span>)}
                <AsyncBarChart
                  className="d-block"
                  uniqKey="tenor-weights"
                  url={tenorWeightChartUrl}
                  options={tenorWeightChartOptions}
                  labelDecimalDigits={2}
                />
              </div>
            </div>
            )}
            <div className="row">
              <div className="col">
                {getProductChartUrl(this.props) && currentChartStatus && (
                  <>
                    <h2 className="title">{i18n.t('chart')}</h2>
                    <AsyncChart
                      className="product-chart d-block"
                      uniqKey={currentChartStatus.url}
                      url={currentChartStatus.url}
                      timespan={currentChartStatus.timespan}
                      options={PRODUCT_DETAILS_CHART_OPTIONS}
                      toggleChartTimespan={this.toggleChartTimespan}
                    >
                      <ChartSwitcher
                        currentTimespan={currentChartStatus.timespan}
                        currentChartStatus={currentChartStatus}
                        underlyingsData={getUnderlyingChartData(data)}
                        dispatch={dispatch}
                        uniqId={uniqId}
                        productName={productName}
                        isProductInSubscription={isProductInSubscription}
                      />
                    </AsyncChart>
                    <UnderlyingChartTable
                      uniqId={uniqId}
                      data={getUnderlyingChartData(data)}
                    />
                    <ChartUnderlyingDisclaimer />
                  </>
                )}
              </div>
            </div>
            {hasPieChartData(data) && (
              <div className="row">
                <div className="col">
                  <h2 className="title">{i18n.t('index_constituent_weightings')}</h2>
                  <PieChart data={{ constituents: pieChartData }} pieChartClassName="ct-pie-chart-as-donut" />
                </div>
              </div>
            )}
            <div className="row">
              <div className="col">
                {lifecycle && (
                  <>
                    <h2 className="title">{i18n.t('life_cycle')}</h2>
                    <LifeCycle events={lifecycle} />
                  </>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col">
                {news && news.length > 0 && (
                  <>
                    <h2 className="title">{i18n.t('product_news')}</h2>
                    <NewsStoriesBox data={news} />
                  </>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col">
                {productDescriptionText && (<HtmlText data={{ text: productDescriptionText }} />)}
              </div>
            </div>

            <div className="row">
              <div className="col">
                {typeof annotations === 'object' && (
                  <Annotations annotations={annotations} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

const EMPTY_OBJ = {};

ProductDetailPageComponent.propTypes = {
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
  uniqId: PropTypes.string,
  addProductToWatchlistPopup: PropTypes.objectOf(PropTypes.any),
  isUserAuthenticated: PropTypes.bool,
};

ProductDetailPageComponent.defaultProps = {
  dispatch: () => {},
  isLoading: true,
  data: EMPTY_OBJ,
  uniqId: generateUniqId(),
  addProductToWatchlistPopup: {},
  isUserAuthenticated: false,
};

function mapStateToProps(state, ownProps) {
  if (
    ownProps.uniqId && state.productDetailPage
    && state.productDetailPage[ownProps.uniqId]
    && state.productDetailPage[ownProps.uniqId].data
  ) {
    return {
      data: state.productDetailPage[ownProps.uniqId].data,
      isLoading: state.productDetailPage[ownProps.uniqId].isLoading,
      currentChartStatus: state.productDetailPage[ownProps.uniqId].currentChartStatus,
      addProductToWatchlistPopup: state.productDetailPage
        && state.productDetailPage.addProductPopup,
      responsiveMode: state.global.responsiveMode,
    };
  }

  return {
    responsiveMode: state.global.responsiveMode,
    data: EMPTY_OBJ,
    isLoading: false,
    currentChartStatus: {
      type: CHART_TYPE_PRODUCT,
      underlyings: {},
      url: '',
    },
  };
}
const ProductDetailPage = withAuth(connect(mapStateToProps)(ProductDetailPageComponent));
export default ProductDetailPage;
