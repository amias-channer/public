import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import classNames from 'classnames';
import {
  ALERT_METHOD_PATTERN_BREAKOUT,
  FIELDS_LEVEL_FIRST,
  FIELDS_LEVEL_SECOND,
  FIELDS_LEVEL_THIRD,
  FORM_FIELD_CHECKBOX,
  getFormElementsByLevel,
  getIsEmailNotificationsChecked,
  STATE_KEY_EMAIL_NOTIFICATIONS,
} from './CreateAlertForm.helper';
import FieldsLevelCreateAlertForm from './LevelCreateAlertForm';
import CheckboxInput from '../../CheckboxInput';
import AlertFormSelectedItems from './AlertFormSelectedItems';
import Alert from '../../Alert';
import { ALERT_TYPE } from '../../Alert/Alert.helper';
import i18n from '../../../utils/i18n';

const CreateAlertForm = ({
  data, selectedAlertMethod, onFieldChange, formValidationErrors, onFormErrorAlertDismiss,
}) => (
  <div className={classNames('CreateAlertForm mt-2', selectedAlertMethod)}>
    <Row className="form-validation-errors">
      <div className="col">
        {formValidationErrors.length > 0 && formValidationErrors.map(
          (error, index) => (
            <Alert
              key={error}
              index={index}
              onDismiss={onFormErrorAlertDismiss}
              dismissible
              type={ALERT_TYPE.ERROR}
            >
              {error}
            </Alert>
          ),
        )}
      </div>
    </Row>
    <FieldsLevelCreateAlertForm
      data={getFormElementsByLevel(FIELDS_LEVEL_FIRST, data, selectedAlertMethod)}
      level={FIELDS_LEVEL_FIRST}
      onFieldChange={onFieldChange}
      selectedAlertMethod={selectedAlertMethod}
    />
    <FieldsLevelCreateAlertForm
      data={getFormElementsByLevel(FIELDS_LEVEL_SECOND, data, selectedAlertMethod)}
      level={FIELDS_LEVEL_SECOND}
      onFieldChange={onFieldChange}
      selectedAlertMethod={selectedAlertMethod}
    />
    <Row>
      <div className="col alarm-data">
        <FieldsLevelCreateAlertForm
          data={getFormElementsByLevel(FIELDS_LEVEL_THIRD, data, selectedAlertMethod)}
          level={FIELDS_LEVEL_THIRD}
          onFieldChange={onFieldChange}
          selectedAlertMethod={selectedAlertMethod}
        />
        <AlertFormSelectedItems selectedAlertMethod={selectedAlertMethod} />
      </div>
    </Row>
    <Row>
      <div className="col email-notification">
        <CheckboxInput
          name="emailNotifications"
          label={i18n.t('email_notifications')}
          onChange={onFieldChange}
          fieldType={FORM_FIELD_CHECKBOX}
          checked={getIsEmailNotificationsChecked(data, selectedAlertMethod)}
          stateDataSource={['data', 'create_alert', selectedAlertMethod, STATE_KEY_EMAIL_NOTIFICATIONS]}
        />
        <p className="notification-disclaimer">
          {i18n.t(selectedAlertMethod === ALERT_METHOD_PATTERN_BREAKOUT ? `notification_disclaimer_text_${selectedAlertMethod}` : 'notification_disclaimer_text')}
        </p>
      </div>
    </Row>
  </div>
);

CreateAlertForm.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  selectedAlertMethod: PropTypes.string,
  onFieldChange: PropTypes.func,
  onFormErrorAlertDismiss: PropTypes.func,
  formValidationErrors: PropTypes.arrayOf(PropTypes.any),
};

CreateAlertForm.defaultProps = {
  data: {},
  selectedAlertMethod: '',
  onFieldChange: () => {},
  onFormErrorAlertDismiss: () => {},
  formValidationErrors: [],
};

export default React.memo(CreateAlertForm);
