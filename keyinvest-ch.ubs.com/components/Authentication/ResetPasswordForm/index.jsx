import React from 'react';
import classNames from 'classnames';
import { path, pathOr } from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, FormGroup } from 'reactstrap';
import { produce } from 'immer';
import i18n from '../../../utils/i18n';
import ButtonsGroup from '../../ButtonsGroup';
import Button from '../../Button';
import TextField from '../../Forms/Fields/TextField';
import { createValidatorInstance } from '../../../utils/SimpleReactValidator';
import './ResetPasswordForm.scss';
import AbstractForm from '../../Forms/AbstractForm';
import HttpService from '../../../utils/httpService';
import HtmlText from '../../HtmlText';
import { authSetUserLoggedIn } from '../actions';

export class ResetPasswordFormCmp extends AbstractForm {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.emptyForm = this.emptyForm.bind(this);
    this.onSubmitResetPassword = this.onSubmitResetPassword.bind(this);
    this.state = {
      password: '',
      passwordConfirmation: '',
    };
    this.validator = createValidatorInstance({
      messages: {
        in: i18n.t('confirmation_password_not_match'),
      },
    });
  }

  getFormEndpoint() {
    const { location } = this.props;
    const { pathname, search } = location;
    return HttpService.getPageApiUrl() + pathname + search;
  }

  getFormFieldsToSubmit() {
    const { password, passwordConfirmation } = this.state;
    return {
      password,
      password2: passwordConfirmation,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitResetPassword(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    const { dispatch } = this.props;
    if (this.validator.allValid()) {
      this.submitForm().then((response) => {
        if (path(['isUserAuthenticated'], response)) {
          dispatch(authSetUserLoggedIn({
            userProfile: pathOr({}, ['data'], response),
          }));
        }
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  onFieldChange(fieldKey, value) {
    this.setState(produce((draft) => {
      draft[fieldKey] = value;
    }));
  }

  emptyForm(e = {}) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.setState(produce((draft) => {
      draft.password = '';
      draft.passwordConfirmation = '';
    }));
  }

  render() {
    const { className } = this.props;
    const { password, passwordConfirmation } = this.state;
    return (
      <div className={classNames('ResetPasswordForm', className)}>
        <Form
          onSubmit={this.onSubmitResetPassword}
        >
          <h3 className="ubs-header-3 pb-4">{i18n.t('password')}</h3>

          {!this.isFormLoading() && !this.isFormSuccess() && (
            <>
              <div className="row">
                <div className="col">
                  <HtmlText tag="p" data={{ text: i18n.t('password_change_after_reset_text') }} />
                </div>
              </div>

              <TextField
                onFieldValueChange={this.onFieldChange}
                fieldKey="password"
                value={password}
                validatorInstance={this.validator}
                type="password"
                validation="required|min:8"
              />
              <TextField
                onFieldValueChange={this.onFieldChange}
                fieldKey="passwordConfirmation"
                value={passwordConfirmation}
                validatorInstance={this.validator}
                type="password"
                validation={`required|in:${password}`}
              />

              <FormGroup>
                <ButtonsGroup>
                  <Button type="submit" color="olive">{i18n.t('password_submit')}</Button>
                  <Button type="reset" color="standard" onClick={this.emptyForm}>{i18n.t('cancel')}</Button>
                </ButtonsGroup>
              </FormGroup>
            </>
          )}

          {<>{this.getFormStatusContent()}</>}
        </Form>
      </div>
    );
  }
}

ResetPasswordFormCmp.propTypes = {
  className: PropTypes.string,
};

ResetPasswordFormCmp.defaultProps = {
  className: '',
};

const ResetPasswordForm = connect()(ResetPasswordFormCmp);
export default ResetPasswordForm;
