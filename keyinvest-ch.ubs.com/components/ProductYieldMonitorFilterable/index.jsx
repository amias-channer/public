import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  DefaultListFilterableComponent,
  defaultListFilterableMapStateToProps,
} from '../DefaultListFilterable';
import DefaultListPaginator from '../DefaultListPaginator';
import ProductFlatFilters from '../ProductFlatFilters';
import ProductInstrumentYieldTable from './ProductInstrumentYieldTable';
import './ProductYieldMonitorFilterable.scss';
import i18n from '../../utils/i18n';
import { FILTER_LEVEL_SECOND } from '../DefaultListFilterable/ProductFilters/ProductFilters.helper';
import ResultSummary from '../ResultSummary';
import {
  EXPORT_YIELD_MONITOR_KEY,
  YIELD_MONITOR_EXPORT_BUTTONS,
} from './ProductYieldMonitorFilterable.helper';
import { yieldMonitorFilterableTriggerExport } from './actions';
import { trackYieldFilterUpdate } from './ProductYieldMonitorFiltersAnalytics.helper';
import GenericErrorMessage from '../GenericErrorMessage';

export class ProductYieldMonitorFilterableComponent extends DefaultListFilterableComponent {
  // eslint-disable-next-line class-methods-use-this
  trackFilterUpdate(filterKey, newFilterValues, currentFilterLevel, filterData, stringfiedParams) {
    trackYieldFilterUpdate(
      filterKey,
      newFilterValues,
      currentFilterLevel,
      filterData,
      stringfiedParams,
    );
  }

  getFilterData() {
    const { data } = this.props;
    return data.filterData;
  }

  triggerExport(exportType) {
    const { dispatch } = this.props;
    dispatch(yieldMonitorFilterableTriggerExport(EXPORT_YIELD_MONITOR_KEY, exportType));
  }

  static shouldDisplaySaveAndResetButton(data) {
    return !(data && data.query
      && Array.isArray(data.query)
      && data.query.length === 0);
  }

  render() {
    const {
      uniqDefaultListId, data, isLoading,
    } = this.props;
    return (
      <div className="ProductYieldMonitorFilterable">
        <h1>{i18n.t('yield_monitor')}</h1>
        <h2>{i18n.t('yield_monitor_desc')}</h2>
        <ProductFlatFilters
          uniqDefaultListId={uniqDefaultListId}
          data={this.getFilterData()}
          isLoading={isLoading}
          onUpdateFunc={this.onUpdateFunc}
          onResetFunc={this.onResetFunc}
          dataSource={['filterData', FILTER_LEVEL_SECOND]}
          displaySaveButton={
            ProductYieldMonitorFilterableComponent.shouldDisplaySaveAndResetButton(data)
          }
          displayResetButton={
            ProductYieldMonitorFilterableComponent.shouldDisplaySaveAndResetButton(data)
          }
        />

        {data && data.rows && Array.isArray(data.rows) && (
          <>
            <ResultSummary
              summaryText=""
              exportButtons={YIELD_MONITOR_EXPORT_BUTTONS}
              triggerExportFunc={this.triggerExport}
            />
            <ProductInstrumentYieldTable
              uniqDefaultListId={uniqDefaultListId}
              data={data}
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
      </div>
    );
  }
}
ProductYieldMonitorFilterableComponent.propTypes = {
  uniqDefaultListId: PropTypes.string.isRequired,
  pageProps: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
};
ProductYieldMonitorFilterableComponent.defaultProps = {
  data: {
    filterData: {},
  },
  dispatch: () => {},
  isLoading: true,
};

const ProductYieldMonitorFilterable = connect(
  defaultListFilterableMapStateToProps,
)(ProductYieldMonitorFilterableComponent);

export default ProductYieldMonitorFilterable;
