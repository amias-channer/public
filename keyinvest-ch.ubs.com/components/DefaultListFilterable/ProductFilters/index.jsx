import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FILTER_LEVEL_FIRST,
  FILTER_LEVEL_SECOND,
  FILTER_LEVEL_THIRD,
} from './ProductFilters.helper';
import FirstLevelFilters from './FirstLevelFilters';
import LevelFiltersContainer from './LevelFiltersContainer';
import './ProductFilters.scss';
import ActiveFilters from './ActiveFilters';
import SaveSearchPopup from '../../UserDashboard/MySearches/SaveSearchPopup';
import i18n from '../../../utils/i18n';

export class ProductFiltersComponent extends React.PureComponent {
  static shouldDisplayResetButton(data) {
    return !(data && data.query
      && Array.isArray(data.query)
      && data.query.length === 0);
  }

  render() {
    const {
      data,
      activeTab,
      uniqDefaultListId,
      isLoading,
      onUpdateFunc,
      onResetFunc,
      onSaveFunc,
    } = this.props;
    const { filterData } = data;
    const saveSearchCompTranslations = { saveFilterSuccessTitle: i18n.t('product_list_save_filter_to_my_searches_success_title') };
    return (
      <>
        <div className="ProductFilters">
          {filterData && (
          <FirstLevelFilters
            data={filterData[FILTER_LEVEL_FIRST]}
            activeTab={activeTab}
            uniqDefaultListId={uniqDefaultListId}
            onUpdateFunc={onUpdateFunc}
            isLoading={isLoading}
          />
          )}
          {filterData && filterData[FILTER_LEVEL_SECOND] && (
            <>
              <LevelFiltersContainer
                data={filterData[FILTER_LEVEL_SECOND]}
                level={FILTER_LEVEL_SECOND}
                dataSource={['filterData', FILTER_LEVEL_SECOND]}
                activeTab={activeTab}
                uniqDefaultListId={uniqDefaultListId}
                onUpdateFunc={onUpdateFunc}
              />
              <LevelFiltersContainer
                data={filterData[FILTER_LEVEL_THIRD]}
                level={FILTER_LEVEL_THIRD}
                dataSource={['filterData', FILTER_LEVEL_THIRD]}
                activeTab={activeTab}
                uniqDefaultListId={uniqDefaultListId}
                onUpdateFunc={onUpdateFunc}
                isToggleable
              />
              <ActiveFilters
                data={filterData}
                onUpdateFunc={onUpdateFunc}
                onResetFunc={onResetFunc}
                onSaveFunc={onSaveFunc}
                displayResetButton={ProductFiltersComponent.shouldDisplayResetButton(data)}
                displaySaveButton={ProductFiltersComponent.shouldDisplayResetButton(data)}
              />
            </>
          )}
          <SaveSearchPopup translationTexts={saveSearchCompTranslations} />
        </div>
        {isLoading && (<div className="is-loading" />)}
      </>
    );
  }
}

ProductFiltersComponent.propTypes = {
  uniqDefaultListId: PropTypes.string.isRequired,
  onUpdateFunc: PropTypes.func.isRequired,
  onResetFunc: PropTypes.func.isRequired,
  onSaveFunc: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
  activeTab: PropTypes.string,
  isLoading: PropTypes.bool,
};
ProductFiltersComponent.defaultProps = {
  onSaveFunc: () => {},
  data: {
    filterData: {},
  },
  activeTab: null,
  isLoading: false,
};

const ProductFilters = connect()(ProductFiltersComponent);
export default ProductFilters;
