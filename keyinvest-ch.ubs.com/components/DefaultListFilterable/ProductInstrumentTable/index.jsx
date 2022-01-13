import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  intersection, pathOr, path,
} from 'ramda';
import classNames from 'classnames';
import { produce } from 'immer';
import i18n from '../../../utils/i18n';
import './ProductInstrumentTable.scss';
import {
  inverseSortDirection, SORT_ASC, SORT_DESC, getProductLink,
} from '../../../utils/utils';
import Logger from '../../../utils/logger';
import HtmlText from '../../HtmlText';
import Flyout from '../../Flyout';
import ProductInstrumentTableCell from './ProductInstrumentTableCell';
import ValueRender from '../../ValueRender';
import Icon from '../../Icon';
import {
  getColumnsToRender,
  getContainerGroups, getProductAnalyticsText,
  shouldNotRenderColumn,
  shouldSkipColumn,
  getIsin, getTermSheetLink, getFactSheetLink,
} from './ProductInstrumentTable.helper';
import ProductNavLink from '../../ProductNavLink';
import {
  NETCENTRIC_CTA_TYPE_HTML_TEXT,
  NETCENTRIC_CTA_TYPE_LINK,
  NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_MORE_PARENT_CMP_NAME,
  NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_PARENT_CMP_NAME,
} from '../../../analytics/Analytics.helper';
import AddToWatchListLink from './AddToWatchListLink';

const getProductDetailsLink = (product) => {
  const isin = getIsin(product);
  if (isin) {
    return getProductLink('isin', isin);
  }
  return '';
};

const isOnClickDisabled = (col) => !!(col && col.isOnClickDisabled);

