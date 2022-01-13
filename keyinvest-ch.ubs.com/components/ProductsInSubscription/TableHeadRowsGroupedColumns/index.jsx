import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TableHeadRowsGroupedColumns = ({ headerGroupedColumns, columnsToRender, className }) => (
  <>
    <tr className={classNames('TableHeadRowsGroupedColumns', className)}>
      {Object.keys(headerGroupedColumns).map((groupedColumn, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={`${groupedColumn}-${index}`}>
          <th>
            {headerGroupedColumns[groupedColumn].map(
              (groupedColumnItem) => columnsToRender[groupedColumnItem]
        && (
        <span key={groupedColumnItem}>
          {columnsToRender[[groupedColumnItem]]}
        </span>
        ),
            )}
          </th>
        </Fragment>
      ))}
    </tr>
  </>
);

TableHeadRowsGroupedColumns.propTypes = {
  headerGroupedColumns: PropTypes.objectOf(PropTypes.any),
  columnsToRender: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};

TableHeadRowsGroupedColumns.defaultProps = {
  headerGroupedColumns: {},
  columnsToRender: {},
  className: '',
};

export default React.memo(TableHeadRowsGroupedColumns);
