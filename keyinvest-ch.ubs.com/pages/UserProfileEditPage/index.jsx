import { connect } from 'react-redux';
import classNames from 'classnames';
import React from 'react';
import { pathOr } from 'ramda';
import AbstractPage from '../AbstractPage';
import './UserProfileEditPage.scss';
import ProfileEditFormComp from './ProfileEditForm';
import withAuth from '../../components/Authentication/withAuth';
import {
  userProfileEditPageFetchData,
  userProfileEditPageFormFieldChange,
  userProfileEditPageSubmitForm,
} from './actions';
import { getUserProfileData } from './ProfileEditPage.helper';
import { STATE_NAME_USER_PROFILE_EDIT_PAGE } from '../../main/constants';
import HttpService from '../../utils/httpService';
import i18n from '../../utils/i18n';
import MessageBoxNonLoggedInUser
  from '../../components/MessageBoxNonLoggedInUser';
import { authTogglePopup } from '../../components/Authentication/actions';
import { DESKTOP_MODE, MOBILE_MODE } from '../../utils/responsive';

export class UserProfileEditPage extends AbstractPage {
  constructor(props) {
    super(props);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSubmitEditForm = this.onSubmitEditForm.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onResetEditForm = this.onResetEditForm.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isUserAuthenticated } = this.props;
    if (prevProps.isUserAuthenticated !== isUserAuthenticated && isUserAuthenticated) {
      const { dispatch } = this.props;
      dispatch(
        userProfileEditPageFetchData(
          HttpService.getBackendUrlByStateName(STATE_NAME_USER_PROFILE_EDIT_PAGE, false),
        ),
      );
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      userProfileEditPageFetchData(
        HttpService.getBackendUrlByStateName(STATE_NAME_USER_PROFILE_EDIT_PAGE, false),
      ),
    );
  }

  onFieldChange(fieldKey, newValue) {
    const { dispatch } = this.props;
    dispatch(userProfileEditPageFormFieldChange(fieldKey, newValue));
  }

  onSubmitEditForm() {
    const { dispatch } = this.props;
    dispatch(userProfileEditPageSubmitForm(`${HttpService.getBackendUrlByStateName(STATE_NAME_USER_PROFILE_EDIT_PAGE, false)}/update`));
  }

  onLoginClick() {
    const { dispatch } = this.props;
    dispatch(authTogglePopup(true));
  }

  onResetEditForm() {
    const { dispatch } = this.props;
    dispatch(userProfileEditPageFetchData(
      HttpService.getBackendUrlByStateName(
        STATE_NAME_USER_PROFILE_EDIT_PAGE, false,
      ),
    ));
  }

  render() {
    const {
      isLoading, data, isUserAuthenticated, error, isFormLoading, updateSuccessful, isMobileMode,
    } = this.props;
    const userProfileData = getUserProfileData(data);
    return isUserAuthenticated ? (
      <div className={classNames('UserProfileEditPage', isLoading ? 'is-loading' : '')}>
        {!isLoading && (
          <>
            <ProfileEditFormComp
              data={userProfileData}
              onFieldChange={this.onFieldChange}
              onSubmitEditForm={this.onSubmitEditForm}
              error={error}
              isLoading={isFormLoading}
              updateSuccessful={updateSuccessful}
              onResetEditForm={this.onResetEditForm}
              isMobileMode={isMobileMode}
            />
          </>
        )}
      </div>
    ) : (
      <MessageBoxNonLoggedInUser
        title={i18n.t('please_login')}
        message={i18n.t('my_dashboard_login_required')}
        onLoginRegisterButtonClick={this.onLoginClick}
      />
    );
  }
}
const EMPTY_OBJ = {};
const mapStateToProps = (state) => ({
  data: pathOr(EMPTY_OBJ, ['userProfileEditPage', 'data'], state),
  isLoading: pathOr(false, ['userProfileEditPage', 'isLoading'], state),
  error: pathOr(null, ['userProfileEditPage', 'error'], state),
  isFormLoading: pathOr(false, ['userProfileEditPage', 'isFormLoading'], state),
  updateSuccessful: pathOr(null, ['userProfileEditPage', 'updateSuccessful'], state),
  isMobileMode: pathOr(DESKTOP_MODE, ['global', 'responsiveMode'], state) === MOBILE_MODE,
});
export default withAuth(connect(mapStateToProps)(UserProfileEditPage));
