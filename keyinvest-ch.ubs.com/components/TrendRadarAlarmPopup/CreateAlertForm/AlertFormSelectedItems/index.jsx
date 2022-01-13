import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { memoizeWith } from 'ramda';
import {
  getFormFieldsByAlertMethodFromPopupState,
  getSelectedValuesForFormFields,
  isAnHiddenField,
  shouldDisplayFieldKeyForSelectionsPreview,
  STATE_KEY_TREND_RADAR_ALARM_POPUP,
} from '../../TrendRadarAlarmPopup.helper';
import AlertFormSelectedItem from './AlertFormSelectedItem';
import i18n from '../../../../utils/i18n';
import { STATE_KEY_BACKEND_SEARCHABLE_DROPDOWN_LIST } from '../../../BackendSearchableDropdownList/BackendSearchableDropdownList.helper';

export const AlertFormSelectedItemsCmp = ({
  selectedAlertMethod, trendRadarAlarmPopupState, backendSearchableState,
}) => {
  const selectedFormFields = getSelectedValuesForFormFields(
    getFormFieldsByAlertMethodFromPopupState(trendRadarAlarmPopupState, selectedAlertMethod),
    backendSearchableState,
  );
  const getAlertMethodData = memoizeWith(
    (value) => value,
    (value) => ({ label: i18n.t(value) }),
  );

  const getSelectedItems = (fields) => Object.keys(fields).map(
    (field) => fields[field] && Object.keys(fields[field].selected).map(
      (selectedListItem) => !isAnHiddenField(fields[field]) && (
        <AlertFormSelectedItem
          key={selectedListItem}
          data={fields[field].selected[selectedListItem]}
          keyText={`${i18n.t(field)}:`}
          shouldDisplayKeyText={shouldDisplayFieldKeyForSelectionsPreview(fields[field])}
        />
      ),
    ),
  );
  return (
    <div className="AlertFormSelectedItems">
      {<AlertFormSelectedItem
        keyText={`${i18n.t('AlarmTyp')}:`}
        data={getAlertMethodData(selectedAlertMethod)}
      />}
      {getSelectedItems(selectedFormFields)}
    </div>
  );
};

AlertFormSelectedItemsCmp.propTypes = {
  selectedAlertMethod: PropTypes.string,
  trendRadarAlarmPopupState: PropTypes.objectOf(PropTypes.any),
  backendSearchableState: PropTypes.objectOf(PropTypes.any),
};

AlertFormSelectedItemsCmp.defaultProps = {
  selectedAlertMethod: '',
  trendRadarAlarmPopupState: {},
  backendSearchableState: {},
};

const mapStateToProps = (state) => ({
  trendRadarAlarmPopupState: state[STATE_KEY_TREND_RADAR_ALARM_POPUP],
  backendSearchableState: state[STATE_KEY_BACKEND_SEARCHABLE_DROPDOWN_LIST],
});
export default React.memo(connect(mapStateToProps)(AlertFormSelectedItemsCmp));
