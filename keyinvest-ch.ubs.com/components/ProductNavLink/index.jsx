import React from 'react';
import classNames from 'classnames';
import { path } from 'ramda';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  dispatchAnalyticsProductClickTrack,
  NETCENTRIC_CTA_TYPE_LINK,
} from '../../analytics/Analytics.helper';
import { globalScrollToTop } from '../../main/actions';

const ProductNavLink = ({
  parentComponentName,
  className,
  to,
  isin,
  analyticsText,
  analyticsCtaType,
  onClick,
  children,
}) => {
  const dispatch = useDispatch();
  const trackProductLinkClick = (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    if (typeof onClick === 'function') {
      onClick(e);
    }
    const clickedText = analyticsText || path(['currentTarget', 'innerText'])(e) || isin;
    dispatchAnalyticsProductClickTrack(
      clickedText,
      to,
      analyticsCtaType,
      parentComponentName,
      isin,
    );
    dispatch(globalScrollToTop());
  };

  return (
    <NavLink
      onClick={trackProductLinkClick}
      className={classNames('ProductNavLink', className)}
      to={to}
    >
      {children}
    </NavLink>
  );
};

ProductNavLink.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node, PropTypes.string,
  ]),
  className: PropTypes.string,
  isin: PropTypes.string.isRequired,
  parentComponentName: PropTypes.string,
  analyticsText: PropTypes.string,
  analyticsCtaType: PropTypes.string,
  to: PropTypes.string.isRequired,
};

ProductNavLink.defaultProps = {
  children: null,
  className: '',
  parentComponentName: '',
  analyticsText: '',
  analyticsCtaType: NETCENTRIC_CTA_TYPE_LINK,
  onClick: () => {},
};

export default React.memo(ProductNavLink);
