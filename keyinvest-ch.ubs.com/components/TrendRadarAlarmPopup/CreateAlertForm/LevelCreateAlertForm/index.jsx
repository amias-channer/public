import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Alert, Row } from 'reactstrap';
import { memoizeWith } from 'ramda';
import { getFormFieldComponentByKey } from '../formFieldsConfig';
import { isAnHiddenField } from '../../TrendRadarAlarmPopup.helper';

/**
 * getStateDataSource
 * @param selectedAlertMethod
 * @param level
 * @param index
 * @type {function(*=): (*)}
 */
export const getStateDataSource = memoizeWith(
  (selectedAlertMethod, level, index) => `${selectedAlertMethod}_${level}_${index}`,
  (selectedAlertMethod, level, index) => ['data', 'create_alert', selectedAlertMethod, 'formFields', level, index],
);

const LevelCreateAlertForm = ({
  data, level, onFieldChange, selectedAlertMethod,
}) => (
  <div className={classNames('LevelCreateAlertForm', level, selectedAlertMethod)}>
    <Row>
      {data.map((formField, index) => {
        const FormFieldComponent = getFormFieldComponentByKey(formField.type);
        if (!FormFieldComponent && !isAnHiddenField(formField)) {
          return (
            <Alert
              key={formField.type}
              color="danger"
              className="col"
            >
              {`The Form field of type "${formField.type}" for "${formField.label}" is not mapped in formFieldsConfig.jsx`}
            </Alert>
          );
        }
        return !isAnHiddenField(formField) && (
          <FormFieldComponent
            data={formField}
            key={formField.key}
            className={classNames('col col-md-auto col-sm-12 form-field', formField.key)}
            onFieldChange={onFieldChange}
            uniqId={formField.uuid}
            stateDataSource={getStateDataSource(selectedAlertMethod, level, index)}
            type={formField.type}
          />
        );
      })}
    </Row>
  </div>
);

LevelCreateAlertForm.propTypes = {
  level: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
  onFieldChange: PropTypes.func,
  selectedAlertMethod: PropTypes.string,
};
LevelCreateAlertForm.defaultProps = {
  level: '',
  data: [],
  onFieldChange: () => {},
  selectedAlertMethod: '',
};

export default React.memo(LevelCreateAlertForm);
