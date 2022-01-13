import React from 'react';
import { connect } from 'react-redux';
import AbstractPage from '../AbstractPage';
import ResetPasswordForm
  from '../../components/Authentication/ResetPasswordForm';

export class UserResetPasswordPageCmp extends AbstractPage {
  render() {
    const { location } = this.props;
    return (
      <div className="UserResetPasswordPage">
        <div className="row justify-content-center">
          <div className="col col-lg-5">
            <ResetPasswordForm location={location} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    responsiveMode: state.global.responsiveMode,
  };
}
const UserResetPasswordPage = connect(mapStateToProps)(UserResetPasswordPageCmp);
export default UserResetPasswordPage;
