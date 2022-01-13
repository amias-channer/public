import { path, pathOr } from 'ramda';

export const FLYOUT_MENU_ACTION_REMOVE_PRODUCT = 'remove_product';
export const FLYOUT_MENU_ACTION_SET_UP_NOTIFICATION = 'setup_product_notification';

export const getProductTitle = (data) => path(['productTitle'], data);
export const getProductNotifications = (data) => [path(['productNotifications'], data)];
export const getUnderlyingName = (data) => path(['underlyingName'], data);
export const getFlyoutMenuItems = (data) => pathOr([], ['flyoutMenu'], data);
