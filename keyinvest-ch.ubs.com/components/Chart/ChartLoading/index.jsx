import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ChartPlaceholder from '../ChartPlaceholder';

const ChartLoading = ({ className, showPlaceholder }) => (
  <div className={classNames('ChartLoading', className)}>
    {showPlaceholder && (
      <ChartPlaceholder className="loader">
        <div className="is-loading" />
      </ChartPlaceholder>
    )}
    {!showPlaceholder && (
      <div className="is-loading" />
    )}
  </div>
);

ChartLoading.propTypes = {
  className: PropTypes.string,
  showPlaceholder: PropTypes.bool,
};

ChartLoading.defaultProps = {
  className: '',
  showPlaceholder: true,
};
export default React.memo(ChartLoading);
