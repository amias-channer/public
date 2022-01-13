import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../../Icon';
import ColoredShape from '../../ColoredShape';
import './TrendRadarSignalDirection.scss';

const TrendRadarSignalDirection = ({
  direction, className,
}) => (
  <ColoredShape
    color=""
    height={32}
    width={32}
    className={classNames(
      'TrendRadarSignalDirection',
      className,
      'rounded-circle',
      direction,
    )}
  >
    <Icon className="signal-direction-icon" type={`arrow-${direction}`} />
  </ColoredShape>
);

TrendRadarSignalDirection.propTypes = {
  className: PropTypes.string,
  direction: PropTypes.string,
};
TrendRadarSignalDirection.defaultProps = {
  className: '',
  direction: '',
};

export default React.memo(TrendRadarSignalDirection);
