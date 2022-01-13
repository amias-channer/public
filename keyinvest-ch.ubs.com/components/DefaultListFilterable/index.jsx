import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Helmet } from 'react-helmet';
import { parse, stringify } from 'query-string';
import ProductFilters from './ProductFilters';
import ProductInstrumentTable from './ProductInstrumentTable';
import Logger from '../../utils/logger';
import i18n from '../../utils/i18n';

import {
  defaultListFilterableFiltersFetchData,
  defaultListFilterableFiltersFirstLevelToggleTab,
  defaultListFilterableTriggerExport,
  defaultListFilterableWillUnmount,
} from './actions';
import {
  FILTER_TAB_IN_SUBSCRIPTION, FIRST_LEVEL_FILTER_KEY,
  GET_FILTER_TAB_INVESTMENT_PRODUCTS,
  GET_FILTER_TAB_LEVERAGE_PRODUCTS,
  getUpdatedBrowserUrlQueryParams,
} from './ProductFilters/ProductFilters.helper';
import DefaultListPaginator from '../DefaultListPaginator';
import './DefaultListFilterable.scss';
import { formatNumber, isEmptyData, stringifyParams } from '../../utils/utils';
import ResultSummary from '../ResultSummary';
import {
  EXPORT_PRODUCT_LIST_KEY,
  getCmsComponents, getGroupDescriptionText, getGroupDescriptionTitle,
  getMetaDescription,
  getMetaKeywords,
  getNumberOfResultsCount,
  getPageTitle,
  PRODUCT_LIST_EXPORT_BUTTONS,
} from './DefaultListFilterable.helper';
import {
  trackProductListFilterUpdate,
} from './ProductFiltersAnalytics.helper';
import GenericErrorMessage from '../GenericErrorMessage';
import HtmlText from '../HtmlText';
import { pathOrObject } from '../../utils/typeChecker';

