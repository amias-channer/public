import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  getThemeDetailsColumnsKeys,
  getThemeDetailsColumnsLabels,
} from '../../ThemesListFiltrable.helper';
import PushableDefault from '../../../PushManager/PushableDefault';
import HtmlText from '../../../HtmlText';
import './ThemeDetailsTable.scss';
import ProductNavLink from '../../../ProductNavLink';
import {
  NETCENTRIC_CTA_TYPE_HTML_TEXT,
  NETCENTRIC_SEARCH_COMPONENT_THEMES,
} from '../../../../analytics/Analytics.helper';
import { getProductLink } from '../../../../utils/utils';
import { getIsin, getProductAnalyticsText } from './ThemeDetailsTable.helper';
import { adformTrackEventClick } from '../../../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../../../adformTracking/AdformTrackingVars';

export const ThemeDetailsTableCmp = ({
  data, className, dispatch, columns,
}) => {
  const columnsKeys = getThemeDetailsColumnsKeys(columns);
  const columnsLabels = getThemeDetailsColumnsLabels(columns);
  const tableHeader = columnsLabels.map((columnLabel) => (
    <th key={columnLabel}>{columnLabel}</th>
  ));

  const trackProductClick = (isin) => {
    adformTrackEventClick(
      null,
      'product-click',
      new AdformTrackingVars().setIsin(isin),
    );
  };

  const goToProductDetailsPage = (isin) => () => {
    trackProductClick(isin);
    dispatch(push(getProductLink('isin', isin)));
  };

  const getProductNavLinkForColumn = (row, col, isin) => (
    <td key={col}>
      <ProductNavLink
        analyticsText={getProductAnalyticsText(row)}
        analyticsCtaType={NETCENTRIC_CTA_TYPE_HTML_TEXT}
        isin={isin}
        className="link-unstyled"
        to={getProductLink('isin', isin)}
        parentComponentName={NETCENTRIC_SEARCH_COMPONENT_THEMES}
        onClick={() => trackProductClick(isin)}
      >
        {typeof row[col] === 'object' && (
        <PushableDefault field={row[col]} />
        )}
        {typeof row[col] !== 'object' && (
        <HtmlText data={{ text: row[col] }} />
        )}
      </ProductNavLink>

    </td>
  );

  const tableRows = data.map((row) => {
    const isin = getIsin(row);
    return (
      <tr key={isin} onClick={goToProductDetailsPage(isin)}>
        {columnsKeys.map((col) => (
          getProductNavLinkForColumn(row, col, isin)
        ))}
      </tr>
    );
  });

  return (
    <div className={classNames('ThemeDetailsTable', 'table-container-rows-hover-effect', className)}>
      <table className={classNames('table-default', 'table', className)}>
        <thead>
          <tr>
            {tableHeader}
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
    </div>
  );
};

ThemeDetailsTableCmp.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
  dispatch: PropTypes.func,
  columns: PropTypes.objectOf(PropTypes.any),
};

ThemeDetailsTableCmp.defaultProps = {
  data: [],
  className: '',
  dispatch: () => {},
  columns: {},
};

export default React.memo(connect()(ThemeDetailsTableCmp));
