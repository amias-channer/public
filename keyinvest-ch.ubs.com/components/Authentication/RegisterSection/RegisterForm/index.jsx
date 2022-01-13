import React from 'react';
import { isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import produce from 'immer';
import { Form, FormGroup } from 'reactstrap';
import { pathOr } from 'ramda';
import { createValidatorInstance } from '../../../../utils/SimpleReactValidator';
import i18n from '../../../../utils/i18n';
import Button, { BUTTON_COLOR } from '../../../Button';
import ButtonsGroup from '../../../ButtonsGroup';
import TextField from '../../../Forms/Fields/TextField';
import HtmlText from '../../../HtmlText';
import AbstractForm from '../../../Forms/AbstractForm';
import DropdownField from '../../../Forms/Fields/DropdownField';
import HttpService from '../../../../utils/httpService';
import ResendRegisterVerificationEmailForm
  from '../ResendRegisterVerificationEmailForm';
import CheckboxField from '../../../Forms/Fields/CheckboxField';
import RadioField from '../../../Forms/Fields/RadioField';
import BirthDatePickerField from '../../../Forms/Fields/BirthDatePickerField';
import getAppConfig from '../../../../main/AppConfig';
import { COUNTRY_DE } from '../../../../utils/utils';
import {
  NETCENTRIC_FORM_TRACK_REGISTRATION,
} from '../../../../analytics/Analytics.helper';

export class RegisterFormCmp extends AbstractForm {
  constructor(props) {
    super(props);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.setState = this.setState.bind(this);
    this.onSubmitRegister = this.onSubmitRegister.bind(this);
    this.onFieldClick = this.onFieldClick.bind(this);
    this.trackFormStart = this.trackFormStart.bind(this);
    this.validator = createValidatorInstance({
      autoForceUpdate: this,
      messages: {
        in: i18n.t('confirmation_password_not_match'),
      },
    });
    this.state = {
      salutation: '',
      language: RegisterFormCmp.getInitialLanguage(),
      firstName: '',
      lastName: '',
      birthDate: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      registerAccept: false,
    };
  }

  static getInitialLanguage() {
    const { application } = getAppConfig();
    if (application === COUNTRY_DE) {
      return COUNTRY_DE;
    }
    return '';
  }

  // eslint-disable-next-line class-methods-use-this
  shouldBeAnalyticsTracked() {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  getAnalyticsFormName() {
    return NETCENTRIC_FORM_TRACK_REGISTRATION;
  }

  // eslint-disable-next-line class-methods-use-this
  getFormEndpoint() {
    return `${HttpService.getPageApiUrl()}/user/register`;
  }

  // eslint-disable-next-line class-methods-use-this
  getLanguages() {
    return [
      { label: i18n.t('de_CH'), value: 'de' },
      { label: i18n.t('en_CH'), value: 'en' },
      { label: i18n.t('fr_CH'), value: 'fr' },
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  getSalutations() {
    return [
      { label: i18n.t('female'), value: 'female' },
      { label: i18n.t('male'), value: 'male' },
    ];
  }

  getFormFieldsToSubmit() {
    const {
      salutation,
      language,
      firstName,
      lastName,
      birthDate,
      email,
      password,
      passwordConfirmation,
    } = this.state;
    return {
      salutation,
      language,
      firstName,
      lastName,
      birthDate: ((birthDate instanceof moment && birthDate.unix && typeof birthDate.unix === 'function') ? birthDate.unix() : birthDate),
      email,
      password,
      password2: passwordConfirmation,
    };
  }

  onSubmitRegister(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (this.validator.allValid()) {
      this.submitForm().then(() => {
        this.trackFormSuccess();
      }, () => {
        this.trackFormError(this.getFormErrorMessage());
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
      this.trackFormError(this.getSerializedValidationMessagesForAnalytics());
    }
  }

  onResetClick() {
    const { setState } = this;
    setState(produce((draft) => {
      draft.salutation = '';
      draft.language = RegisterFormCmp.getInitialLanguage();
      draft.firstName = '';
      draft.lastName = '';
      draft.birthDate = '';
      draft.email = '';
      draft.password = '';
      draft.passwordConfirmation = '';
      draft.registerAccept = false;
    }));
  }

  onFieldChange(fieldKey, value) {
    const { setState, state } = this;
    if (fieldKey && state[fieldKey] !== undefined) {
      setState(produce((draft) => {
        draft[fieldKey] = value;
      }));
    }
  }

  onFieldClick() {
    this.trackFormStart();
  }

  render() {
    const { className } = this.props;
    const { locale } = getAppConfig();
    const {
      salutation,
      language,
      firstName,
      lastName,
      birthDate,
      email,
      password,
      passwordConfirmation,
      registerAccept,
    } = this.state;
    return (
      <div className={classNames('RegisterForm', className)}>
        <Form
          method={this.getFormMethod()}
          onSubmit={this.onSubmitRegister}
        >
          {!this.isFormLoading() && !this.isFormSuccess() && (
          <>
            {locale !== 'de_DE' && (
              <DropdownField
                fieldKey="language"
                value={language}
                onFieldValueChange={this.onFieldChange}
                validatorInstance={this.validator}
                items={this.getLanguages()}
                validation="required"
                onClick={this.onFieldClick}
              />
            )}

            <h4 className="ubs-header-4 pb-2 pt-2">{i18n.t('personal')}</h4>

            <RadioField
              onFieldValueChange={this.onFieldChange}
              fieldKey="salutation"
              value={salutation}
              validatorInstance={this.validator}
              items={this.getSalutations()}
              onClick={this.onFieldClick}
            />

            <TextField
              onFieldValueChange={this.onFieldChange}
              fieldKey="firstName"
              value={firstName}
              validatorInstance={this.validator}
              validation="required"
              onClick={this.onFieldClick}
            />

            <TextField
              onFieldValueChange={this.onFieldChange}
              fieldKey="lastName"
              value={lastName}
              validatorInstance={this.validator}
              validation="required"
              onClick={this.onFieldClick}
            />

            <BirthDatePickerField
              onFieldValueChange={this.onFieldChange}
              fieldKey="birthDate"
              value={birthDate}
              validatorInstance={this.validator}
              isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
              onFocusChange={this.onFieldClick}
            />

            <h4 className="ubs-header-4 pb-2 pt-2">{i18n.t('account')}</h4>
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
              validation="required|min:8"
              onClick={this.onFieldClick}
            />

            <TextField
              onFieldValueChange={this.onFieldChange}
              fieldKey="passwordConfirmation"
              value={passwordConfirmation}
              validatorInstance={this.validator}
              type="password"
              validation={`required|in:${password}`}
              onClick={this.onFieldClick}
            />

            <div>
              <p>{i18n.t('required_fields')}</p>
              <p>{i18n.t('input_warning_text')}</p>
            </div>

            <div className="links">
              <HtmlText tag="p" data={{ text: i18n.t('register_footer_links') }} />
            </div>

            <div>
              <CheckboxField
                name="registerAccept"
                label={i18n.t('register_confirmation')}
                onFieldValueChange={this.onFieldChange}
                fieldKey="registerAccept"
                value={registerAccept}
                validatorInstance={this.validator}
                validation="accepted"
                onClick={this.onFieldClick}
              />
              <p>{i18n.t('register_confirmation_text')}</p>
            </div>
          </>
          )}

          {<>{this.getFormStatusContent()}</>}

          {!this.isFormLoading() && !this.isFormSuccess() && (
            <FormGroup>
              <ButtonsGroup>
                <Button
                  type="submit"
                  color={BUTTON_COLOR.OLIVE}
                >
                  {i18n.t('register')}
                </Button>
                <Button
                  type="reset"
                  color={BUTTON_COLOR.STANDARD}
                  onClick={this.onResetClick}
                >
                  {i18n.t('reset')}
                </Button>
              </ButtonsGroup>
            </FormGroup>
          )}
        </Form>

        {!this.isFormLoading() && this.isFormSuccess() && (
          <ResendRegisterVerificationEmailForm email={email} />
        )}
      </div>
    );
  }
}

RegisterFormCmp.propTypes = {
  className: PropTypes.string,
};

RegisterFormCmp.defaultProps = {
  className: '',
};

const mapStateToProps = (state) => ({
  formStarted: pathOr(false, ['analytics', NETCENTRIC_FORM_TRACK_REGISTRATION, 'started'], state),
});

const RegisterForm = connect(mapStateToProps)(RegisterFormCmp);
export default RegisterForm;
