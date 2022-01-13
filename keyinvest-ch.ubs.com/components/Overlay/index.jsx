import React from 'react';
import PropTypes from 'prop-types';
import './Overlay.scss';

const Overlay = ({ children }) => (
  <div id="Overlay">
    {children}
  </div>
);

Overlay.propTypes = {
  children: PropTypes.oneOfType(
    [
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ],
  ),
};

Overlay.defaultProps = {
  children: {},
};

export default React.memo(Overlay);
