import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import HtmlText from '../../../../HtmlText';
import './UnderlyingChartTableKeyValue.scss';
import ValueRender from '../../../../ValueRender';

const UnderlyingChartTableKeyValueCmp = ({
  rows, className,
}) => (
  <div className={classNames('UnderlyingChartTableKeyValue', className)}>
    {rows && rows.length > 0 && rows.map((row) => (
      <div className="row field" key={row.label}>
        <div className="col-8 label">
          <HtmlText data={{ text: row.label ? row.label : '' }} />
        </div>
        <div className="col-4 text-right value">
          <ValueRender field={row} extraProps={{ displayCurrency: true }} />
        </div>
      </div>
    ))}
  </div>
);

UnderlyingChartTableKeyValueCmp.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
};
UnderlyingChartTableKeyValueCmp.defaultProps = {
  rows: [],
  className: '',
};

const UnderlyingChartTableKeyValue = React.memo(UnderlyingChartTableKeyValueCmp);
export default UnderlyingChartTableKeyValue;
