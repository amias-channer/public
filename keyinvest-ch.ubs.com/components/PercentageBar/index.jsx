import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './PercentageBar.scss';

const PercentageBarCmp = ({
  className, value, rawValue,
}) => (
  <div className={classNames(
    'PercentageBar percentBar row diff', className, rawValue >= 0 ? 'positive' : 'negative',
  )}
  >
    <div className="value-bar col-4 bar-negative-zone">
      <span style={{ width: `${rawValue * 100}%` }} />
    </div>
    <div className="value-bar col-4 bar-positive-zone">
      <span style={{ width: `${rawValue * 100}%` }} />
    </div>
    <div className="value-percent col-4">{ value }</div>
  </div>
);
PercentageBarCmp.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  rawValue: PropTypes.number,
};
PercentageBarCmp.defaultProps = {
  className: '',
  value: null,
  rawValue: 0,
};

const PercentageBar = React.memo(PercentageBarCmp);
export default PercentageBar;
