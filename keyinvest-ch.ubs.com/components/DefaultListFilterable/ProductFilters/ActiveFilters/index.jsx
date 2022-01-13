import React from 'react';
import PropTypes from 'prop-types';
import {
  pathOr, propEq, reject,
} from 'ramda';
import ActiveFilterItem from './ActiveFilterItem';
import './ActiveFilters.scss';
import {
  getActiveValues,
  getFiltersActiveTags,
} from './ActiveFilters.helper';
import ActiveFiltersButtons from './ActiveFiltersButtons';
import { getProductFilterComponentByKey } from '../../../Filters/productFiltersConfig';
import FilterRange from '../../../Filters/FilterRange';

function ActiveFilters({
  data, readOnly, onUpdateFunc, onResetFunc,
  displayResetButton, displaySaveButton,
}) {
  const rangeActiveFilterClicked = (itemFilterKey, additionalData) => {
    if (additionalData && additionalData.type === 'end') {
      onUpdateFunc(`${itemFilterKey}-start`, additionalData.currentStartValue);
      onUpdateFunc(`${itemFilterKey}-end`, additionalData.maxValue);
    }
    if (additionalData && additionalData.type === 'start') {
      onUpdateFunc(`${itemFilterKey}-start`, additionalData.minValue);
      onUpdateFunc(`${itemFilterKey}-end`, additionalData.currentEndValue);
    }
  };

  const onActiveFilterItemClick = (itemValue, itemFilterKey, filterLevel, additionalData) => {
    if (typeof onUpdateFunc === 'function') {
      const filterType = getProductFilterComponentByKey(itemFilterKey);
      if (filterType === FilterRange) {
        rangeActiveFilterClicked(itemFilterKey, additionalData);
      } else {
        const filterObj = pathOr({}, [filterLevel, itemFilterKey], data);
        const filterActiveValues = getActiveValues(filterObj, itemFilterKey, filterLevel);
        const result = reject(
          propEq('value', itemValue),
          filterActiveValues,
        );
        onUpdateFunc(itemFilterKey, result.map((o) => o.value));
      }
    }
  };

  const getActiveFilterItems = () => getFiltersActiveTags(data).map((activeItem) => (
    <ActiveFilterItem
      data={activeItem}
      filterKey={activeItem.filterKey}
      onItemClick={onActiveFilterItemClick}
      filterLevel={activeItem.filterLevel}
      key={activeItem.filterKey + activeItem.value}
      clickable={!readOnly}
    />
  ));

  return (
    <div className="ActiveFilters">
      {getActiveFilterItems()}
      {((displaySaveButton || displayResetButton) && (
        <ActiveFiltersButtons
          filtersData={data}
          onResetFunc={onResetFunc}
          displaySaveButton={displaySaveButton}
          displayResetButton={displayResetButton}
        />
      ))}
    </div>
  );
}

ActiveFilters.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onUpdateFunc: PropTypes.func,
  onResetFunc: PropTypes.func,
  displaySaveButton: PropTypes.bool,
  displayResetButton: PropTypes.bool,
  readOnly: PropTypes.bool,
};

ActiveFilters.defaultProps = {
  data: {},
  displaySaveButton: false,
  onUpdateFunc: () => {},
  onResetFunc: () => {},
  displayResetButton: false,
  readOnly: false,
};
export default React.memo(ActiveFilters);
