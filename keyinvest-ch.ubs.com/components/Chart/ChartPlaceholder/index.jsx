import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import './ChartPlaceholder.scss';

const ChartPlaceholder = ({ children, className }) => (
  <div className={classNames('ChartPlaceholder Chart', className)}>
    <div className="content">
      {children}
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="340"
    >
      <g className="ct-grids">
        <rect
          x="1"
          y="0"
          width="100%"
          height="340"
          className="ct-grid-background-even"
        />
        <rect
          x="1"
          y="0"
          width="100%"
          height="272"
          className="ct-grid-background-odd"
        />
        <rect
          x="1"
          y="0"
          width="100%"
          height="204"
          className="ct-grid-background-even"
        />
        <rect
          x="1"
          y="0"
          width="100%"
          height="136"
          className="ct-grid-background-odd"
        />
        <rect
          x="1"
          y="0"
          width="100%"
          height="68"
          className="ct-grid-background-even"
        />
        <line
          x1="1"
          x2="1"
          y1="0"
          y2="340"
          className="ct-grid ct-horizontal"
        />
        <line
          x1="223.60000000000002"
          x2="223.60000000000002"
          y1="0"
          y2="340"
          className="ct-grid ct-horizontal"
        />
        <line
          x1="446.20000000000005"
          x2="446.20000000000005"
          y1="0"
          y2="340"
          className="ct-grid ct-horizontal"
        />
        <line
          x1="668.8000000000001"
          x2="668.8000000000001"
          y1="0"
          y2="340"
          className="ct-grid ct-horizontal"
        />
        <line
          x1="891.4000000000001"
          x2="891.4000000000001"
          y1="0"
          y2="340"
          className="ct-grid ct-horizontal"
        />
      </g>
    </svg>
  </div>
);

ChartPlaceholder.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

ChartPlaceholder.defaultProps = {
  children: '',
  className: '',
};

export default React.memo(ChartPlaceholder);
