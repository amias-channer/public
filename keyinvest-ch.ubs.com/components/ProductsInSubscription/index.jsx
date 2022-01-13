import React, { Fragment } from 'react';
import classNames from 'classnames';
import { produce } from 'immer';
import PropTypes from 'prop-types';
import { omit, path, pathOr } from 'ramda';
import MediaQuery from 'react-responsive';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import i18n from '../../utils/i18n';
import Tabs from '../Tabs';
import {
  getColumnsTranslations,
  getData,
  getDataForProductGroup,
  getGroupTabs,
  getIsinForProduct,
  getProductAnalyticsText,
  getProductListUrlForGroup,
  getProductRowTitle,
  getSelectedGroup, hasDataForGroup,
  PRODUCT_IN_SUBSCRIPTION_COMP_TRACKING_NAME,
} from './ProductsInSubscription.helper';
import './ProductsInSubscription.scss';
import Table from './Table';
import TableHead from './TableHead';
import TableHeadRowsGroupedColumns from './TableHeadRowsGroupedColumns';
import TableBody from './TableBody';
import TableBodyRowsGroupedColumns from './TableBodyRowsGroupedColumns';
import Icon from '../Icon';
import mediaQueries from '../../utils/mediaQueries';
import ExpandableProductTile from './ExpandableProductTile';
import {
  getProductLink,
  IDENTIFIER_TYPE_ISIN,
  searchAndReplaceTextInString,
} from '../../utils/utils';
import ProductNavLink from '../ProductNavLink';
import {
  dispatchAnalyticsProductClickTrack,
  NETCENTRIC_CTA_TYPE_HTML_TEXT,
  NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_PARENT_CMP_NAME,
} from '../../analytics/Analytics.helper';
import Logger from '../../utils/logger';

