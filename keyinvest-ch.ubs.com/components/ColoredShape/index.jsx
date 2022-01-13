import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './ColoredShape.scss';

const ColoredShape = ({
  color, width, height, className, children,
}) => (
  <span
    className={classNames('ColoredShape', className)}
    style={{
      width,
      height,
      backgroundColor: color,
    }}
  >
    {children}
  </span>
);

ColoredShape.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.node, PropTypes.arrayOf(PropTypes.node),
  ]),
};
ColoredShape.defaultProps = {
  className: '',
  color: 'initial',
  width: '10px',
  height: '10px',
  children: null,
};

export default React.memo(ColoredShape);
