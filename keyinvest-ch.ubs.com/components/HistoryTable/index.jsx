import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { dropLast, takeLast } from 'ramda';
import classNames from 'classnames';
import { Cell, Row, StickyTable } from 'react-sticky-table';
import { MOBILE_MODE, TABLET_MODE } from '../../utils/responsive';
import HtmlText from '../HtmlText';
import { generateUniqId } from '../../utils/utils';
import Logger from '../../utils/logger';

/**
 * In Mobile, The last 2 columns should be joined
 * to be displayed in the same column table
 * @param list
 * @returns {*[]}
 */
export const getMobileLayout = (list) => {
  if (list && list.length > 2) {
    return [...dropLast(2, list), takeLast(2, list)];
  }
  return list;
};

/**
 * Try to get the first available value in an Object or
 * an Array (in case of multi value in the same column)
 * @param elem
 * @returns {*}
 */
export const getKey = (elem) => {
  if (elem && elem.value) {
    return elem.value;
  }
  if (Array.isArray(elem) && elem.length > 0 && elem[0] && elem[0].value) {
    return elem[0].value;
  }
  Logger.warn('HISTORY_TABLE::getKey', 'Failed to determine a UniqKey', elem);
  return generateUniqId();
};

/**
 * Render a simple or multi-value cell in columns or rows of the table
 * @param cell
 * @returns {*}
 */
export const renderCell = (cell) => {
  if (Array.isArray(cell)) {
    return cell.map((cl) => (
      <HtmlText className={cl.type === 'number' ? 'text-right' : ''} key={getKey(cl)} data={{ text: cl.value }} />
    ));
  }
  return (
    <HtmlText className={cell.type === 'number' ? 'text-right' : ''} key={getKey(cell)} data={{ text: cell.value }} />
  );
};

export const HistoryTableCmp = ({
  columns, rows, className, isMobileMode,
}) => {
  const columnsLayout = isMobileMode ? getMobileLayout(columns) : columns;

  return (
    <div
      style={{
        width: '100%',
        height: `calc(100vh - ${isMobileMode ? '146px' : '300px'})`,
        minHeight: '100px',
      }}
    >
      <StickyTable
        stickyHeaderCount={1}
        leftStickyColumnCount={0}
        borderWidth="1px"
        borderColor="#D8D8D8"
        className={classNames('HistoryTable', 'table-default', className)}
      >
        <Row className="h-tr" key={getKey(columnsLayout)}>
          {columnsLayout.length && columnsLayout.map((column) => (
            <Cell className="h-th" key={getKey(column)}>
              {renderCell(column)}
            </Cell>
          ))}
        </Row>
        {rows.length && rows.map((row) => {
          const rowLayout = isMobileMode ? getMobileLayout(row) : row;
          return (
            <Row className="b-tr" key={getKey(rowLayout)}>
              {rowLayout.length && rowLayout.map((cell) => (
                <Cell className="b-td" key={getKey(cell)}>
                  {renderCell(cell)}
                </Cell>
              ))}
            </Row>
          );
        })}
      </StickyTable>
    </div>
  );
};

HistoryTableCmp.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  isMobileMode: PropTypes.bool,
  rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))),
};

HistoryTableCmp.defaultProps = {
  className: '',
  columns: [],
  isMobileMode: false,
  rows: [],
};

const mapStateToProps = (state) => ({
  isMobileMode: (
    state.global.responsiveMode === MOBILE_MODE || state.global.responsiveMode === TABLET_MODE
  ),
});

export default React.memo(connect(mapStateToProps)(HistoryTableCmp));
