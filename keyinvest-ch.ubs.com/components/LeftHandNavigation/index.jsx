import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './LeftHandNavigation.scss';
import LeftHandNavigationItems from './LeftHandNavigationItems';
import { isEmptyData } from '../../utils/utils';

const LeftHandNavigation = (props) => {
  const { className, data } = props;
  return data && data.navigation && !isEmptyData(data.navigation) && (
    <div className={classNames('LeftHandNavigation', className)}>
      <LeftHandNavigationItems links={data.navigation} />
    </div>
  );
};

LeftHandNavigation.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
};

LeftHandNavigation.defaultProps = {
  className: '',
  data: {},
};

export default React.memo(LeftHandNavigation);
