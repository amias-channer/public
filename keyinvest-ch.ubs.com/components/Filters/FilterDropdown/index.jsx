import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { equals } from 'ramda';
import {
  FILTER_TYPE_DROPDOWN, SUB_FILTER_TYPE_INPUT_TEXT,
} from '../Filters.helper';
import './FilterDropdown.scss';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import { dataSelector, getData } from './selector';
import {
  filterAbstractResetAllListFilters,
  filterAbstractSetAppliedFilter,
} from '../FilterAbstract/actions';
import {
  getActiveListItems,
  getSelectedListItems,
} from '../FilterAbstract/FilterAbstractDropdown/FilterAbstractDropdown.helper';
import { BUTTON_SIZE } from '../../Button';

export class FilterDropdownComponent extends FilterAbstractDropdown {
  applyFilters() {
    const {
      onFilterChange, filterKey, level, data, dispatch, uniqDefaultListId, syncedData,
    } = this.props;
    const selectedItems = getSelectedListItems(syncedData);
    const activeItems = getActiveListItems(data);

    if (equals(selectedItems, activeItems)) {
      this.closeFilterMenu();
      return;
    }
    this.clearTextInput();
    dispatch(filterAbstractResetAllListFilters(uniqDefaultListId));
    onFilterChange(filterKey, selectedItems, level);
    this.closeFilterMenu();
  }

  onInputTextChange(e) {
    const { dispatch, uniqDefaultListId, filterKey } = this.props;
    const searchText = e.target.value;

    this.resetListItemsRefs();

    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_INPUT_TEXT,
      searchText,
    ));
  }
}

FilterDropdownComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};
FilterDropdownComponent.defaultProps = {
  type: FILTER_TYPE_DROPDOWN,
  className: '',
  buttonsSize: BUTTON_SIZE.MEDIUM,
};

const mapStateToProps = (state, ownProps) => ({
  data: dataSelector(state, ownProps),
  syncedData: getData(state, ownProps),
});
const FilterDropdown = connect(mapStateToProps)(FilterDropdownComponent);
export default FilterDropdown;
