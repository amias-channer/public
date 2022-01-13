import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { pathOr } from 'ramda';
import i18n from '../../../utils/i18n';
import ButtonsGroup from '../../ButtonsGroup';
import Button from '../../Button';
import './LogoutForm.scss';
import {
  authSetUserLoggedOut,
  authTogglePopup,
} from '../actions';
import withAuth from '../withAuth';
import AbstractForm from '../../Forms/AbstractForm';
import { FORM_METHOD_GET } from '../../Forms/Forms.helper';
import HttpService from '../../../utils/httpService';
import ArrowedLink from '../../ArrowedLink';
import { getPathByStateName } from '../../../utils/utils';
import { STATE_NAME_USER_PROFILE_EDIT_PAGE } from '../../../main/constants';

export class LogoutFormCmp extends AbstractForm {
  constructor(props) {
    super(props);
    this.closeForm = this.closeForm.bind(this);
    this.onSubmitLogout = this.onSubmitLogout.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getFormMethod() {
    return FORM_METHOD_GET;
  }

  // eslint-disable-next-line class-methods-use-this
  getFormEndpoint() {
    return `${HttpService.getPageApiUrl()}/user/logout`;
  }

  // eslint-disable-next-line class-methods-use-this
  isTokenRequired() {
    return false;
  }

  onSubmitLogout(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const { dispatch } = this.props;
    this.submitForm().then(() => {
      dispatch(authSetUserLoggedOut());
      dispatch(authTogglePopup(false));
    }).catch(() => {
      dispatch(authSetUserLoggedOut());
      dispatch(authTogglePopup(false));
    });
  }

  closeForm() {
    const { dispatch } = this.props;
    dispatch(authTogglePopup(false));
  }

  render() {
    const { className, isUserAuthenticated, userProfile } = this.props;
    const editProfileUrl = pathOr('', ['url'], getPathByStateName(STATE_NAME_USER_PROFILE_EDIT_PAGE));
    return isUserAuthenticated && userProfile ? (
      <div className={classNames('LogoutForm', className)}>
        <Form
          onSubmit={this.onSubmitLogout}
        >

          {<>{this.getFormStatusContent()}</>}

          {!this.isFormLoading() && (
            <>
              <div className="row pt-1 pb-4">
                <div className="col">
                  <h3>
                    {i18n.t('my_account')}
                  </h3>
                  <ArrowedLink
                    url={editProfileUrl || '/'}
                    label={i18n.t('go_to_account')}
                    onClick={this.closeForm}
                    isNavLink
                  />
                </div>
              </div>
              <div>
                <ButtonsGroup>
                  <Button type="submit" color="olive">{i18n.t('logout')}</Button>
                  <Button type="reset" color="standard" onClick={this.closeForm}>{i18n.t('cancel')}</Button>
                </ButtonsGroup>
              </div>
            </>
          )}
        </Form>
      </div>
    ) : null;
  }
}

LogoutFormCmp.propTypes = {
  className: PropTypes.string,
  dispatch: PropTypes.func,
  isUserAuthenticated: PropTypes.bool,
  userProfile: PropTypes.objectOf(PropTypes.any),
};

LogoutFormCmp.defaultProps = {
  className: '',
  dispatch: () => {},
  isUserAuthenticated: false,
  userProfile: null,
};
const LogoutForm = withAuth(connect()(LogoutFormCmp));
export default LogoutForm;
