import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { produce } from 'immer';
import { pathOr } from 'ramda';
import PropTypes from 'prop-types';
import UnderlyingChartTableValue from './UnderlyingChartTableValue';
import UnderlyingChartTableDetailsRow from './UnderlyingChartTableDetailsRow';
import HtmlText from '../../HtmlText';
import UnderlyingChartTableCollapse from './UnderlyingChartTableCollapse';
import './UnderlyingChartTable.scss';

export const getRowId = pathOr(null, ['sin', 'value']);

export class UnderlyingChartTableCmp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openRowId: null,
    };
    this.setOpenRowId = this.setOpenRowId.bind(this);
  }

  setOpenRowId(rowId) {
    this.setState(produce((draft) => {
      if (draft.openRowId === rowId) {
        draft.openRowId = null;
      } else {
        draft.openRowId = rowId;
      }
    }));
  }

  isRowOpen(rowId) {
    const { openRowId } = this.state;
    return rowId === openRowId;
  }

  render() {
    const { data, className, uniqId } = this.props;
    const { columns, rows, tableTitle } = data;
    const { openRowId } = this.state;
    return (
      <div className={classNames('UnderlyingChartTable', className)}>
        <h2>{tableTitle || ''}</h2>
        <table className="table-default w-100">
          <thead>
            <tr>
              {columns && Object.keys(columns).length > 0 && Object.keys(columns).map((colKey) => (
                <th key={colKey} className={!columns[colKey].label || columns[colKey].label === '' ? 'no-border' : ''}>
                  <HtmlText data={{ text: columns[colKey].label }} />
                </th>
              ))}
              <th className="toggle-column">
                <span />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 && rows.map((row) => (
              <Fragment key={getRowId(row.head)}>
                <tr className={classNames(this.isRowOpen(getRowId(row.head)) ? 'row-open' : '')}>
                  {columns
                      && Object.keys(columns).length > 0
                      && Object.keys(columns).map((colKey) => (
                        <td key={colKey} className={colKey}>
                          <UnderlyingChartTableValue
                            uniqId={uniqId}
                            rowData={row.head}
                            columnKey={colKey}
                          />
                        </td>
                      ))}
                  <td>
                    <UnderlyingChartTableCollapse
                      rowId={getRowId(row.head)}
                      toggleRowFunc={this.setOpenRowId}
                      isOpen={this.isRowOpen(getRowId(row.head))}
                    />
                  </td>
                </tr>

                {openRowId && this.isRowOpen(getRowId(row.head)) && (
                  <UnderlyingChartTableDetailsRow className="details-row" row={row} columns={columns} />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

UnderlyingChartTableCmp.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  uniqId: PropTypes.string.isRequired,
};
UnderlyingChartTableCmp.defaultProps = {
  data: {},
  className: '',
};

const UnderlyingChartTable = connect()(UnderlyingChartTableCmp);
export default UnderlyingChartTable;
