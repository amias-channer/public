import React from 'react';
import Proptypes from 'prop-types';
import { path } from 'ramda';
import { generateUniqId, getProductLink } from '../../utils/utils';
import ProductNavLink from '../ProductNavLink';

function SimpleTable(props) {
  const { columnsToRender, rows, parentComponentName } = props;

  const getTableHeader = () => {
    if (columnsToRender && columnsToRender.length > 0) {
      return columnsToRender.map((column) => <th key={column}>{column}</th>);
    }

    return null;
  };

  const getRowContent = (rowData) => {
    const columnsData = Object.keys(rowData).map(
      (column) => (
        <td key={rowData[column].value}>
          <ProductNavLink
            isin={path(['isin', 'value'])(rowData)}
            parentComponentName={parentComponentName}
            className="link-unstyled"
            to={getProductLink('isin', path(['isin', 'value'])(rowData))}
          >
            {rowData[column].value}
          </ProductNavLink>
        </td>
      ),
    );
    return (<tr key={generateUniqId()}>{columnsData}</tr>);
  };

  const getTableBody = () => {
    if (rows && rows.length > 0) {
      return rows.map((tableRow) => getRowContent(tableRow));
    }
    return null;
  };

  return (
    <div className="SimpleTable">
      <table className="table table-default">
        <thead>
          <tr>{getTableHeader()}</tr>
        </thead>
        <tbody>
          {getTableBody()}
        </tbody>
      </table>
    </div>
  );
}

SimpleTable.propTypes = {
  columnsToRender: Proptypes.arrayOf(Proptypes.any),
  rows: Proptypes.arrayOf(Proptypes.any),
  parentComponentName: Proptypes.string,
};

SimpleTable.defaultProps = {
  columnsToRender: [],
  rows: [],
  parentComponentName: 'Simple Instrument Table',
};

export default React.memo(SimpleTable);
