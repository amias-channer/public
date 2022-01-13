import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CheckboxInput from '../CheckboxInput';
import './CheckboxesList.scss';
import FieldTooltips from '../ProductDetail/FieldTooltips';
import { pathOrArray, pathOrString } from '../../utils/typeChecker';
import { isEmptyData } from '../../utils/utils';

const CheckboxesList = ({
  data, className, type, onFieldChange, stateDataSource,
}) => {
  const fieldNotifications = pathOrArray([], ['settings', 'fieldNotifications'], data);
  const title = pathOrString('', ['label'], data);
  return (
    <div className={classNames('CheckboxesList', className)}>
      <h3 className="title">
        {title}
        {!isEmptyData(fieldNotifications) && (
          <FieldTooltips list={fieldNotifications} />
        )}
      </h3>
      <div className="list">
        {
          data.fieldValue.map(
            (item, index) => (
              <CheckboxInput
                key={`${item.label}-${item.value}`}
                onChange={onFieldChange}
                label={item.label}
                value={item.value}
                name={`${item.label}-${item.value}`}
                fieldType={type}
                stateDataSource={stateDataSource}
                index={index}
                checked={item.checked}
                isDisabled={item.disabled}
              />
            ),
          )
        }
      </div>
    </div>
  );
};

CheckboxesList.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  type: PropTypes.string,
  onFieldChange: PropTypes.func,
  stateDataSource: PropTypes.arrayOf(PropTypes.any),
};
CheckboxesList.defaultProps = {
  data: {
    label: '',
    fieldValue: [],
  },
  className: '',
  type: '',
  onFieldChange: () => {},
  stateDataSource: [],
};
export default React.memo(CheckboxesList);
