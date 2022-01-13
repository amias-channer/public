import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import UnderlyingChartTableKeyValue from './UnderlyingChartTableKeyValue';

const UnderlyingChartTableDetailsRowCmp = ({
  row, columns, className,
}) => (
  <tr className={classNames('UnderlyingChartTableDetailsRow', className)}>
    <td />
    <td colSpan={Object.keys(columns).length - 1}>
      {row.identifiers && row.identifiers.map((identifierField) => (
        <span className="identifier-field" key={identifierField.label}>
          {typeof identifierField.value !== 'undefined' && (
            <>
              <span className="field-name">{`${identifierField.label}: `}</span>
              <span className="field-value">{identifierField.value}</span>
            </>
          )}
        </span>
      ))}

      <div className="row">
        <div className="col-lg-6">
          {row.left && (
          <UnderlyingChartTableKeyValue className="left-table" rows={row.left} />
          )}
        </div>
        <div className="col-lg-6">
          {row.right && (
          <UnderlyingChartTableKeyValue className="right-table" rows={row.right} />
          )}
        </div>
      </div>
    </td>
    <td />
  </tr>
);

UnderlyingChartTableDetailsRowCmp.propTypes = {
  row: PropTypes.objectOf(PropTypes.any),
  columns: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};
UnderlyingChartTableDetailsRowCmp.defaultProps = {
  row: {},
  columns: {},
  className: '',
};

const UnderlyingChartTableDetailsRow = React.memo(UnderlyingChartTableDetailsRowCmp);
export default UnderlyingChartTableDetailsRow;