const getColumnsContentConfig = (row) => ({
  termsheet: {
    content: (
      <div className="termsheet-link">
        {path(['termsheet', 'value'], row) && (
          <a
            className="link-unstyled"
            href={pathOr('', ['termsheet', 'value'], row)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon type="pdf" />
          </a>
        )}
      </div>),
  },
});

export class ProductsInSubscription extends React.PureComponent {
  constructor(props) {
    super(props);
    const { data } = props;
    this.state = {
      selectedGroup: getSelectedGroup(data),
      tableActiveFlyoutId: null,
    };
    this.onTabClick = this.onTabClick.bind(this);
    this.setActiveFlyout = this.setActiveFlyout.bind(this);
    this.onColumnClick = this.onColumnClick.bind(this);
  }

  onTabClick(e) {
    const { data } = this.props;
    const { selectedGroup } = this.state;
    const tabTextGroupName = e.target.textContent;

    if (!tabTextGroupName) {
      return;
    }

    if (selectedGroup === tabTextGroupName) {
      return;
    }

    this.setState(produce((draft) => {
      draft.selectedGroup = tabTextGroupName;
    }));

    const dataRows = getData(data);
    if (!hasDataForGroup(tabTextGroupName, dataRows)) {
      Logger.error(`Data missing for tab '${tabTextGroupName}', make sure backend is providing in response the data for '${tabTextGroupName}' i.e { data: { rows: { '${tabTextGroupName}' : { } }}`);
    }
  }

  onColumnClick(e, row) {
    const { dispatch } = this.props;
    const isin = getIsinForProduct(row);
    const productLink = getProductLink(IDENTIFIER_TYPE_ISIN, isin);
    const analyticsTrackingData = this.getAnalyticsTrackingData();
    try {
      if (productLink) {
        dispatch(push(productLink));
        const clickedText = analyticsTrackingData.analyticsText(row) || path(['currentTarget', 'innerText'])(e) || isin;
        dispatchAnalyticsProductClickTrack(
          clickedText,
          productLink,
          NETCENTRIC_CTA_TYPE_HTML_TEXT,
          NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_PARENT_CMP_NAME,
          isin,
        );
      }
    } catch (ex) {
      Logger.warn('An error occurred', ex);
    }
  }

  setActiveFlyout(id) {
    this.setState(produce((draft) => {
      draft.tableActiveFlyoutId = id;
    }));
  }

  getExpandableProductTiles() {
    const { data } = this.props;
    const { selectedGroup } = this.state;
    const tableData = getDataForProductGroup(data, selectedGroup);
    const fieldsTranslations = getColumnsTranslations(data, selectedGroup);
    const fieldsContentConfig = {
      termsheet: (<Fragment key="termsheet" />),
      factsheet: (<Fragment key="factsheet" />),
    };
    return tableData.rows && tableData.rows.length > 0 && tableData.rows.map(
      (productRow) => {
        const transformedProductRow = omit(['underlying', 'sin', 'isIndexProduct', 'nameInSubscription'], productRow);
        const termSheet = path(['termsheet', 'value'], productRow);
        const productSheet = path(['productsheet', 'value'], productRow);
        const factSheet = path(['factsheet', 'value'], productRow);
        const isin = path(['isin', 'value'], productRow);
        const title = getProductRowTitle(productRow);
        const productDetailsLink = getProductLink(IDENTIFIER_TYPE_ISIN, isin);
        return (
          <ExpandableProductTile
            key={isin}
            title={title}
            fields={transformedProductRow}
            fieldsTranslations={fieldsTranslations}
            fieldsContentConfig={fieldsContentConfig}
          >
            <div className="expanded-content">
              <div className="expanded-content-title">
                <ProductNavLink
                  isin={isin}
                  to={productDetailsLink}
                  parentComponentName={PRODUCT_IN_SUBSCRIPTION_COMP_TRACKING_NAME}
                >
                  {i18n.t('Show product details')}
                </ProductNavLink>
              </div>
              <div className="expanded-content-body">
                <ul>
                  {termSheet && (
                    <li>
                      <Icon type="upload" />
                      <a
                        href={termSheet}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {i18n.t('Termsheet')}
                      </a>
                    </li>
                  )}
                  {productSheet && (
                    <li>
                      <Icon type="upload" />
                      <a
                        href={productSheet}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {i18n.t('Produktblatt')}
                      </a>
                    </li>
                  )}
                  {factSheet && (
                    <li>
                      <Icon type="upload" />
                      <a
                        href={factSheet}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {i18n.t('factsheet')}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </ExpandableProductTile>
        );
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  getProductAnalyticsText(product) {
    return getProductAnalyticsText(product);
  }

  getAnalyticsTrackingData() {
    return {
      analyticsCtaType: NETCENTRIC_CTA_TYPE_HTML_TEXT,
      parentComponentName: PRODUCT_IN_SUBSCRIPTION_COMP_TRACKING_NAME,
      analyticsText: this.getProductAnalyticsText,
    };
  }

  render() {
    const { data, className, dispatch } = this.props;
    const { selectedGroup, tableActiveFlyoutId } = this.state;
    const dataRows = getData(data);
    const tableData = getDataForProductGroup(data, selectedGroup);
    const productListUrl = getProductListUrlForGroup(dataRows, selectedGroup);
    return (
      <div className={classNames('ProductsInSubscription', className)}>
        <h1>{i18n.t('products_in_subscription')}</h1>
        <Tabs
          links={getGroupTabs(data)}
          onTabLinkClick={this.onTabClick}
          activeTabLink={selectedGroup}
        >
          {Object.keys(dataRows).length > 0 && (
            <>
              <MediaQuery query={mediaQueries.mobileTabletOnly}>
                <div className="ExpandableProductTiles">
                  {this.getExpandableProductTiles()}
                </div>
              </MediaQuery>

              <MediaQuery query={mediaQueries.notebook}>
                <div className="table-container-rows-hover-effect">
                  <Table className="products-in-subscription-table">
                    <TableHead>
                      <TableHeadRowsGroupedColumns
                        columnsToRender={tableData.columnsToRender}
                        headerGroupedColumns={tableData.containerGroups}
                      />
                    </TableHead>
                    <TableBody>
                      <TableBodyRowsGroupedColumns
                        dispatch={dispatch}
                        bodyRows={tableData.rows}
                        columnsToRender={tableData.columnsToRender}
                        groupedColumns={tableData.containerGroups}
                        columnsContentConfig={getColumnsContentConfig}
                        onFlyoutClick={this.setActiveFlyout}
                        activeFlyoutId={tableActiveFlyoutId}
                        analyticsTrackingData={this.getAnalyticsTrackingData()}
                        onColumnClick={this.onColumnClick}
                      />
                    </TableBody>
                  </Table>
                </div>
              </MediaQuery>
              <div>
                {productListUrl && (
                <NavLink to={productListUrl}>
                  {searchAndReplaceTextInString('%s', selectedGroup, i18n.t('view_more_group_products'))}
                </NavLink>
                )}
              </div>
            </>
          )}

        </Tabs>
      </div>
    );
  }
}

ProductsInSubscription.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  dispatch: PropTypes.func,
};

ProductsInSubscription.defaultProps = {
  data: {},
  className: '',
  dispatch: () => {},
};

export default connect()(ProductsInSubscription);
