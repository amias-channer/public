import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './ToolsBar.scss';

const ToolsBar = ({ children, className }) => (
  <div className={classNames(className, 'ToolsBar row')}>
    {children}
  </div>
);

ToolsBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
ToolsBar.defaultProps = {
  children: '',
  className: '',
};

export default React.memo(ToolsBar);
