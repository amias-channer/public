import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import './TextInputWithTitle.scss';
import FieldTooltips from '../ProductDetail/FieldTooltips';
import {
  pathOrArray,
  pathOrBoolean,
  pathOrString,
} from '../../utils/typeChecker';
import { isEmptyData } from '../../utils/utils';

const TextInputWithTitle = ({
  data, className, type, onFieldChange, stateDataSource,
}) => {
  const onInputTextChange = (e) => {
    onFieldChange(e, stateDataSource, type);
  };
  const label = pathOrString('', ['label'], data);
  const fieldNotifications = pathOrArray([], ['settings', 'fieldNotifications'], data);
  const placeholderText = pathOrString('', ['settings', 'placeholderText'], data);
  const isEditable = pathOrBoolean(true, ['settings', 'isEditable'], data);
  const fieldValue = pathOrString('', ['fieldValue'], data);
  return (
    <div className={classNames('TextInputWithTitle', className)}>
      {label && (
        <h3 className="title">
          {label}
          {!isEmptyData(fieldNotifications) && (
            <FieldTooltips list={fieldNotifications} />
          )}
        </h3>
      )}
      {!isEditable && (
        <h3 className="title">{fieldValue}</h3>
      )}
      {isEditable && (<Input type="text" placeholder={placeholderText} onChange={onInputTextChange} value={fieldValue} />)}
    </div>
  );
};

TextInputWithTitle.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  type: PropTypes.string,
  onFieldChange: PropTypes.func,
  stateDataSource: PropTypes.arrayOf(PropTypes.any),
};

TextInputWithTitle.defaultProps = {
  data: {
    label: '',
    placeholderText: '',
  },
  className: '',
  type: '',
  onFieldChange: () => {},
  stateDataSource: [],
};
export default React.memo(TextInputWithTitle);
