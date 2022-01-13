/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AbstractPage from '../AbstractPage';
import {
  STATE_NAME_USER_DASHBOARD_MY_MARKETS,
  STATE_NAME_USER_DASHBOARD_MY_SEARCHES,
  STATE_NAME_USER_DASHBOARD_WATCHLIST,
} from '../../main/constants';
import i18n from '../../utils/i18n';
import './UserDashboardPage.scss';
import MyMarketsOverview
  from '../../components/UserDashboard/MyMarketsOverview';
import { MOBILE_MODE } from '../../utils/responsive';
import MyWatchListComp from '../../components/UserDashboard/MyWatchList';
import MySearches from '../../components/UserDashboard/MySearches';
import MyNews from '../../components/UserDashboard/MyNews';
import withAuth from '../../components/Authentication/withAuth';
import MessageBoxNonLoggedInUser
  from '../../components/MessageBoxNonLoggedInUser';
import history from '../../utils/history';
import { authTogglePopup } from '../../components/Authentication/actions';
import MyTrendRadar from '../../components/UserDashboard/MyTrendRadar';

export class UserDashboardPageComp extends AbstractPage {
  constructor(props) {
    super(props);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onLoginCancelClick = this.onLoginCancelClick.bind(this);
  }

  onLoginClick() {
    const { dispatch } = this.props;
    dispatch(authTogglePopup(true));
  }

  // eslint-disable-next-line class-methods-use-this
  onLoginCancelClick() {
    history.goBack();
  }

  render() {
    const { isMobileMode, isUserAuthenticated } = this.props;
    return isUserAuthenticated ? (
      <div className="UserDashboardPage">
        {this.getHelmetData()}
        <div className="section my-searches">
          <MySearches
            {...this.props}
            stateName={STATE_NAME_USER_DASHBOARD_MY_SEARCHES}
          />
        </div>
        <div className="section my-trendradar">
          <MyTrendRadar />
        </div>

        <div className="section my-watch-list">
          <MyWatchListComp
            {...this.props}
            stateName={STATE_NAME_USER_DASHBOARD_WATCHLIST}
            isMobileMode={isMobileMode}
          />
        </div>

        <div className="section my-market-overview">
          <MyMarketsOverview
            {...this.props}
            stateName={STATE_NAME_USER_DASHBOARD_MY_MARKETS}
          />
        </div>

        <div className="section my-news">
          <MyNews />
        </div>
      </div>
    ) : (
      <MessageBoxNonLoggedInUser
        title={i18n.t('please_login')}
        message={i18n.t('my_dashboard_login_required')}
        onCloseMessageButtonClick={this.onLoginCancelClick}
        onLoginRegisterButtonClick={this.onLoginClick}
      />
    );
  }
}
UserDashboardPageComp.propTypes = {
  isMobileMode: PropTypes.bool,
  isUserAuthenticated: PropTypes.bool,
  dispatch: PropTypes.func,
};

UserDashboardPageComp.defaultProps = {
  isMobileMode: false,
  isUserAuthenticated: false,
  dispatch: () => {},
};

const mapStateToProps = (state) => ({
  isMobileMode: state.global.responsiveMode === MOBILE_MODE,
  responsiveMode: state.global.responsiveMode,
});
export default withAuth(connect(mapStateToProps)(UserDashboardPageComp));
