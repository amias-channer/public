import React from 'react';
import { Alert } from 'reactstrap';
import { connect } from 'react-redux';
import produce from 'immer';
import { path, pathOr } from 'ramda';
import AbstractPage from '../AbstractPage';
import HttpService from '../../utils/httpService';
import i18n from '../../utils/i18n';
import { authSetUserLoggedIn } from '../../components/Authentication/actions';

export class UserRegisterVerifyPageCmp extends AbstractPage {
  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
    this.setSuccessResponse = this.setSuccessResponse.bind(this);
    this.setErrorResponse = this.setErrorResponse.bind(this);
    this.state = {
      message: null,
      isSuccess: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetch();
  }

  setSuccessResponse(response) {
    const { dispatch } = this.props;
    this.setState(produce((draft) => {
      draft.isLoading = false;
      draft.isSuccess = true;
      draft.message = pathOr(i18n.t('Success'), ['message'], response);
    }), () => {
      if (path(['isUserAuthenticated'], response)) {
        dispatch(authSetUserLoggedIn({
          userProfile: pathOr({}, ['data'], response),
        }));
      }
    });
  }

  setErrorResponse(response) {
    this.setState(produce((draft) => {
      draft.isLoading = false;
      draft.isSuccess = false;
      draft.message = pathOr(i18n.t('error_message_technical_problem'), ['message'], response);
    }));
  }

  fetch() {
    const { location } = this.props;
    const { pathname, search } = location;
    HttpService.fetch(
      HttpService.getPageApiUrl() + pathname + search,
    )
      .then(this.setSuccessResponse)
      .catch(this.setErrorResponse);
  }

  render() {
    const { message, isLoading, isSuccess } = this.state;
    return (
      <div className="UserRegisterVerifyPage">
        {this.getHelmetData()}
        {isLoading && (
          <div className="is-loading" />
        )}
        {!isLoading && (
          <Alert color={isSuccess ? 'success' : 'danger'}>{message}</Alert>
        )}
      </div>
    );
  }
}

UserRegisterVerifyPageCmp.propTypes = {
};

UserRegisterVerifyPageCmp.defaultProps = {
};

function mapStateToProps(state) {
  return {
    responsiveMode: state.global.responsiveMode,
  };
}
const UserRegisterVerifyPage = connect(mapStateToProps)(UserRegisterVerifyPageCmp);
export default UserRegisterVerifyPage;
