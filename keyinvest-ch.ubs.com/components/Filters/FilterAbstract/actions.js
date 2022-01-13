export const FILTER_ABSTRACT_SET_APPLIED_FILTER = 'FilterAbstract/FILTER_ABSTRACT_SET_APPLIED_FILTER';
export const FILTER_ABSTRACT_RESET_ALL_LIST_FILTERS = 'FilterAbstract/FILTER_ABSTRACT_RESET_ALL_LIST_FILTERS';

export function filterAbstractSetAppliedFilter(
  uniqDefaultListId, filterKey, appliedFilterName, appliedFilterValue,
) {
  return {
    type: FILTER_ABSTRACT_SET_APPLIED_FILTER,
    uniqDefaultListId,
    filterKey,
    appliedFilterName,
    appliedFilterValue,
  };
}

export function filterAbstractResetAllListFilters(uniqDefaultListId) {
  return {
    type: FILTER_ABSTRACT_RESET_ALL_LIST_FILTERS,
    uniqDefaultListId,
  };
}
