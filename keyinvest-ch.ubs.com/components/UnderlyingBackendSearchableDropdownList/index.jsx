/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BackendSearchableDropdownList from '../BackendSearchableDropdownList';
import { dataUnderlyingTransform } from './UnderlyingBackendSearchableDropdownList.helper';

const UnderlyingBackendSearchableDropdownList = (props) => {
  const { className } = props;
  return (
    <BackendSearchableDropdownList
      {...props}
      className={classNames('UnderlyingBackendSearchableDropdownList', className)}
      dataTransformFunc={dataUnderlyingTransform}
    />
  );
};

UnderlyingBackendSearchableDropdownList.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  className: PropTypes.string,
  uniqId: PropTypes.string.isRequired,
  list: PropTypes.objectOf(PropTypes.any),
  stateDataSource: PropTypes.arrayOf(PropTypes.any),
};

UnderlyingBackendSearchableDropdownList.defaultProps = {
  data: {
    settings: {
      onlySingleItemSelection: false,
    },
  },
  dispatch: () => {},
  className: '',
  list: {},
  stateDataSource: null,
};
export default React.memo(UnderlyingBackendSearchableDropdownList);
