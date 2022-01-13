import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { mergeDeepRight, path } from 'ramda';
import './ProductInstrumentYieldTable.scss';
import i18n from '../../../utils/i18n';
import {
  SORT_ASC_NUM, SORT_DESC_NUM,
} from '../../../utils/utils';
import HtmlText from '../../HtmlText';
import { ProductInstrumentTableComponent } from '../../DefaultListFilterable/ProductInstrumentTable';
import YieldPopoverValue from '../YieldPopoverValue';

const getElementWithInnerHTML = (html) => (
  <HtmlText data={{ text: html }} />
);

const getColumnsHeadersLevel1 = (data) => {
  const columns = Object.keys(data.columnsToRender).map((col) => (
    {
      key: col,
      label: data.columnsToRender[col],
      rowspan: 2,
    }
  ));
  return [...columns, {
    key: 'actual_performance_per_maturity',
    label: i18n.t('actual_performance_per_maturity'),
    colspan: Object.keys(data.maturityRanges).length,
    style: { textAlign: 'center' },
    unsortable: true,
  },
  ];
};
const getColumnsHeadersLevel2 = (data) => Object.keys(data.maturityRanges).map((col) => (
  {
    key: col,
    label: data.maturityRanges[col],
    style: { whiteSpace: 'nowrap', maxWidth: '130px', minWidth: '130px' },
    unsortable: true,
  }
));

const getColumnsToRender = (data) => mergeDeepRight(data.columnsToRender, data.maturityRanges);
const isSingleValueColumn = (column, product) => {
  const value = path([column])(product);
  if (Array.isArray(value)) {
    if (value.length === 1) {
      return 'single-value';
    }
    if (value.length > 1) {
      return 'multi-value';
    }
  }
  return '';
};

const getYieldCell = (field) => {
  if (field && Array.isArray(field)) {
    return field.map((value) => (
      <YieldPopoverValue key={value.isin} value={value} />
    ));
  }
  return null;
};
export class ProductInstrumentYieldTableComponent extends ProductInstrumentTableComponent {
  getTableColumns() {
    const { data } = this.props;
    const columnsToRender = getColumnsToRender(data);
    if (data && columnsToRender) {
      return (
        <>
          <tr>
            {getColumnsHeadersLevel1(data).map((column) => (
              <th
                key={column.key}
                rowSpan={column.rowspan}
                colSpan={column.colspan}
                style={column.style}
              >
                {this.getTableColumn(column)}
              </th>
            ))}
          </tr>
          <tr>
            {getColumnsHeadersLevel2(data).map((column) => (
              <th
                key={column.key}
                rowSpan={column.rowspan}
                colSpan={column.colspan}
                style={column.style}
              >
                {this.getTableColumn(column)}
              </th>
            ))}
          </tr>
        </>
      );
    }
    return null;
  }

  getTableColumn(column) {
    const { data } = this.props;
    let sortIcon = null;
    if (data.listBaseUrl && data.listBaseUrl.sort) {
      const sortObj = JSON.parse(data.listBaseUrl.sort);
      if (!column.unsortable && sortObj[column.key]) {
        sortIcon = (
          <i
            className={classNames(
              sortObj[column.key] === SORT_DESC_NUM ? 'sort-icon icon-triangle-down' : 'sort-icon icon-triangle-up',
            )}
          />
        );
      }
    }
    return (
      <span
        role="link"
        tabIndex="-1"
        onKeyUp={() => {}}
        className={classNames(!column.unsortable ? `sortable ${sortIcon ? 'sorted' : ''}` : '')}
        onClick={this.triggerColumnSort(column.key, column.unsortable)}
        key={column.key}
        id={column.key}
      >
        <HtmlText tag="span" data={{ text: column.label }} />
        {sortIcon}
      </span>
    );
  }

  getColumnsContent(product) {
    const { data } = this.props;
    const columnsToRender = getColumnsToRender(data);
    if (columnsToRender && Object.keys(columnsToRender).length) {
      return Object.keys(columnsToRender).map((column) => (
        <td className={classNames(isSingleValueColumn(column, product))} key={column}>
          {this.getColumnContent(column, product)}
        </td>
      ));
    }
    return null;
  }

  getColumnContent(column, product) {
    const columnsConfig = this.getColumnsContentConfig(product);
    let content;
    if (column in columnsConfig.default) {
      content = columnsConfig.default[column];
    } else if (product[column]) {
      content = product[column].value;
    } else {
      content = null;
    }

    return content;
  }

  getTableRow(product) {
    return (
      <tr style={{ height: '1px' }} key={product.uniqId}>
        {this.getColumnsContent(product)}
      </tr>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  getColumnsContentConfig(product) {
    return {
      default: {
        groupName: getElementWithInnerHTML(product.groupName),
        referenceNames: getElementWithInnerHTML(product.referenceNames),
        realPriceCurrency: getElementWithInnerHTML(product.realPriceCurrency),
        distanceBuffer: getElementWithInnerHTML(product.distanceBuffer),
        earlierThen3Months: getYieldCell(product.earlierThen3Months),
        earlierThen6Months: getYieldCell(product.earlierThen6Months),
        earlierThen9Months: getYieldCell(product.earlierThen9Months),
        earlierThen1Year: getYieldCell(product.earlierThen1Year),
        laterThen1year: getYieldCell(product.laterThen1year),
      },
    };
  }

  triggerColumnSort(column, disabled = false) {
    if (!disabled) {
      return super.triggerColumnSort(column, SORT_ASC_NUM, SORT_DESC_NUM);
    }
    return null;
  }

  render() {
    const { data } = this.props;
    return (
      <>
        {data && data.rows && (
        <div className="ProductInstrumentYieldTable">
          <table className="table table-default">
            <thead>
              {this.getTableColumns()}
            </thead>
            <tbody>
              {this.getTableRows()}
            </tbody>
          </table>
        </div>
        )}
      </>
    );
  }
}
ProductInstrumentYieldTableComponent.propTypes = {
  groupName: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  onUpdateFunc: PropTypes.func.isRequired,
};
ProductInstrumentYieldTableComponent.defaultProps = {
  groupName: '',
  data: {
    columnsToRender: {},
  },
};
const ProductInstrumentYieldTable = connect()(ProductInstrumentYieldTableComponent);
export default ProductInstrumentYieldTable;
