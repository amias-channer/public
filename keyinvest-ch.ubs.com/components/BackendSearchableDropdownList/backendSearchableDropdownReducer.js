import { produce } from 'immer';
import { mergeLeft, path } from 'ramda';
import {
  BACKEND_SEARCHABLE_DROPDOWN_CHECKBOX_ITEM_CHANGED,
  BACKEND_SEARCHABLE_DROPDOWN_FETCH_DATA,
  BACKEND_SEARCHABLE_DROPDOWN_GOT_DATA, BACKEND_SEARCHABLE_GOT_PUSH_PRICE_DATA,
  BACKEND_SEARCHABLE_MERGE_PRE_SET_LIST,
  BACKEND_SEARCHABLE_ON_SINGLE_ITEM_SELECT,
} from './actions';
import { getSelectedListItems } from './BackendSearchableDropdownList.helper';


const backendSearchableDropdownReducer = (state = {}, action) => produce(state, (draft) => {
  switch (action.type) {
    case BACKEND_SEARCHABLE_DROPDOWN_FETCH_DATA:
      draft.isLoading = true;
      break;
    case BACKEND_SEARCHABLE_DROPDOWN_GOT_DATA:
      if (!draft[action.uniqId]) {
        draft[action.uniqId] = {
          list: {},
          activeItems: {},
        };
      }
      draft[action.uniqId].list = action.data;

      if (draft[action.uniqId] && draft[action.uniqId].activeItems) {
        // merge active items into the new list from backend
        draft[action.uniqId].list = mergeLeft(
          draft[action.uniqId].activeItems,
          draft[action.uniqId].list,
        );
      }
      draft.isLoading = false;
      break;
    case BACKEND_SEARCHABLE_DROPDOWN_CHECKBOX_ITEM_CHANGED:
      if (draft[action.uniqId]
        && draft[action.uniqId].list
        && draft[action.uniqId].list[action.listItemId]
      ) {
        draft[action.uniqId].list[action.listItemId].selected = action.isChecked;
        if (action.isChecked) {
          draft[
            action.uniqId
          ].activeItems[action.listItemId] = draft[action.uniqId].list[action.listItemId];
        } else if (path([action.uniqId, 'activeItems', action.listItemId])) {
          delete draft[action.uniqId].activeItems[action.listItemId];
        }
      }
      break;
    case BACKEND_SEARCHABLE_MERGE_PRE_SET_LIST:
      if (!draft[action.uniqId]) {
        draft[action.uniqId] = {
          list: action.presetList,
          activeItems: getSelectedListItems(action.presetList),
        };
      }
      break;
    case BACKEND_SEARCHABLE_ON_SINGLE_ITEM_SELECT:
      if (action.itemData && action.itemData.value && draft[action.uniqId]
      && draft[action.uniqId].list && draft[action.uniqId].list[action.itemData.value]) {
        // unselect all
        Object.keys(draft[action.uniqId].list).forEach((itemId) => {
          draft[action.uniqId].list[itemId].selected = false;
        });
        // select only the one clicked
        draft[action.uniqId].list[action.itemData.value].selected = true;
        // set selected in active items also
        draft[action.uniqId].activeItems = {};
        draft[action.uniqId].activeItems[action.itemData.value] = mergeLeft(
          { selected: true }, action.itemData,
        );
      }
      break;
    case BACKEND_SEARCHABLE_GOT_PUSH_PRICE_DATA:
      if (action.itemData && action.itemData.value && draft[action.uniqId]
        // eslint-disable-next-line max-len
        && draft[action.uniqId].activeItems && draft[action.uniqId].activeItems[action.itemData.value]) {
        draft[action.uniqId].activeItems[action.itemData.value].pushValue = action.responseData;
      }
      break;
    default:
      break;
  }
});

export default backendSearchableDropdownReducer;
