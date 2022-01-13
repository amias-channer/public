import { parseUrl } from 'query-string';

export const MENU_TYPE_MAIN_MENU = 'main-menu';
export const MENU_TYPE_TOOLS_MENU = 'tools-menu';

export const hasSubNavMenuItems = (item) => !!(item.submenu && item.submenu.length > 0);

const mainNavItemUrlMatchesCurrentUrl = (
  item,
  location,
) => !!(item.url && location.pathname === parseUrl(item.url).url);

const subNavItemUrlMatchesCurrentUrl = (item, location) => {
  let matched = false;
  item.submenu.forEach((subItem) => {
    if (parseUrl(subItem.url).url === location.pathname) {
      matched = true;
    }
  });
  return matched;
};

/**
 * This method determines if the navigation item should be set active or not.
 * If the current browser url matches with the item url, it returns true.
 * If the navigation item has sub-items, it checks if any of the sub-items url matches
 * with the current browser url, if it does, it returns true.
 * In all other cases it returns false.
 * @param match
 * @param location
 * @param item
 * @returns {boolean}
 */
export const isNavItemActive = (match, location, item) => {
  if (mainNavItemUrlMatchesCurrentUrl(item, location)) {
    return true;
  }
  return !!(hasSubNavMenuItems(item) && subNavItemUrlMatchesCurrentUrl(item, location));
};
