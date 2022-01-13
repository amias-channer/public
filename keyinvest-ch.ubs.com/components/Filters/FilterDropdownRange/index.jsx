import { connect } from 'react-redux';
import { equals } from 'ramda';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import { filterAbstractSetAppliedFilter } from '../FilterAbstract/actions';
import { SUB_FILTER_TYPE_INPUT_TEXT } from '../Filters.helper';
import { dataSelector } from './selector';
import {
  getActiveListItems,
  getSelectedListItems,
} from '../FilterAbstract/FilterAbstractDropdown/FilterAbstractDropdown.helper';

export class FilterDropdownRangeComponent extends FilterAbstractDropdown {
  constructor(props) {
    super(props);
    this.filterClassName = 'FilterDropdownRange';
  }

  applyFilters() {
    const {
      onFilterChange, filterKey, level, data,
    } = this.props;
    const selectedItems = getSelectedListItems(data);
    const activeItems = getActiveListItems(data);

    if (equals(selectedItems, activeItems)) {
      this.closeFilterMenu();
      return;
    }

    onFilterChange(filterKey, selectedItems, level);
    this.closeFilterMenu();
  }

  onInputTextChange(e) {
    const { dispatch, uniqDefaultListId, filterKey } = this.props;
    const searchText = e.target.value;

    dispatch(filterAbstractSetAppliedFilter(
      uniqDefaultListId,
      filterKey,
      SUB_FILTER_TYPE_INPUT_TEXT,
      searchText,
    ));
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: dataSelector(state, ownProps),
});

const FilterDropdownRange = connect(mapStateToProps)(FilterDropdownRangeComponent);
export default FilterDropdownRange;
