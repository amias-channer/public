import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  DefaultListFilterableComponent,
  defaultListFilterableMapStateToProps,
} from '../DefaultListFilterable';
import ProductFlatFilters from '../ProductFlatFilters';
import ThemesListTable from './ThemesListTable';
import './ThemesListFilterable.scss';
import i18n from '../../utils/i18n';
import {
  getThemes,
  getThemesCmsComponents,
  getThemesFilterData,
} from './ThemesListFiltrable.helper';
import Headline from '../Headline';
import { trackThemesFilterUpdate } from './ThemesFiltersAnalytics.helper';
import GenericErrorMessage from '../GenericErrorMessage';
import DefaultListPaginator from '../DefaultListPaginator';

export class ThemesListFilterableComponent extends DefaultListFilterableComponent {
  // eslint-disable-next-line class-methods-use-this
  trackFilterUpdate(filterKey, newFilterValues, currentFilterLevel, filterData, stringfiedParams) {
    trackThemesFilterUpdate(
      filterKey,
      newFilterValues,
      currentFilterLevel,
      filterData,
      stringfiedParams,
    );
  }

  render() {
    const {
      uniqDefaultListId, pageProps, data, isLoading,
    } = this.props;
    const themes = getThemes(data);
    const filterData = getThemesFilterData(data);
    return (
      <div className="ThemesListFilterable">
        {data && themes && (
          <>
            <div>
              {getThemesCmsComponents(data)}
            </div>
            <Headline className="main-headline" data={{ size: 'h1', text: i18n.t('themes_portal') }} />
          </>
        )}
        <ProductFlatFilters
          uniqDefaultListId={uniqDefaultListId}
          pageProps={pageProps}
          data={filterData}
          isLoading={isLoading}
          onUpdateFunc={this.onUpdateFunc}
          onResetFunc={this.onResetFunc}
          dataSource={['filterData']}
          displaySaveButton={false}
        />
        {!isLoading && data && themes && (
          <>
            <ThemesListTable
              uniqDefaultListId={uniqDefaultListId}
              data={data}
              isLoading={isLoading}
              onUpdateFunc={this.onUpdateFunc}
            />
          </>
        )}
        {!isLoading && data && (
          <DefaultListPaginator
            uniqDefaultListId={uniqDefaultListId}
            data={data}
            isLoading={isLoading}
            onUpdateFunc={this.onUpdateFunc}
          />
        )}
        {!isLoading && (data.hasError || !themes) && (
          <GenericErrorMessage />
        )}
      </div>
    );
  }
}
ThemesListFilterableComponent.propTypes = {
  uniqDefaultListId: PropTypes.string.isRequired,
  pageProps: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
};
ThemesListFilterableComponent.defaultProps = {
  data: {
    filterData: {},
  },
  dispatch: () => {},
  isLoading: true,
};

const ThemesListFilterable = connect(
  defaultListFilterableMapStateToProps,
)(ThemesListFilterableComponent);

export default ThemesListFilterable;
