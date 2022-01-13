import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const UnderlyingChartTableCollapseCmp = ({
  rowId, toggleRowFunc, className, isOpen,
}) => {
  const toggleRow = () => toggleRowFunc(rowId);
  return (
    <div className={classNames('UnderlyingChartTableToggle', className)}>
      <button className="btn btn-outline" onClick={toggleRow} type="button">
        <i className={isOpen ? 'icon-arrow_02_up' : 'icon-arrow_02_down'} />
      </button>
    </div>
  );
};

UnderlyingChartTableCollapseCmp.propTypes = {
  rowId: PropTypes.oneOfType(
    [PropTypes.string, PropTypes.number],
  ).isRequired,
  className: PropTypes.string,
  toggleRowFunc: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};
UnderlyingChartTableCollapseCmp.defaultProps = {
  className: '',
  isOpen: false,
};

const UnderlyingChartTableCollapse = React.memo(UnderlyingChartTableCollapseCmp);
export default UnderlyingChartTableCollapse;
