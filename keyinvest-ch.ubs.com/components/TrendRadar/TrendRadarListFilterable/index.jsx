import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  concat,
  pathOr,
} from 'ramda';
import { produce } from 'immer';
import TrendRadarFilters from './TrendRadarFilters';
import './TrendRadarListFilterable.scss';
import { isEmptyData } from '../../../utils/utils';
import i18n from '../../../utils/i18n';
import GenericErrorMessage from '../../GenericErrorMessage';
import { DefaultListFilterableComponent } from '../../DefaultListFilterable';
import { DESKTOP_MODE } from '../../../utils/responsive';
import {
  getMetaDescription,
  getMetaKeywords,
  getPageTitle,
} from '../../DefaultListFilterable/DefaultListFilterable.helper';
import {
  defaultListFilterableFiltersFetchData,
  defaultListFilterableFiltersFetchMoreData,
  defaultListFilterableGotMoreData,
} from '../../DefaultListFilterable/actions';
import TrendRadarSignal from './TrendRadarSignal';
import InfiniteList from '../../InfiniteList';
import {
  getSignalUniqKey,
} from './TrendRadarSignal/TrendRadarSignal.helper';
import {
  generateResponseDataToStoreUpdater,
  getLoadMoreParameter,
  getLoadRelatedProductsUrl,
  getPathsOfRowsHavingRelatedProductsToBeUpdated,
  getPathsOfRowsWithoutRelatedProducts,
  INFINITE_LIST_LOAD_MORE_KEY,
  LIST_ITEM_INDEX_TO_SHOW_BANNER,
  TREND_RADAR_ROWS_KEY,
  TREND_RADAR_URL_LEVERAGE_PRODUCTS_KEY,
} from './TrendRadarListFilterable.helper';
import { generateCmsLayout } from '../../../pages/CmsPage/CmsPage.helper';
import HttpService from '../../../utils/httpService';
import TrendRadarAlarmPopupCmp from '../../TrendRadarAlarmPopup';
import withAuth from '../../Authentication/withAuth';
import TrendRadarSaveSignalPopupComp from './TrendRadarSaveSignalPopup';

