import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { path } from 'ramda';
import i18n from '../../../utils/i18n';
import getAppConfig from '../../../main/AppConfig';

export class FooterNavigationCmp extends React.PureComponent {
  render() {
    const {
      className, rootPage, currentPageTitle, currentBrowserUrl,
      currentPageUrl, parentPageTitle, parentPageUrl, shortUrl,
    } = this.props;

    const displayParentItem = parentPageTitle
      && parentPageUrl
      && parentPageTitle !== currentPageTitle
      && parentPageUrl !== rootPage.url;

    const displayCurrentItem = currentPageTitle
      && currentBrowserUrl
      && currentPageUrl !== rootPage.url;
    return (
      <div className={classNames('FooterNavigation', className)}>
        <div className="row">
          <div className="col text-truncate">
            <span>{i18n.t('Short URL: ')}</span>
            <a
              className="footer-link short-url-link"
              href={shortUrl}
            >
              {shortUrl}
            </a>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <span>You are here: </span>
            <nav className="d-inline-block" aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                {rootPage && (
                  <li className="breadcrumb-item root-page">
                    <NavLink to={rootPage.url}>
                      {i18n.t(`application_${getAppConfig().application}`)}
                    </NavLink>
                  </li>
                )}
                {displayParentItem && (
                  <li className="breadcrumb-item parent-page" aria-current="page">
                    <NavLink to={parentPageUrl}>
                      {parentPageTitle}
                    </NavLink>
                  </li>
                )}
                {displayCurrentItem && (
                  <li className="breadcrumb-item active current-page" aria-current="page">
                    <a href={currentBrowserUrl}>
                      {currentPageTitle}
                    </a>
                  </li>
                )}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

FooterNavigationCmp.propTypes = {
  className: PropTypes.string,
  rootPage: PropTypes.objectOf(PropTypes.any),
  currentPageTitle: PropTypes.string,
  currentPageUrl: PropTypes.string,
  parentPageTitle: PropTypes.string,
  parentPageUrl: PropTypes.string,
  shortUrl: PropTypes.string,
  currentBrowserUrl: PropTypes.string,
};
FooterNavigationCmp.defaultProps = {
  className: '',
  rootPage: {
    url: '/',
    label: '',
  },
  currentPageTitle: null,
  currentPageUrl: null,
  parentPageTitle: null,
  parentPageUrl: null,
  shortUrl: null,
  currentBrowserUrl: null,
};
const mapStateToProps = (state) => ({
  shortUrl: path(['global', 'navigationItemData', 'shortUrl'])(state),
  currentPageTitle: path(['global', 'navigationItemData', 'pageTitle'])(state),
  currentPageUrl: path(['global', 'navigationItemData', 'url'])(state),
  currentBrowserUrl: path(['location', 'href'])(window),
  parentPageTitle: path(['global', 'navigationItemData', 'topMenuItemTitle'])(state),
  parentPageUrl: path(['global', 'navigationItemData', 'topMenuItemUrl'])(state),
});

const FooterNavigation = connect(mapStateToProps)(FooterNavigationCmp);
export default FooterNavigation;
