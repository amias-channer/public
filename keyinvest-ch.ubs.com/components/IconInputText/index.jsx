import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import './IconInputText.scss';
import { pathOrString } from '../../utils/typeChecker';

const IconInputText = ({
  data, className, type, onFieldChange, stateDataSource,
}) => {
  const onInputTextChange = (e) => {
    onFieldChange(e, stateDataSource, type);
  };
  const iconType = pathOrString('', ['settings', 'iconType'], data);
  const placeholderText = pathOrString('', ['settings', 'placeholderText'], data);
  return (
    <div className={classNames('IconInputText', className)}>
      {iconType && (
        <Icon type={iconType} />
      )}
      <input type="text" placeholder={placeholderText} onChange={onInputTextChange} />
    </div>
  );
};

IconInputText.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  onFieldChange: PropTypes.func,
  type: PropTypes.string,
  stateDataSource: PropTypes.arrayOf(PropTypes.any),
};

IconInputText.defaultProps = {
  data: {
    placeholderText: '',
    iconType: '',
  },
  className: '',
  onFieldChange: () => {},
  type: '',
  stateDataSource: [],
};

export default IconInputText;
