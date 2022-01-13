import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, FormGroup } from 'reactstrap';
import { produce } from 'immer';
import { pathOr } from 'ramda';
import i18n from '../../../utils/i18n';
import ButtonsGroup from '../../ButtonsGroup';
import Button from '../../Button';
import TextField from '../../Forms/Fields/TextField';
import { createValidatorInstance } from '../../../utils/SimpleReactValidator';
import './LoginForm.scss';
import {
  authSetUserLoggedIn,
  authTogglePopup,
} from '../actions';
import AbstractForm from '../../Forms/AbstractForm';
import HttpService from '../../../utils/httpService';
import Alert from '../../Alert';
import ArrowedLink from '../../ArrowedLink';
import HtmlText from '../../HtmlText';
import { ALERT_TYPE } from '../../Alert/Alert.helper';
import {
  dispatchAnalyticsClickTrack,
  NETCENTRIC_CTA_TYPE_TEXT_LINK,
  NETCENTRIC_FORM_TRACK_LOGIN,
} from '../../../analytics/Analytics.helper';

export class LoginFormCmp extends AbstractForm {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.showForgotPasswordForm = this.showForgotPasswordForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.onSubmitLogin = this.onSubmitLogin.bind(this);
    this.trackFormStart = this.trackFormStart.bind(this);
    this.onFieldClick = this.onFieldClick.bind(this);
    this.getFormStatusErrorContent = this.getFormStatusErrorContent.bind(this);
    this.state = {
      formStatus: 'form-loading',
      email: '',
      password: '',
      isResetPasswordRequired: false,
    };
    this.validator = createValidatorInstance();
  }

  // eslint-disable-next-line class-methods-use-this
  getFormEndpoint() {
    return `${HttpService.getPageApiUrl()}/user/login`;
  }

  // eslint-disable-next-line class-methods-use-this
  shouldBeAnalyticsTracked() {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  getAnalyticsFormName() {
    return NETCENTRIC_FORM_TRACK_LOGIN;
  }

  getFormFieldsToSubmit() {
    const { password, email } = this.state;
    return {
      email,
      password,
    };
  }

  getFormStatusErrorContent() {
    const { isResetPasswordRequired } = this.state;
    if (isResetPasswordRequired) {
      return (
        <Alert color="danger" type={ALERT_TYPE.ERROR} withoutCloseIcon>
          <HtmlText tag="span" data={{ text: i18n.t('update_password_required_message_part_1') }} />
          <ArrowedLink
            label={i18n.t('update_password_required_message_link_part_2')}
            onClick={this.showForgotPasswordForm}
          />
          <HtmlText tag="span" data={{ text: i18n.t('update_password_required_message_part_3') }} />
        </Alert>
      );
    }
    return super.getFormStatusErrorContent();
  }

  resetState() {
    this.setState(produce((draft) => {
      draft.isResetPasswordRequired = false;
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitLogin(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.resetState();
    if (this.validator.allValid()) {
      const { dispatch } = this.props;
      this.submitForm().then((response) => {
        dispatch(authSetUserLoggedIn({
          userProfile: pathOr({}, ['data', 'userProfile'], response),
        }));
        dispatch(authTogglePopup(false));
        this.trackFormSuccess();
      }, (response) => {
        const isResetPasswordRequired = pathOr(false, ['isResetPasswordRequired'], response);
        if (isResetPasswordRequired) {
          this.setState(produce((draft) => {
            draft.isResetPasswordRequired = isResetPasswordRequired;
          }), () => {
            this.trackFormError(this.getFormErrorMessage());
          });
        } else {
          this.trackFormError(this.getFormErrorMessage());
        }
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();

      this.trackFormError(this.getSerializedValidationMessagesForAnalytics());
    }
  }

  onFieldChange(fieldKey, value) {
    this.setState(produce((draft) => {
      draft[fieldKey] = value;
    }));
  }

  closeForm() {
    const { dispatch } = this.props;
    dispatch(authTogglePopup(false));
  }

  showForgotPasswordForm(e) {
    dispatchAnalyticsClickTrack(
      'Forgot Password',
      '',
      NETCENTRIC_CTA_TYPE_TEXT_LINK,
      'Login',
    );
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    const { setShowForgotPasswordForm } = this.props;
    if (typeof setShowForgotPasswordForm === 'function') {
      const { email } = this.state;
      setShowForgotPasswordForm(true, email);
    }
  }

  onFieldClick() {
    this.trackFormStart();
  }

  render() {
    const { className } = this.props;
    const { email, password } = this.state;
    return (
      <div className={classNames('LoginForm', className)}>
        <Form
          method="POST"
          onSubmit={this.onSubmitLogin}
        >
          <h3 className="ubs-header-3">{i18n.t('login')}</h3>
          <div className="row pt-4">
            <div className="col">
              <p>{i18n.t('login_welcome')}</p>
            </div>
          </div>
          {!this.isFormLoading() && !this.isFormSuccess() && (
            <>
              <TextField
                onFieldValueChange={this.onFieldChange}
                fieldKey="email"
                value={email}
                validatorInstance={this.validator}
                type="email"
                validation="required|email"
                onClick={this.onFieldClick}
              />

              <TextField
                onFieldValueChange={this.onFieldChange}
                fieldKey="password"
                value={password}
                validatorInstance={this.validator}
                type="password"
                validation="required"
                onClick={this.onFieldClick}
              />

              <FormGroup>
                <ButtonsGroup>
                  <Button type="submit" color="olive">{i18n.t('login')}</Button>
                  <Button type="reset" color="standard" onClick={this.closeForm}>{i18n.t('cancel')}</Button>
                </ButtonsGroup>
              </FormGroup>
            </>
          )}

          {<>{this.getFormStatusContent()}</>}

          <FormGroup>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              href="#"
              className="forgot-password-link"
              onClick={this.showForgotPasswordForm}
            >
              {i18n.t('forgot_password')}
            </a>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

LoginFormCmp.propTypes = {
  className: PropTypes.string,
  dispatch: PropTypes.func,
  setShowForgotPasswordForm: PropTypes.func,
  formStarted: PropTypes.bool,
};

LoginFormCmp.defaultProps = {
  className: '',
  dispatch: () => {},
  setShowForgotPasswordForm: () => {},
  formStarted: false,
};

const mapStateToProps = (state) => ({
  formStarted: pathOr(false, ['analytics', NETCENTRIC_FORM_TRACK_LOGIN, 'started'], state),
});

const LoginForm = connect(mapStateToProps)(LoginFormCmp);
export default LoginForm;
