import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Form, FormGroup } from 'reactstrap';
import { produce } from 'immer';
import i18n from '../../../utils/i18n';
import ButtonsGroup from '../../ButtonsGroup';
import Button from '../../Button';
import TextField from '../../Forms/Fields/TextField';
import { createValidatorInstance } from '../../../utils/SimpleReactValidator';
import './ForgotPasswordForm.scss';
import AbstractForm from '../../Forms/AbstractForm';
import HttpService from '../../../utils/httpService';

class ForgotPasswordForm extends AbstractForm {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.closeForgotPasswordForm = this.closeForgotPasswordForm.bind(this);
    this.onSubmitForgotPassword = this.onSubmitForgotPassword.bind(this);
    this.state = {
      email: props.email || '',
    };
    this.validator = createValidatorInstance({
      autoForceUpdate: this,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getFormEndpoint() {
    return `${HttpService.getPageApiUrl()}/user/forgot-password`;
  }

  getFormFieldsToSubmit() {
    const { email } = this.state;
    return {
      email,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitForgotPassword(e) {
    if (this.validator.allValid()) {
      this.submitForm().then(() => { });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
  }

  onFieldChange(fieldKey, value) {
    this.setState(produce((draft) => {
      draft[fieldKey] = value;
    }));
  }

  closeForgotPasswordForm(e) {
    const { setShowForgotPasswordForm } = this.props;
    if (typeof setShowForgotPasswordForm === 'function') {
      setShowForgotPasswordForm(false);
    }
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
  }

  render() {
    const { className } = this.props;
    const { email } = this.state;
    return (
      <div className={classNames('ForgotPasswordForm', className)}>
        <Form
          onSubmit={this.onSubmitForgotPassword}
        >
          <h3 className="ubs-header-3 pb-4">{i18n.t('password_reset_title')}</h3>

          {!this.isFormLoading() && !this.isFormSuccess() && (
            <>
              <div className="row">
                <div className="col">
                  <p>{i18n.t('password_reset_text')}</p>
                </div>
              </div>

              <TextField
                onFieldValueChange={this.onFieldChange}
                fieldKey="email"
                value={email}
                validatorInstance={this.validator}
                type="email"
                validation="required|email"
              />

              <FormGroup>
                <ButtonsGroup>
                  <Button type="submit" color="olive">{i18n.t('password_reset_submit')}</Button>
                  <Button type="reset" color="standard" onClick={this.closeForgotPasswordForm}>{i18n.t('cancel')}</Button>
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

ForgotPasswordForm.propTypes = {
  className: PropTypes.string,
  email: PropTypes.string,
  setShowForgotPasswordForm: PropTypes.func,
};

ForgotPasswordForm.defaultProps = {
  className: '',
  email: '',
  setShowForgotPasswordForm: () => {},
};

export default ForgotPasswordForm;
