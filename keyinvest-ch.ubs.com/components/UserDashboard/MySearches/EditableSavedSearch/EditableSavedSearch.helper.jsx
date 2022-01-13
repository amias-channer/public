export const SAVED_SEARCH_TYPES = {
  FILTER: 'search',
  ALARM: 'alarm',
  ALARM_TRIGGERED: 'alarm-triggered',
  SAVED: 'saved',
};

export const SAVED_SEARCH_ICONS = {
  [SAVED_SEARCH_TYPES.FILTER]: 'glass',
  [SAVED_SEARCH_TYPES.ALARM]: 'bell',
  [SAVED_SEARCH_TYPES.ALARM_TRIGGERED]: 'bell-yellow',
  [SAVED_SEARCH_TYPES.SAVED]: 'trendradar',
};

export const getSavedItemIconFromType = (
  type,
  isTriggered,
) => {
  if (isTriggered) {
    return SAVED_SEARCH_ICONS[SAVED_SEARCH_TYPES.ALARM_TRIGGERED];
  }
  return SAVED_SEARCH_ICONS[type] || SAVED_SEARCH_ICONS[SAVED_SEARCH_TYPES.FILTER];
};
