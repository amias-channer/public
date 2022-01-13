import React from 'react';
import { Container } from 'reactstrap';
import { Switch } from 'react-router-dom';
import classNames from 'classnames';
import './App.scss';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import WebsocketHelper from '../components/PushManager/WebsocketHelper';
import HttpFallbackHelper from '../components/PushManager/HttpFallbackHelper';
import { getResponsiveModeByScreenWidth } from '../utils/responsive';
import { globalUpdateResponsiveMode } from './actions';
import getAppRoutes from './getAppRoutes';
import ProfilerBanner from '../components/ProfilerBanner';
import DisclaimerPopup from '../components/DisclaimerPopup';
import CookiesSettingsPopupComp from '../components/CookiesSettingsPopup';
import { isEmptyData, isModeFlatex } from '../utils/utils';
import getAppConfig from './AppConfig';
import { authSetUserLoggedIn } from '../components/Authentication/actions';
import {
  handleDocumentVisibilityChange,
  visibilityChangePropertyName,
} from '../utils/idleHandler';

const shutdown = () => {
  WebsocketHelper.closeWebsocketConnection();
  HttpFallbackHelper.closeHttpConnection();
};

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.routes = getAppRoutes();
    this.updateDimensions = this.updateDimensions.bind(this);
    this.componentGracefulUnmount = this.componentGracefulUnmount.bind(this);
    this.state = { mounted: true };
    handleDocumentVisibilityChange();
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.componentGracefulUnmount);
    window.addEventListener('resize', this.updateDimensions);
    document.addEventListener(visibilityChangePropertyName, handleDocumentVisibilityChange);
    this.updateDimensions();
    this.checkUserProfile();
  }

  componentWillUnmount() {
    this.componentGracefulUnmount();
  }

  componentGracefulUnmount() {
    this.setState({ mounted: false });
    window.removeEventListener('beforeunload', this.componentGracefulUnmount);
    window.removeEventListener('resize', this.updateDimensions);
    document.removeEventListener(visibilityChangePropertyName, handleDocumentVisibilityChange);
    shutdown();
  }

  updateDimensions() {
    if (this.resizeTimeout) { clearTimeout(this.resizeTimeout); }
    this.resizeTimeout = setTimeout(() => {
      const newResponsiveMode = getResponsiveModeByScreenWidth(window.innerWidth);
      if (this.responsiveMode !== newResponsiveMode) {
        this.responsiveMode = newResponsiveMode;
        const { dispatch } = this.props;
        dispatch(globalUpdateResponsiveMode(this.responsiveMode));
      }
    }, 10);
  }

  checkUserProfile() {
    const { userProfile } = getAppConfig();
    if (userProfile && !isEmptyData(userProfile)) {
      const { dispatch } = this.props;
      dispatch(authSetUserLoggedIn({
        userProfile,
      }));
    }
  }

  render() {
    const isFlatextMode = isModeFlatex();
    const { mounted } = this.state;
    if (mounted) {
      return (
        <div className={classNames('App', isFlatextMode ? 'flatex-mode' : '')}>
          <Helmet>
            <title>UBS KeyInvest</title>
            <meta name="description" content="UBS KeyInvest" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Helmet>
          <ProfilerBanner />
          <DisclaimerPopup />
          <CookiesSettingsPopupComp />
          <MainHeader />
          <Container className="main-container">
            <Switch>
              {this.routes}
            </Switch>
          </Container>
          {!isFlatextMode && (<MainFooter />)}

        </div>
      );
    }
    return null;
  }
}
App.propTypes = {
  dispatch: PropTypes.func,
};
App.defaultProps = {
  dispatch: () => {},
};

export default connect()(App);
