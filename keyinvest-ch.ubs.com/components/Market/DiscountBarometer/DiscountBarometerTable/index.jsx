import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { filter } from 'ramda';
import './DiscountBarometerTable.scss';

function DiscountBarometerTableComponent(props) {
  const { className, data } = props;
  const columns = filter((k) => k !== 'key', Object.keys(data && data[0] ? data[0] : []));
  return (
    <table className={classNames('DiscountBarometerTable', 'table-default', className)}>
      <thead>
        <tr>
          {columns.map((columnName) => <th key={columnName}>{columnName}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.key}>
            {columns.map((columnName) => <td key={columnName}>{row[columnName]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
DiscountBarometerTableComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(PropTypes.any),
  ]),
};
DiscountBarometerTableComponent.defaultProps = {
  data: [],
  className: undefined,
};
const DiscountBarometerTable = React.memo(DiscountBarometerTableComponent);
export default DiscountBarometerTable;