export class DefaultListFilterableComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    const {
      uniqDefaultListId, data,
    } = props;
    Logger.debug('DEFAULT_FILTERS', 'constructor', uniqDefaultListId, data);
    this.fetchData = this.fetchData.bind(this);
    this.onUpdateFunc = this.onUpdateFunc.bind(this);
    this.onResetFunc = this.onResetFunc.bind(this);
    this.triggerExport = this.triggerExport.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { pageProps } = this.props;
    const { location } = pageProps;

    const { pageProps: prevPageProps } = prevProps;
    const { location: prevLocation } = prevPageProps;

    if (prevLocation
      && location
      && prevLocation.search !== location.search
    ) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    const { dispatch, uniqDefaultListId } = this.props;
    dispatch(defaultListFilterableWillUnmount(uniqDefaultListId));
  }

  onResetFunc() {
    const { dispatch } = this.props;
    const currentFirstLevelFilter = this.getCurrentFirstLevelFilter();
    dispatch(push({
      search: stringify(currentFirstLevelFilter),
    }));
  }

  onUpdateFunc(filterKey, newFilterValues, currentFilterLevel) {
    const {
      dispatch, uniqDefaultListId, data, independentLevels,
    } = this.props;
    const { filterData } = data;
    Logger.info('DEFAULT_LIST_FILTERABLE', uniqDefaultListId, 'onUpdateFunc called with', filterKey, newFilterValues, currentFilterLevel);
    const allNewParams = getUpdatedBrowserUrlQueryParams(
      filterKey, newFilterValues, currentFilterLevel, filterData, independentLevels,
    );
    const stringfiedParams = stringifyParams(allNewParams);

    this.trackFilterUpdate(
      filterKey,
      newFilterValues,
      currentFilterLevel,
      filterData,
      allNewParams,
    );

    dispatch(push({
      search: stringfiedParams,
    }));
  }

  getCurrentFirstLevelFilter() {
    const { pageProps } = this.props;
    const { location } = pageProps;
    const parsedFirstLevelFilter = parse(location.search)[FIRST_LEVEL_FILTER_KEY];
    return {
      [FIRST_LEVEL_FILTER_KEY]: parsedFirstLevelFilter,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  trackFilterUpdate(filterKey, newFilterValues, currentFilterLevel, filterData, updatedFullParams) {
    // Analytics tracking
    trackProductListFilterUpdate(
      filterKey,
      newFilterValues,
      currentFilterLevel,
      filterData,
      updatedFullParams,
    );
  }

  fetchData() {
    const {
      dispatch,
      activeTab,
      uniqDefaultListId,
      pageProps,
    } = this.props;
    const { location } = pageProps;
    if (location && (!location.search || location.search === '')) {
      dispatch(defaultListFilterableFiltersFirstLevelToggleTab(uniqDefaultListId, null));
    }

    dispatch(defaultListFilterableFiltersFetchData(
      pageProps.stateName, uniqDefaultListId, activeTab,
    ));
  }

  triggerExport(exportType) {
    const { dispatch } = this.props;
    dispatch(defaultListFilterableTriggerExport(EXPORT_PRODUCT_LIST_KEY, exportType));
  }

  render() {
    const {
      uniqDefaultListId, activeTab, data, isLoading, className,
    } = this.props;
    const isEmptyRows = data.rows && isEmptyData(data.rows);
    const cmsComponents = getCmsComponents(data);
    const pageTitle = getPageTitle(data);
    const metaDescription = getMetaDescription(data);
    const metaKeywords = getMetaKeywords(data);
    const groupDescriptionTitle = getGroupDescriptionTitle(data);
    const groupDescriptionText = getGroupDescriptionText(data);
    return (
      <div className={classNames('DefaultListFilterable', className)}>
        {data && !isLoading && (
          <Helmet>
            {pageTitle && (<title>{pageTitle}</title>)}
            {metaDescription && (<meta name="description" content={metaDescription} />)}
            {metaKeywords && (<meta name="keywords" content={metaKeywords} />)}
          </Helmet>
        )}
        {data && cmsComponents && (
          <div className="cms-components-container mb-3">
            {cmsComponents}
          </div>
        )}
        <ProductFilters
          uniqDefaultListId={uniqDefaultListId}
          data={data}
          activeTab={activeTab}
          isLoading={isLoading}
          onUpdateFunc={this.onUpdateFunc}
          onResetFunc={this.onResetFunc}
        />

        {!isLoading && !isEmptyRows && typeof getNumberOfResultsCount(data) !== 'undefined' && (
          <ResultSummary
            summaryText={`${formatNumber(getNumberOfResultsCount(data), 0, 0)} ${i18n.t(`${activeTab}_result_summary_text`)}`}
            exportButtons={PRODUCT_LIST_EXPORT_BUTTONS}
            triggerExportFunc={this.triggerExport}
          />
        )}

        {!isLoading && isEmptyRows && (
          <>
            <h2>{i18n.t('no_results_found')}</h2>
            <p>{i18n.t('please_try_again')}</p>
          </>
        )}
        {(activeTab === GET_FILTER_TAB_INVESTMENT_PRODUCTS()
          || activeTab === GET_FILTER_TAB_LEVERAGE_PRODUCTS())
        && data && data.rows && !isEmptyRows && Array.isArray(data.rows)
        && !isLoading
        && (
          <>
            <ProductInstrumentTable
              uniqDefaultListId={uniqDefaultListId}
              data={data}
              activeTab={activeTab}
              isLoading={isLoading}
              onUpdateFunc={this.onUpdateFunc}
            />
            <DefaultListPaginator
              uniqDefaultListId={uniqDefaultListId}
              data={data}
              isLoading={isLoading}
              onUpdateFunc={this.onUpdateFunc}
            />
          </>
        )}
        {!isLoading && (data.hasError || !data.rows) && (
          <GenericErrorMessage />
        )}
        {activeTab === FILTER_TAB_IN_SUBSCRIPTION
        && data && data.rows
        && typeof data.rows === 'object'
        && !isLoading
        && Object.keys(data.rows).map(
          (metaGroup) => {
            const tablesData = data.rows[metaGroup] && Object.keys(data.rows[metaGroup]).map(
              (group) => (
                <ProductInstrumentTable
                  key={metaGroup + group}
                  uniqDefaultListId={uniqDefaultListId}
                  data={data.rows[metaGroup][group]}
                  columnsAlign={data.containerGroupAlignments}
                  activeTab={activeTab}
                  isLoading={isLoading}
                  onUpdateFunc={this.onUpdateFunc}
                  groupName={group}
                />
              ),
            );
            return (
              <Fragment key={metaGroup}>
                <h1>{metaGroup}</h1>
                {tablesData}
              </Fragment>
            );
          },
        )}
        {groupDescriptionTitle && groupDescriptionText && (
          <h1 className="group-description-title">
            {groupDescriptionTitle}
          </h1>
        )}
        {groupDescriptionText && (
          <HtmlText
            className="group-description-text"
            data={{ text: groupDescriptionText }}
          />
        )}
      </div>
    );
  }
}
DefaultListFilterableComponent.propTypes = {
  className: PropTypes.string,
  uniqDefaultListId: PropTypes.string.isRequired,
  pageProps: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  activeTab: PropTypes.string,
  isLoading: PropTypes.bool,
  independentLevels: PropTypes.bool,
};
DefaultListFilterableComponent.defaultProps = {
  className: '',
  data: {
    filterData: {},
  },
  dispatch: () => {},
  activeTab: undefined,
  isLoading: true,
  independentLevels: false,
};

const EMPTY_OBJ = {};
export const defaultListFilterableMapStateToProps = (state, ownProps) => {
  if (state.defaultListFilterable) {
    const instance = pathOrObject(EMPTY_OBJ, ['defaultListFilterable', ownProps.uniqDefaultListId], state);
    if (instance && instance.data) {
      return {
        data: instance.data,
        activeTab: instance.activeTab,
        isLoading: instance.isLoading,
      };
    }
  }
  return EMPTY_OBJ;
};

const DefaultListFilterable = connect(
  defaultListFilterableMapStateToProps,
)(DefaultListFilterableComponent);

export default DefaultListFilterable;
