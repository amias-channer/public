import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import { path } from 'ramda';
import Logger from '../../../../utils/logger';
import {
  dispatchAnalyticsProductClickTrack,
  NETCENTRIC_CTA_TYPE_HTML_TEXT,
  NETCENTRIC_PRODUCT_INSTRUMENT_TABLE_PARENT_CMP_NAME,
} from '../../../../analytics/Analytics.helper';

const ProductInstrumentTableCell = ({
  className,
  productLink,
  dispatch,
  children,
  isin,
  analyticsText,
}) => {
  const onClick = (e) => {
    try {
      if (productLink) {
        dispatch(push(productLink));
        const clickedText = analyticsText || path(['currentTarget', 'innerText'])(e) || isin;
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
  };

  return (
    <td
      role="presentation"
      className={classNames('ProductInstrumentTableCell', className)}
      onClick={onClick}
    >
      {children}
    </td>
  );
};
ProductInstrumentTableCell.propTypes = {
  className: PropTypes.string,
  analyticsText: PropTypes.string,
  productLink: PropTypes.string,
  isin: PropTypes.string.isRequired,
  dispatch: PropTypes.func,
  children: PropTypes.oneOfType(
    [
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
    ],
  ),
};
ProductInstrumentTableCell.defaultProps = {
  className: '',
  analyticsText: null,
  productLink: '',
  children: {},
  dispatch: () => {},
};

export default React.memo(ProductInstrumentTableCell);
