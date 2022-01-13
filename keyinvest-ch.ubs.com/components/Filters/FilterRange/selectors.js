import { pathOr } from 'ramda';

const EMPTY_OBJ = {};
export const getData = (state, props) => props.data;
export const getAppliedFilters = (state, props) => pathOr(EMPTY_OBJ, ['appliedListFilters', props.uniqDefaultListId, props.filterKey])(state);
