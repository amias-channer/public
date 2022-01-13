import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LevelFlatFiltersContainer from './LevelFlatFiltersContainer';
import ActiveFilters from '../DefaultListFilterable/ProductFilters/ActiveFilters';
import {
  FILTER_LEVEL_SECOND,
} from '../DefaultListFilterable/ProductFilters/ProductFilters.helper';
import './ProductFlatFilters.scss';
import SaveSearchPopup from '../UserDashboard/MySearches/SaveSearchPopup';
import i18n from '../../utils/i18n';

export class ProductFlatFiltersComponent extends React.PureComponent {
  render() {
    const {
      data,
      uniqDefaultListId,
      isLoading,
      onUpdateFunc,
      onResetFunc,
      dataSource,
      displaySaveButton,
      displayResetButton,
    } = this.props;
    const saveSearchTranslations = { saveFilterSuccessTitle: i18n.t('save_filter_to_my_searches_success_title') };
    return (
      <div className="ProductFlatFilters">
        {data && data[FILTER_LEVEL_SECOND]
        && Object.keys(data[FILTER_LEVEL_SECOND]).length > 0
        && (
          <>
            <LevelFlatFiltersContainer
              data={data[FILTER_LEVEL_SECOND]}
              level={FILTER_LEVEL_SECOND}
              dataSource={dataSource}
              uniqDefaultListId={uniqDefaultListId}
              onUpdateFunc={onUpdateFunc}
            />
            <ActiveFilters
              data={data}
              onUpdateFunc={onUpdateFunc}
              displaySaveButton={displaySaveButton}
              displayResetButton={displayResetButton}
              onResetFunc={onResetFunc}
            />
          </>
        )}

        {isLoading && (<div className="is-loading" />)}
        <SaveSearchPopup translationTexts={saveSearchTranslations} />
      </div>
    );
  }
}

ProductFlatFiltersComponent.propTypes = {
  uniqDefaultListId: PropTypes.string.isRequired,
  onUpdateFunc: PropTypes.func.isRequired,
  onResetFunc: PropTypes.func.isRequired,
  displaySaveButton: PropTypes.bool,
  displayResetButton: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
  dataSource: PropTypes.arrayOf(PropTypes.any).isRequired,
  isLoading: PropTypes.bool,
};
ProductFlatFiltersComponent.defaultProps = {
  data: {},
  isLoading: false,
  displaySaveButton: true,
  displayResetButton: true,
};

const ProductFlatFilters = connect()(ProductFlatFiltersComponent);
export default ProductFlatFilters;