export class ProductInstrumentTableComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeInstrument: null,
    };
    this.setActiveInstrument = this.setActiveInstrument.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this,react/sort-comp
  getColumnsCustomContentConfig(product) {
    return {
      default: {
        sell: {
          content: product.sell && (
            <a
              target="_blank"
              className="btn btn-green buy-sell-button"
              href={product.sell.value}
              rel="noopener noreferrer"
            >
              {i18n.t('sell')}
            </a>
          ),
        },
        buy: {
          content: product.buy && (
            <a
              target="_blank"
              className="btn btn-red buy-sell-button"
              href={product.buy.value}
              rel="noopener noreferrer"
            >
              {i18n.t('buy')}
            </a>
          ),
        },
        termsheet: {
          content: (
            <div className="termsheet-link">
              {path(['termsheet', 'value'], product) && (
                <a
                  className="link-unstyled"
                  href={pathOr('', ['termsheet', 'value'], product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Icon type="pdf" />
                </a>
              )}
            </div>
          ),
          isOnClickDisabled: true,
        },
        bid: {
          content: this.getProductNavLinkForColumn(product, 'bid'),
          isNotSortable: true,
        },
        ask: {
          content: this.getProductNavLinkForColumn(product, 'ask'),
          isNotSortable: true,
        },
      },
    };
  }

  getTableColumns() {
    const { data } = this.props;
    const containerGroups = getContainerGroups(data);
    const columnsToRender = getColumnsToRender(data);
    if (containerGroups) {
      return (
        <tr>
          {Object.keys(containerGroups).map((column) => {
            if (shouldSkipColumn(containerGroups, columnsToRender, column)) {
              return null;
            }

            if (shouldNotRenderColumn(containerGroups, columnsToRender, column)) {
              return null;
            }

            return (
              <th key={Array.isArray(containerGroups[column])
                && containerGroups[column].length
                ? containerGroups[column][0] : containerGroups[column]}
              >
                {this.getTableColumn(containerGroups[column])}
              </th>
            );
          })}
          <th aria-label={i18n.t('Show product details')} />
        </tr>
      );
    }
    return null;
  }

  getColumnLabel(columnKey) {
    const { data } = this.props;
    let columnLabel = '';
    if (data.columnsToRender && data.columnsToRender[columnKey]) {
      columnLabel = data.columnsToRender[columnKey];
    } else {
      columnLabel = i18n.t(columnKey);
    }
    return (
      <HtmlText tag="span" data={{ text: columnLabel }} />
    );
  }

  getTableColumn(column, desc = SORT_DESC) {
    const { data } = this.props;
    let sortIcon = null;
    if (column && Array.isArray(column)) {
      return column.map((col) => this.getTableColumn(col));
    }

    if (this.isNotSortableColumn(column)) {
      return (
        <span
          role="link"
          tabIndex="-1"
          key={column}
          id={column}
        >
          {this.getColumnLabel(column)}
        </span>
      );
    }

    if (data.listBaseUrl && data.listBaseUrl.sort) {
      const sortObj = JSON.parse(data.listBaseUrl.sort);
      if (sortObj[column]) {
        sortIcon = (
          <i
            className={classNames(
              'sort-icon',
              sortObj[column] === desc ? 'icon-triangle-down' : 'icon-triangle-up',
            )}
          />
        );
      }
    }
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <span
        role="link"
        tabIndex="-1"
        className={`sortable ${sortIcon ? 'sorted' : ''}`}
        onClick={this.triggerColumnSort(column)}
        key={column}
        id={column}
      >
        {this.getColumnLabel(column)}
        {sortIcon}
      </span>
    );
  }

  getTableRows() {
    const { data } = this.props;
    return data.rows
    && data.rows.length > 0
    && data.rows.map((product) => this.getTableRow(product));
  }

  setActiveInstrument(id) {
    const { activeInstrument } = this.state;
    if (activeInstrument === id) {
      this.setState(produce((draft) => {
        draft.activeInstrument = null;
      }));
    } else {
      this.setState(produce((draft) => {
        draft.activeInstrument = id;
      }));
    }
  }

  getProductLinkFlyout(product) {
    const { activeInstrument } = this.state;
    const isin = getIsin(product);
    const termsheetLink = getTermSheetLink(product);
    const factsheetLink = getFactSheetLink(product);
    return (
      <Flyout
        onFlyoutClick={this.setActiveInstrument}
        id={isin}
        activeId={activeInstrument}
      >
        <div className="content">
          <ProductNavLink
            analyticsText={i18n.t('Show product details')}
            analyticsCtaType={NETCENTRIC_CTA_TYPE_LINK}
            isin={isin}
            to={getProductDetailsLink(product)}
            parentComponentName={NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_MORE_PARENT_CMP_NAME}
          >
            {i18n.t('Show product details')}
          </ProductNavLink>
          {termsheetLink && (
          <div className="termsheet">
            <a
              href={termsheetLink}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              {i18n.t('termsheet')}
            </a>
          </div>
          )}
          {factsheetLink && (
            <div className="factsheet">
              <a
                href={factsheetLink}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                {i18n.t('factsheet')}
              </a>
            </div>
          )}
          <div className="add-watchlist">
            <AddToWatchListLink isin={isin} />
          </div>
        </div>
      </Flyout>
    );
  }

  getTableRow(product) {
    return (
      <tr key={getIsin(product) || product.uniqId}>
        {this.getColumnsContent(product)}
        <td className="flyout-td">
          {this.getProductLinkFlyout(product)}
        </td>
      </tr>
    );
  }

  getColumnAlign(col) {
    const { data, columnsAlign } = this.props;
    if (data && data.containerGroupAlignments) {
      return pathOr('', ['containerGroupAlignments', col])(data);
    }

    if (columnsAlign) {
      return pathOr('', ['columnsAlign', col])(this.props);
    }
    return '';
  }

  getColumnsContent(product) {
    const { data, dispatch } = this.props;
    const { containerGroups } = data;
    if (containerGroups && Object.keys(containerGroups).length) {
      const columnsKeys = Object.keys(containerGroups);
      return columnsKeys.map((col) => {
        if (Array.isArray(containerGroups[col])
            && intersection(containerGroups[col],
              Object.keys(data.columnsToRender)).length === 0) {
          return null;
        }

        if (containerGroups[col]
            && typeof containerGroups[col] === 'string'
            && Object.keys(data.columnsToRender).indexOf(containerGroups[col]) === -1) {
          return null;
        }

        const columnsConfig = this.getColumnsCustomContentConfig(product);

        if (containerGroups[col]
            && Array.isArray(containerGroups[col])
            && containerGroups[col].length) {
          return (
            <ProductInstrumentTableCell
              key={containerGroups[col][0]}
              productLink={isOnClickDisabled(columnsConfig.default[col])
                ? undefined : getProductDetailsLink(product)}
              dispatch={dispatch}
              isin={getIsin(product)}
              analyticsText={getProductAnalyticsText(product)}
            >
              {containerGroups[col].map((c) => (
                <div key={c} className={this.getColumnAlign(col)}>
                  { this.getColumnContent(c, product)}
                </div>
              ))}
            </ProductInstrumentTableCell>
          );
        }
        return (
          <ProductInstrumentTableCell
            productLink={isOnClickDisabled(columnsConfig.default[col])
              ? undefined : getProductDetailsLink(product)}
            dispatch={dispatch}
            key={col}
            isin={getIsin(product)}
            analyticsText={getProductAnalyticsText(product)}
          >
            <div className={this.getColumnAlign(col)}>
              {this.getColumnContent(containerGroups[col], product)}
            </div>
          </ProductInstrumentTableCell>
        );
      });
    }
    return null;
  }

  getColumnContent(column, product) {
    const columnsConfig = this.getColumnsCustomContentConfig(product);
    if (Object.prototype.hasOwnProperty.call(columnsConfig.default, column)) {
      return columnsConfig.default[column].content;
    }
    if (product[column]) {
      return this.getProductNavLinkForColumn(product, column);
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  getProductNavLinkForColumn(product, column) {
    return (
      <ProductNavLink
        analyticsText={getProductAnalyticsText(product)}
        analyticsCtaType={NETCENTRIC_CTA_TYPE_HTML_TEXT}
        isin={getIsin(product)}
        className="link-unstyled"
        to={getProductDetailsLink(product)}
        parentComponentName={NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_PARENT_CMP_NAME}
      >
        <ValueRender field={product[column]} />
      </ProductNavLink>
    );
  }

  isNotSortableColumn(column) {
    const columnCustomConfig = this.getColumnsCustomContentConfig(column);
    return columnCustomConfig.default
      && columnCustomConfig.default[column]
      && columnCustomConfig.default[column].isNotSortable;
  }

  triggerColumnSort(column, asc = SORT_ASC, desc = SORT_DESC) {
    return () => {
      let direction = asc;
      const { onUpdateFunc, data } = this.props;
      if (onUpdateFunc) {
        try {
          if (data && data.listBaseUrl && data.listBaseUrl.sort) {
            const sortObj = JSON.parse(data.listBaseUrl.sort);
            if (sortObj[column]) {
              direction = inverseSortDirection(sortObj[column], asc, desc);
            }
          }
        } catch (e) {
          Logger.warn('PRODUCT_INSTRUMENT_TABLE', e);
        }
        onUpdateFunc('page', 1);
        onUpdateFunc('sort', `{"${column}":${typeof direction === 'string' ? `"${direction}"` : direction}}`);
      }
    };
  }

  render() {
    const { groupName, data, className } = this.props;
    return (
      <>
        {data && data.rows && (
        <div className={classNames(
          'ProductInstrumentTable',
          'table-container-rows-hover-effect',
          'scroll-horizontal',
          className,
        )}
        >
          {groupName && groupName !== '--' && (
          <h3>{groupName}</h3>
          )}
          <table className="table table-default rows-hover-effect">
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
ProductInstrumentTableComponent.propTypes = {
  className: PropTypes.string,
  groupName: PropTypes.string,
  dispatch: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.any),
  columnsAlign: PropTypes.objectOf(PropTypes.any),
  onUpdateFunc: PropTypes.func.isRequired,
};
ProductInstrumentTableComponent.defaultProps = {
  className: '',
  groupName: '',
  columnsAlign: {},
  data: {
    containerGroups: {},
  },
  dispatch: () => {},
};

const ProductInstrumentTable = connect()(ProductInstrumentTableComponent);
export default ProductInstrumentTable;
