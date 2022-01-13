import CheckboxesList from '../../CheckboxesList';
import TextInputWithTitle from '../../TextInputWithTitle';
import IconInputText from '../../IconInputText';
import {
  FORM_FIELD_CHECKBOX_LIST,
  FORM_FIELD_ICON_INPUT_TEXT,
  FORM_FIELD_INPUT_TEXT,
  FORM_FIELD_SEARCHABLE_CHECKBOX_DROPDOWN_LIST,
  FORM_FIELD_UNDERLYING_SEARCHABLE_CHECKBOX_DROPDOWN_LIST,
} from './CreateAlertForm.helper';
import UnderlyingBackendSearchableDropdownList
  from '../../UnderlyingBackendSearchableDropdownList';
import Logger from '../../../utils/logger';
import SearchableDropdownCheckboxList
  from '../../SearchableDropdownCheckboxList';

// eslint-disable-next-line import/prefer-default-export
export const getFormFieldComponentByKey = (fieldKey) => {
  try {
    const formFieldsMapping = {
      [FORM_FIELD_SEARCHABLE_CHECKBOX_DROPDOWN_LIST]: SearchableDropdownCheckboxList,
      // eslint-disable-next-line max-len
      [FORM_FIELD_UNDERLYING_SEARCHABLE_CHECKBOX_DROPDOWN_LIST]: UnderlyingBackendSearchableDropdownList,
      [FORM_FIELD_CHECKBOX_LIST]: CheckboxesList,
      [FORM_FIELD_INPUT_TEXT]: TextInputWithTitle,
      [FORM_FIELD_ICON_INPUT_TEXT]: IconInputText,
    };
    return formFieldsMapping[fieldKey];
  } catch (e) {
    Logger.warn('CreateAlertForm::getFormFieldComponentByKey', e);
  }
  return null;
};
