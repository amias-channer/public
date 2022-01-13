import {
  pathOr, pipe, flatten, values, filter, map,
} from 'ramda';
import { STATE_KEY_BACKEND_SEARCHABLE_DROPDOWN_LIST } from '../BackendSearchableDropdownList/BackendSearchableDropdownList.helper';
import {
  FORM_FIELD_CHECKBOX_LIST,
  FORM_FIELD_ICON_INPUT_TEXT,
  FORM_FIELD_INPUT_TEXT,
  FORM_FIELD_SEARCHABLE_CHECKBOX_DROPDOWN_LIST,
  FORM_FIELD_UNDERLYING_SEARCHABLE_CHECKBOX_DROPDOWN_LIST,
  STATE_KEY_EMAIL_NOTIFICATIONS,
} from './CreateAlertForm/CreateAlertForm.helper';
import i18n from '../../utils/i18n';

export const STATE_KEY_TREND_RADAR_ALARM_POPUP = 'trendRadarAlarmPopup';

export const getAlertMethods = (data) => pathOr([], ['alert_methods'], data);

export const getCreateAlertFormData = (data) => pathOr({}, ['create_alert'], data);

export const getState = (state) => state;
export const getPopupState = (state) => state[STATE_KEY_TREND_RADAR_ALARM_POPUP];
export const getBackendSearchableState = (
  state,
) => state[STATE_KEY_BACKEND_SEARCHABLE_DROPDOWN_LIST];

export const getFormFieldsByAlertMethodFromPopupState = (popupState, alertMethod) => pathOr({}, ['data', 'create_alert', alertMethod, 'formFields'], popupState);
export const getFormFieldsByAlertMethodFromStore = (state, alertMethod) => pathOr({}, [STATE_KEY_TREND_RADAR_ALARM_POPUP, 'data', 'create_alert', alertMethod, 'formFields'], state);
export const getFormQueryParameters = (state) => ({ queryParameters: pathOr({}, [STATE_KEY_TREND_RADAR_ALARM_POPUP, 'data', 'query_parameters'], state) });
export const getShouldEnableEmailNotificationsByAlertMethod = (popupState, alertMethod) => pathOr({}, ['data', 'create_alert', alertMethod, STATE_KEY_EMAIL_NOTIFICATIONS], popupState);

const getBackendSearchableDropdownSelectedValues = (backendSearchableState, listId) => pathOr({}, [listId, 'activeItems'], backendSearchableState);

export const isAnHiddenField = (field) => pathOr(false, ['settings', 'isHidden'], field);
export const isRequiredField = (field) => pathOr(false, ['settings', 'isRequired'], field);
export const shouldDisplayFieldKeyForSelectionsPreview = (field) => pathOr(true, ['settings', 'displayKeyForSelectionsPreview'], field);

export const getCheckboxListSelectedValues = (list) => {
  const selectedValues = [];
  list.forEach((listItem) => {
    if (listItem.checked) {
      selectedValues.push(listItem);
    }
  });
  return selectedValues;
};

const getInputTextSelectedValue = (formField) => {
  const selectedValues = [];
  if (formField.fieldValue) {
    selectedValues.push({ label: formField.fieldValue });
  }
  return selectedValues;
};

const getSelectedValuesByFormFieldType = (formField, backendSearchableState = {}) => {
  switch (formField.type) {
    case FORM_FIELD_SEARCHABLE_CHECKBOX_DROPDOWN_LIST:
      return getCheckboxListSelectedValues(values(formField.fieldValue));
    case FORM_FIELD_UNDERLYING_SEARCHABLE_CHECKBOX_DROPDOWN_LIST:
      return getBackendSearchableDropdownSelectedValues(
        backendSearchableState,
        formField.uuid,
      );
    case FORM_FIELD_CHECKBOX_LIST:
      return getCheckboxListSelectedValues(formField.fieldValue);
    case FORM_FIELD_INPUT_TEXT:
    case FORM_FIELD_ICON_INPUT_TEXT:
      return getInputTextSelectedValue(formField);
    default:
      break;
  }
  return [];
};

export const getSelectedValuesForFormFields = (formFields, backendSearchableState) => {
  const selectedValues = {};
  const emptyObj = {};
  Object.keys(formFields).forEach((level) => {
    formFields[level].forEach((formField) => {
      selectedValues[formField.key] = {
        selected: getSelectedValuesByFormFieldType(formField, backendSearchableState),
        settings: { ...pathOr(emptyObj, ['settings'], formField) },
      };
    });
  });
  return selectedValues;
};

export const validateFormFields = (formSelectedData, formFields) => {
  const formErrors = [];
  formFields.forEach((formField) => {
    if (isRequiredField(formField) && !isAnHiddenField(formField)) {
      if (!formSelectedData.selectedFields[formField.key]
        || Object.keys(formSelectedData.selectedFields[formField.key]).length < 1) {
        formErrors.push(`${formField.label} ${i18n.t('is_required')}`);
      }
    }
  });
  return formErrors;
};

export const getFormFieldsForLevels = (formFields) => {
  const formFieldsForLevels = pipe(values, flatten);
  return formFieldsForLevels(formFields);
};

const isCheckboxSelected = (checkboxItem) => checkboxItem.checked;
const getCheckboxValue = (checkboxItem) => checkboxItem.value;
export const getSelectedCheckboxItems = (
  checkboxList,
) => pipe(filter(isCheckboxSelected), map(getCheckboxValue))(checkboxList);

export const getFormSelectedDataToSubmit = (
  selectedAlertForm,
  popupState,
  backendSearchableState,
) => {
  const formFieldsDataByLevel = getFormFieldsByAlertMethodFromPopupState(
    popupState,
    selectedAlertForm,
  );
  const shouldSendEmailNotifications = getShouldEnableEmailNotificationsByAlertMethod(
    popupState,
    selectedAlertForm,
  );
  const dataToSubmit = {
    selectedAlertForm,
    selectedFields: {},
    [STATE_KEY_EMAIL_NOTIFICATIONS]: shouldSendEmailNotifications,
  };
  Object.keys(formFieldsDataByLevel).forEach((level) => {
    formFieldsDataByLevel[level].forEach((field) => {
      switch (field.type) {
        case FORM_FIELD_SEARCHABLE_CHECKBOX_DROPDOWN_LIST:
          dataToSubmit.selectedFields[field.key] = getSelectedCheckboxItems(
            values(field.fieldValue),
          );
          break;
        case FORM_FIELD_UNDERLYING_SEARCHABLE_CHECKBOX_DROPDOWN_LIST:
          dataToSubmit.selectedFields[field.key] = Object.keys(pathOr({}, [
            field.uuid,
            'activeItems',
          ], backendSearchableState));
          break;
        case FORM_FIELD_CHECKBOX_LIST:
          dataToSubmit.selectedFields[field.key] = getSelectedCheckboxItems(field.fieldValue);
          break;
        default:
          dataToSubmit.selectedFields[field.key] = field.fieldValue;
          break;
      }
    });
  });
  return dataToSubmit;
};
