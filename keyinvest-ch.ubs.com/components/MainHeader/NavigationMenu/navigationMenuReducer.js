import { produce } from 'immer';
import {
  CLOSE_ALL_SUB_MENUS,
  CLOSE_OTHER_SUB_MENUS,
  CLOSE_SIDE_MENU,
  GOT_NAVIGATION_ITEMS,
  OPEN_SIDE_MENU,
  TOGGLE_SUBMENU,
} from './actions';

const initialState = {
  isOpen: false,
  items: [],
  tools: [],
};

const navigationMenuReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case CLOSE_OTHER_SUB_MENUS:
      return {
        ...draft,
        items: draft.items.map((item) => (item.id === action.item.id ? item : {
          ...item,
          submenuActive: false,
        })),
        tools: draft.tools ? draft.tools.map((item) => (item.id === action.item.id ? item : {
          ...item,
          submenuActive: false,
        })) : [],
      };

    case CLOSE_ALL_SUB_MENUS:
      return {
        ...draft,
        items: draft.items.map((item) => ({
          ...item,
          submenuActive: false,
        })),
        tools: draft.tools ? draft.tools.map((item) => ({
          ...item,
          submenuActive: false,
        })) : [],
      };

    case OPEN_SIDE_MENU:
      draft.isOpen = true;
      return draft;

    case CLOSE_SIDE_MENU:
      draft.isOpen = false;
      return draft;

    case TOGGLE_SUBMENU:
      return {
        ...draft,
        items: draft.items.map((item) => (item.id === action.item.id ? {
          ...item,
          submenuActive: !item.submenuActive,
        } : item)),
        tools: draft.tools.map((item) => (item.id === action.item.id ? {
          ...item,
          submenuActive: !item.submenuActive,
        } : item)),
      };
    case GOT_NAVIGATION_ITEMS:
      return {
        ...draft,
        items: action.items,
        tools: action.tools,
      };

    default:
      return draft;
  }
});

export default navigationMenuReducer;
