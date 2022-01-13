import { injectUniqIds } from '../../../utils/utils';

export const OPEN_SIDE_MENU = 'NavigationMenu/OPEN_SIDE_MENU';
export const TOGGLE_SUBMENU = 'NavigationMenu/TOGGLE_SUBMENU';
export const CLOSE_OTHER_SUB_MENUS = 'NavigationMenu/CLOSE_OTHER_SUB_MENUS';
export const CLOSE_ALL_SUB_MENUS = 'NavigationMenu/CLOSE_ALL_SUB_MENUS';
export const CLOSE_SIDE_MENU = 'NavigationMenu/CLOSE_SIDE_MENU';
export const GOT_NAVIGATION_ITEMS = 'NavigationMenu/GOT_NAVIGATION_ITEMS';

export function openSideMenuAction() {
  return {
    type: OPEN_SIDE_MENU,
  };
}

export function closeSideMenuAction() {
  return {
    type: CLOSE_SIDE_MENU,
  };
}

export function toggleSubMenuAction(item) {
  return {
    type: TOGGLE_SUBMENU,
    item,
  };
}

export function closeOtherSubMenusAction(item) {
  return {
    type: CLOSE_OTHER_SUB_MENUS,
    item,
  };
}

export function closeAllSubMenusAction() {
  return {
    type: CLOSE_ALL_SUB_MENUS,
  };
}

export function gotNavigationItems(items, tools) {
  return {
    type: GOT_NAVIGATION_ITEMS,
    items: injectUniqIds(items),
    tools: injectUniqIds(tools),
  };
}
