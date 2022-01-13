import { pathOr } from 'ramda';

export const ALERT_METHOD_PATTERN_BREAKOUT = 'patternBreakout';
export const FIELDS_LEVEL_FIRST = 'firstLevel';
export const FIELDS_LEVEL_SECOND = 'secondLevel';
export const FIELDS_LEVEL_THIRD = 'thirdLevel';

export const FORM_FIELD_SEARCHABLE_CHECKBOX_DROPDOWN_LIST = 'searchableCheckboxDropdownList';
export const FORM_FIELD_UNDERLYING_SEARCHABLE_CHECKBOX_DROPDOWN_LIST = 'underlyingSearchableCheckboxDropdownList';
export const FORM_FIELD_CHECKBOX_LIST = 'checkboxList';
export const FORM_FIELD_CHECKBOX = 'checkbox';
export const FORM_FIELD_INPUT_TEXT = 'inputText';
export const FORM_FIELD_ICON_INPUT_TEXT = 'iconInputText';

export const STATE_KEY_EMAIL_NOTIFICATIONS = 'emailNotifications';

export const getFormElementsByLevel = (level, data, selectedAlertMethod) => pathOr([], [selectedAlertMethod, 'formFields', level], data);

export const getIsEmailNotificationsChecked = (
  data,
  selectedAlertMethod,
) => pathOr(
  ALERT_METHOD_PATTERN_BREAKOUT === selectedAlertMethod,
  [selectedAlertMethod, STATE_KEY_EMAIL_NOTIFICATIONS],
  data,
);