export class TrendRadarListFilterableComponent extends DefaultListFilterableComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCreateAlertFormPopup: false,
      createAlertUrl: '',
      showSaveSignalPopup: false,
      saveSignalPopupData: '',
    };
    this.fetchData = this.fetchData.bind(this);
    this.fetchMoreData = this.fetchMoreData.bind(this);
    this.onFetchMoreDataFinished = this.onFetchMoreDataFinished.bind(this);
    this.fetchMoreDataCallback = this.fetchMoreDataCallback.bind(this);
    this.loadRelatedProducts = this.loadRelatedProducts.bind(this);
    this.updateRelatedProducts = this.updateRelatedProducts.bind(this);
    this.onShowCreateAlertFormPopup = this.onShowCreateAlertFormPopup.bind(this);
    this.onSaveSignal = this.onSaveSignal.bind(this);
    this.onAlertPopupCloseClick = this.onAlertPopupCloseClick.bind(this);
    this.onCloseSaveSignalPopup = this.onCloseSaveSignalPopup.bind(this);
  }

  fetchData() {
    const {
      dispatch,
      uniqDefaultListId,
      pageProps,
    } = this.props;

    dispatch(defaultListFilterableFiltersFetchData(
      pageProps.stateName,
      uniqDefaultListId,
      null,
      '',
      this.loadRelatedProducts,
    ));
  }

  fetchMoreData() {
    const {
      dispatch,
      uniqDefaultListId,
      pageProps,
      data,
      isLoadingMore,
    } = this.props;

    if (!isLoadingMore) {
      const url = HttpService.getBackendUrlByStateName(
        pageProps.stateName,
        true,
        getLoadMoreParameter(data),
      );

      const pathsToOverrideFromResponseToStore = [
        generateResponseDataToStoreUpdater(
          [INFINITE_LIST_LOAD_MORE_KEY],
          [INFINITE_LIST_LOAD_MORE_KEY],
        ),
        generateResponseDataToStoreUpdater(
          [TREND_RADAR_URL_LEVERAGE_PRODUCTS_KEY],
          [TREND_RADAR_URL_LEVERAGE_PRODUCTS_KEY],
        ),
      ];
      const pathsOfListsToBeAppendedFromResponseToStore = [
        generateResponseDataToStoreUpdater(
          [TREND_RADAR_ROWS_KEY],
          [TREND_RADAR_ROWS_KEY],
        ),
      ];
      dispatch(defaultListFilterableFiltersFetchMoreData(
        url,
        uniqDefaultListId,
        this.onFetchMoreDataFinished,
        pathsToOverrideFromResponseToStore,
        pathsOfListsToBeAppendedFromResponseToStore,
      ));
    }
  }

  onFetchMoreDataFinished(action, response) {
    this.fetchMoreDataCallback(action, response);
    this.loadRelatedProducts(action, response);
  }

  fetchMoreDataCallback(actionData, response) {
    const {
      dispatch,
    } = this.props;
    dispatch(defaultListFilterableGotMoreData(
      actionData.uniqDefaultListId,
      response.data,
      actionData.pathsToOverride,
      actionData.pathsOfListsToAppend,
    ));
  }

  loadRelatedProducts(action, response) {
    const self = this;
    setTimeout(() => {
      const {
        dispatch,
        data,
      } = self.props;
      const url = HttpService.getPageApiUrl() + getLoadRelatedProductsUrl(response.data || data);
      dispatch(defaultListFilterableFiltersFetchMoreData(
        url,
        action.uniqDefaultListId,
        self.updateRelatedProducts,
      ));
    }, 300);
  }

  updateRelatedProducts(actionData, responseData) {
    const {
      dispatch,
      data,
    } = this.props;

    const responseRelatedProducts = pathOr({}, ['data'], responseData);
    const pathsToRows = concat(
      /**
       * Setting empty list of related products
       * if no products previously loaded for each signal in the state
       */
      getPathsOfRowsWithoutRelatedProducts(data.rows),

      /**
       * Looping through the response and merge related products
       */
      getPathsOfRowsHavingRelatedProductsToBeUpdated(
        responseRelatedProducts, data.rows,
      ),
    );

    // Trigger update of the store
    dispatch(defaultListFilterableGotMoreData(
      actionData.uniqDefaultListId,
      responseData.data,
      pathsToRows,
    ));
  }

  onShowCreateAlertFormPopup(signalAddAlertUrl) {
    this.setState(produce((draft) => {
      draft.showCreateAlertFormPopup = true;
      draft.createAlertUrl = signalAddAlertUrl;
    }));
  }

  onSaveSignal(saveSignalPopupData) {
    this.setState(produce((draft) => {
      draft.showSaveSignalPopup = true;
      draft.saveSignalPopupData = saveSignalPopupData;
    }));
  }

  onAlertPopupCloseClick() {
    this.setState(produce((draft) => {
      draft.showCreateAlertFormPopup = false;
    }));
  }

  onCloseSaveSignalPopup() {
    this.setState(produce((draft) => {
      draft.showSaveSignalPopup = false;
    }));
  }

  render() {
    const {
      uniqDefaultListId,
      activeTab,
      data,
      isLoading,
      responsiveMode,
      isLoadingMore,
      isUserAuthenticated,
    } = this.props;
    const {
      showCreateAlertFormPopup, createAlertUrl, showSaveSignalPopup, saveSignalPopupData,
    } = this.state;
    const isEmptyRows = !data || !data.rows || isEmptyData(data.rows);
    const pageTitle = getPageTitle(data);
    const metaDescription = getMetaDescription(data);
    const metaKeywords = getMetaKeywords(data);
    const trendRadarBannerComponents = generateCmsLayout(pathOr([], ['components', 'data'], data));
    return (
      <div className="DefaultListFilterable TrendRadarListFilterable">
        {data && !isLoading && (
          <Helmet>
            {pageTitle && (<title>{pageTitle}</title>)}
            {metaDescription && (<meta name="description" content={metaDescription} />)}
            {metaKeywords && (<meta name="keywords" content={metaKeywords} />)}
          </Helmet>
        )}
        <TrendRadarFilters
          uniqDefaultListId={uniqDefaultListId}
          data={data}
          activeTab={activeTab}
          isLoading={isLoading}
          onUpdateFunc={this.onUpdateFunc}
          onResetFunc={this.onResetFunc}
        />
        {!isLoading && isEmptyRows && (
          <>
            <h2>{i18n.t('no_results_found')}</h2>
            <p>{i18n.t('please_try_again')}</p>
          </>
        )}
        <InfiniteList
          loadMoreFunc={this.fetchMoreData}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={!!getLoadMoreParameter(data)}
        >
          {!isEmptyRows && data.rows.map((signal, index) => {
            const signalCmp = (
              <TrendRadarSignal
                key={getSignalUniqKey(signal)}
                data={signal}
                responsiveMode={responsiveMode}
                onShowCreateAlertFormPopup={this.onShowCreateAlertFormPopup}
                onSaveSignal={this.onSaveSignal}
                isUserAuthenticated={isUserAuthenticated}
              />
            );
            if (index === LIST_ITEM_INDEX_TO_SHOW_BANNER) {
              return (
                <Fragment key="trendRadarBanner">
                  <div className="trendRadarBanner">
                    {trendRadarBannerComponents}
                  </div>
                  {signalCmp}
                </Fragment>
              );
            }
            return signalCmp;
          })}
        </InfiniteList>

        {!isLoading && (data.hasError || !data.rows) && (
          <GenericErrorMessage />
        )}
        {showCreateAlertFormPopup && isUserAuthenticated && (
          <TrendRadarAlarmPopupCmp
            dataUrl={createAlertUrl}
            onAlertPopupCloseClick={this.onAlertPopupCloseClick}
          />
        )}

        {showSaveSignalPopup && isUserAuthenticated && (
          <TrendRadarSaveSignalPopupComp
            data={saveSignalPopupData}
            onClosePopup={this.onCloseSaveSignalPopup}
          />
        )}
      </div>
    );
  }
}

TrendRadarListFilterableComponent.propTypes = {
  uniqDefaultListId: PropTypes.string.isRequired,
  pageProps: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  activeTab: PropTypes.string,
  isLoading: PropTypes.bool,
  independentLevels: PropTypes.bool,
  responsiveMode: PropTypes.string,
  isUserAuthenticated: PropTypes.bool,
};
TrendRadarListFilterableComponent.defaultProps = {
  data: {
    filterData: {},
  },
  dispatch: () => {},
  activeTab: undefined,
  isLoading: true,
  independentLevels: true,
  responsiveMode: DESKTOP_MODE,
  isUserAuthenticated: false,
};

const EMPTY_OBJ = {};
export const infiniteListFilterableMapStateToProps = (state, ownProps) => {
  const listFilterable = pathOr(EMPTY_OBJ, ['defaultListFilterable', ownProps.uniqDefaultListId], state);
  if (listFilterable.data) {
    return {
      data: listFilterable.data,
      activeTab: listFilterable.activeTab,
      isLoading: listFilterable.isLoading,
      isLoadingMore: listFilterable.isLoadingMore,
    };
  }
  return EMPTY_OBJ;
};

const TrendRadarListFilterable = connect(
  infiniteListFilterableMapStateToProps,
)(withAuth(TrendRadarListFilterableComponent));

export default TrendRadarListFilterable;
