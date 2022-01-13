import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../../../Icon';
import './FilterIcon.scss';

const FilterIcon = ({ className }) => (
  <span className={classNames('FilterIcon', 'rounded-circle', className)}>
    <Icon type="glass" />
  </span>
);

FilterIcon.propTypes = {
  className: PropTypes.string,
};
FilterIcon.defaultProps = {
  className: '',
};

export default React.memo(FilterIcon);
