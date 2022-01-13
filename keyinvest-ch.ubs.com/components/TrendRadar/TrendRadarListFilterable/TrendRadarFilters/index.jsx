import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './TrendRadarFilters.scss';
import ActiveFilters
  from '../../../DefaultListFilterable/ProductFilters/ActiveFilters';
import SaveSearchPopup from '../../../UserDashboard/MySearches/SaveSearchPopup';
import LevelFiltersContainer
  from '../../../DefaultListFilterable/ProductFilters/LevelFiltersContainer';
import {
  FILTER_LEVEL_SECOND,
  FILTER_LEVEL_THIRD,
} from '../../../DefaultListFilterable/ProductFilters/ProductFilters.helper';
import LevelFiltersContainerWithFiles from './LevelFiltersContainerWithFiles';
import { ProductFiltersComponent } from '../../../DefaultListFilterable/ProductFilters';
import i18n from '../../../../utils/i18n';

export class TrendRadarFiltersComponent extends ProductFiltersComponent {
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
    const { filterData, resourceFiles } = data;
    const saveSearchCompTranslations = { saveFilterSuccessTitle: i18n.t('trend_radar_list_save_filter_to_my_searches_success_title') };
    return (
      <>
        <div className="ProductFilters TrendRadarFilters">
          {filterData && filterData[FILTER_LEVEL_SECOND] && (
            <>
              <LevelFiltersContainerWithFiles
                data={filterData[FILTER_LEVEL_SECOND]}
                level={FILTER_LEVEL_SECOND}
                dataSource={['filterData', FILTER_LEVEL_SECOND]}
                activeTab={activeTab}
                uniqDefaultListId={uniqDefaultListId}
                onUpdateFunc={onUpdateFunc}
                files={resourceFiles}
                innerFilterClassNames="col-md-6 col-lg-4"
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
                displayResetButton={TrendRadarFiltersComponent.shouldDisplayResetButton(data)}
                displaySaveButton={TrendRadarFiltersComponent.shouldDisplayResetButton(data)}
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

TrendRadarFiltersComponent.propTypes = {
  uniqDefaultListId: PropTypes.string.isRequired,
  onUpdateFunc: PropTypes.func.isRequired,
  onResetFunc: PropTypes.func.isRequired,
  onSaveFunc: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
  activeTab: PropTypes.string,
  isLoading: PropTypes.bool,
};
TrendRadarFiltersComponent.defaultProps = {
  onSaveFunc: () => {},
  data: {
    filterData: {},
  },
  activeTab: null,
  isLoading: false,
};

const TrendRadarFilters = connect()(TrendRadarFiltersComponent);
export default TrendRadarFilters;
