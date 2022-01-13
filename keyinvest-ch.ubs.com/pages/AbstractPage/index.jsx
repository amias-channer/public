import React from 'react';
import PropTypes from 'prop-types';
import { path, pathOr } from 'ramda';
import { Helmet } from 'react-helmet';
import Logger from '../../utils/logger';
import { store } from '../../main/configureStore';
import {
  globalClearProfilerBanner,
  globalUpdateCurrentNavigationItemData,
  globalUpdateStateName,
} from '../../main/actions';
import { dispatchAnalyticsPageLoadTrack } from '../../analytics/Analytics.helper';
import {
  adformTrackEventPageView,
  createTrackingPointPath,
} from '../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../adformTracking/AdformTrackingVars';

class AbstractPage extends React.PureComponent {
  constructor(props) {
    super(props);
    let dispatch;

    // Preparing the dispatch function
    if (props.dispatch && typeof props.dispatch === 'function') {
      dispatch = props.dispatch;
    } else {
      dispatch = store.dispatch;
      Logger.error('ABSTRACT_PAGE', 'Unable to find dispatch func in props. MAKE SURE your page component is connected to redux store', props);
    }

    // Updating global active stateName
    if (props.stateName) {
      const { stateName } = props;
      Logger.debug('ABSTRACT_PAGE', 'Updating stateName in the store', stateName);
      dispatch(globalUpdateStateName(stateName));
    } else {
      Logger.error('ABSTRACT_PAGE', 'Unable to find stateName, please make sure to set State Name in CMS page', props);
    }

    // Updating global active navigationItemData
    if (props.navigationItemData) {
      const { navigationItemData } = props;
      Logger.debug('ABSTRACT_PAGE', 'Updating navigationItemData in the store', navigationItemData);
      dispatch(globalUpdateCurrentNavigationItemData({
        shortUrl: path(['location', 'href'], window),
        ...navigationItemData,
      }));
    } else {
      dispatch(globalUpdateCurrentNavigationItemData({}));
      Logger.warn('ABSTRACT_PAGE', 'Unable to find navigationItemData', props);
    }

    this.trackPageChange();
  }

  componentDidUpdate(prevProps) {
    const { location, dispatch, navigationItemData } = this.props;
    const { location: locationPrev } = prevProps;
    if (location.pathname !== locationPrev.pathname || location.search !== locationPrev.search) {
      this.trackPageChange();
      dispatch(globalUpdateCurrentNavigationItemData({
        shortUrl: path(['location', 'href'], window),
        ...navigationItemData,
      }, true));
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(globalClearProfilerBanner());
  }

  getPageTitle() {
    const { navigationItemData } = this.props;
    if (navigationItemData) {
      return navigationItemData.browserTitle || navigationItemData.pageTitle;
    }
    return '';
  }

  getMetaDescription() {
    const { navigationItemData } = this.props;
    if (navigationItemData && navigationItemData.metaDescription) {
      return navigationItemData.metaDescription;
    }
    return '';
  }

  getMetaKeywords() {
    const { navigationItemData } = this.props;
    if (navigationItemData && navigationItemData.metaKeywords) {
      return navigationItemData.metaKeywords;
    }
    return '';
  }

  getHelmetData() {
    return (
      <Helmet>
        <title>{this.getPageTitle()}</title>
        <meta name="description" content={this.getMetaDescription()} />
        <meta name="keywords" content={this.getMetaKeywords()} />
      </Helmet>
    );
  }

  trackAdformEventPageView() {
    const { navigationItemData } = this.props;
    if (!navigationItemData) {
      return;
    }
    adformTrackEventPageView(
      new AdformTrackingVars(),
      createTrackingPointPath(
        navigationItemData.pageTitleEn,
        navigationItemData.topMenuItemTitleEn,
      ),
    );
  }

  trackPageChange() {
    const { location } = this.props;
    const pathname = pathOr('', ['pathname'])(location);
    const search = pathOr('', ['search'])(location);
    dispatchAnalyticsPageLoadTrack(
      pathname + search,
      pathname,
      '',
    );
    if (location && location.pathname && location.pathname === '/languageChange') {
      return;
    }
    this.trackAdformEventPageView();
  }

  render() {
    return null;
  }
}

const EMPTY_OBJ = {};
AbstractPage.propTypes = {
  stateName: PropTypes.string.isRequired,
  navigationItemData: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  location: PropTypes.objectOf(PropTypes.any),
};

AbstractPage.defaultProps = {
  dispatch: null,
  navigationItemData: EMPTY_OBJ,
  location: {},
};

export default AbstractPage;
