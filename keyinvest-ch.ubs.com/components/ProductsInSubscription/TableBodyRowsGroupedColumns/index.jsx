import React from 'react';
import PropTypes from 'prop-types';
import { intersection, path } from 'ramda';
import classNames from 'classnames';
import HtmlText from '../../HtmlText';
import ProductNavLink from '../../ProductNavLink';
import i18n from '../../../utils/i18n';
import Flyout from '../../Flyout';
import {
  FILE_CONTENT_TYPES,
  getProductLink, getTrackingPointNameByContentType,
  IDENTIFIER_TYPE_ISIN,
} from '../../../utils/utils';
import Icon from '../../Icon';
import { getIsinForProduct } from '../ProductsInSubscription.helper';
import TableColumn from '../TableColumn';
import { adformTrackEventClick } from '../../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../../adformTracking/AdformTrackingVars';
import { INSTRUMENT_IDENTIFIER_ISIN } from '../../../utils/globals';

const TableBodyRowsGroupedColumns = ({
  bodyRows, groupedColumns, columnsToRender, columnsContentConfig,
  onFlyoutClick, activeFlyoutId, className, analyticsTrackingData, onColumnClick,
}) => {
  const shouldNotRenderGroupColumn = (column) => (
    Array.isArray(column)
    && intersection(column,
      Object.keys(columnsToRender)).length === 0);

  const shouldNotRenderSingleGroupColumn = (column) => (column
    && typeof column === 'string'
    && Object.keys(columnsToRender).indexOf(column) === -1);

  const shouldRenderGroupColumns = (groupColumns) => (groupColumns
    && Array.isArray(groupColumns)
    && groupColumns.length);

  const getColumnContentFromConfig = (row, column) => {
    const columnsConfig = columnsContentConfig(row);
    if (columnsConfig && columnsConfig[column]) {
      return columnsConfig[column].content;
    }
    return null;
  };

  const onColumnClicked = (e, row) => {
    onColumnClick(e, row);
  };

  const getContentForSingleColumn = (row, columns) => columns.map(
    (groupColumn) => {
      const columnContentFromConfig = getColumnContentFromConfig(row, groupColumn);
      if (columnContentFromConfig) {
        return columnContentFromConfig;
      }
      const isin = getIsinForProduct(row);
      return (
        <div>
          <ProductNavLink
            analyticsCtaType={analyticsTrackingData.analyticsCtaType}
            parentComponentName={analyticsTrackingData.parentComponentName}
            analyticsText={analyticsTrackingData.analyticsText(row)}
            isin={getIsinForProduct(row)}
            className="link-unstyled"
            to={getProductLink(IDENTIFIER_TYPE_ISIN, isin)}
          >
            <HtmlText tag="span" data={{ text: row[groupColumn].value }} />
          </ProductNavLink>
        </div>
      );
    },
  );

  const onTermSheetLinkClick = (event, isin) => {
    adformTrackEventClick(
      event,
      getTrackingPointNameByContentType(FILE_CONTENT_TYPES.termSheet),
      new AdformTrackingVars().setIsin(isin),
    );
  };

  const getProductDetailsColumn = (productRow) => {
    const isin = path([INSTRUMENT_IDENTIFIER_ISIN, 'value'], productRow);
    const termsheetLink = path([FILE_CONTENT_TYPES.termSheet, 'value'], productRow);
    const productDetailsLink = getProductLink(IDENTIFIER_TYPE_ISIN, isin);
    return (
      <td className="flyout-td">
        <Flyout
          id={isin}
          onFlyoutClick={onFlyoutClick}
          activeId={activeFlyoutId}
        >
          <div className="content">
            <ProductNavLink
              isin={isin}
              to={productDetailsLink}
              parentComponentName="Product Instrument Table"
            >
              {i18n.t('Show product details')}
            </ProductNavLink>
            <div className="downloadable-documents">
              <ul>
                <li>
                  {termsheetLink && (
                    <>
                      <Icon type="upload" />
                      <a
                        onClick={(event) => onTermSheetLinkClick(event, isin)}
                        href={termsheetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {i18n.t('Termsheet')}
                      </a>
                    </>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </Flyout>
      </td>
    );
  };

  return (
    <>
      {bodyRows.length > 0 && bodyRows.map((bodyRow) => {
        const columnsKeys = Object.keys(groupedColumns);
        const productDetailsColumn = getProductDetailsColumn(bodyRow);
        const columns = columnsKeys.map((col) => {
          if (shouldNotRenderGroupColumn(groupedColumns[col])) {
            return null;
          }

          if (shouldNotRenderSingleGroupColumn(groupedColumns[col])) {
            return null;
          }

          if (shouldRenderGroupColumns(groupedColumns[col])) {
            const groupedColumnContent = getContentForSingleColumn(bodyRow, groupedColumns[col]);
            return (
              <TableColumn
                onClick={onColumnClicked}
                data={bodyRow}
              >
                {groupedColumnContent}
              </TableColumn>
            );
          }

          return null;
        });
        return (
          <tr className={classNames(className)}>
            {columns}
            {productDetailsColumn}
          </tr>
        );
      })}
    </>
  );
};

TableBodyRowsGroupedColumns.propTypes = {
  bodyRows: PropTypes.arrayOf(PropTypes.any),
  groupedColumns: PropTypes.objectOf(PropTypes.any),
  columnsToRender: PropTypes.objectOf(PropTypes.any),
  columnsContentConfig: PropTypes.func,
  onFlyoutClick: PropTypes.func,
  activeFlyoutId: PropTypes.string,
  className: PropTypes.string,
  analyticsTrackingData: PropTypes.objectOf(PropTypes.any),
  onColumnClick: PropTypes.func,
};

TableBodyRowsGroupedColumns.defaultProps = {
  bodyRows: [],
  groupedColumns: {},
  columnsToRender: {},
  columnsContentConfig: () => {},
  onFlyoutClick: () => {},
  activeFlyoutId: '',
  className: '',
  analyticsTrackingData: {
    analyticsCtaType: '',
    parentComponentName: '',
    analyticsText: () => {},
  },
  onColumnClick: () => {},
};

export default React.memo(TableBodyRowsGroupedColumns);
