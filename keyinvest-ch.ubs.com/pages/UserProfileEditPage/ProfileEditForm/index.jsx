import React from 'react';
import { Form, Row } from 'reactstrap';
import { isInclusivelyBeforeDay } from 'react-dates';
import moment from 'moment';
import AbstractForm from '../../../components/Forms/AbstractForm';
import i18n from '../../../utils/i18n';
import RadioField from '../../../components/Forms/Fields/RadioField';
import TextField from '../../../components/Forms/Fields/TextField';
import DropdownField from '../../../components/Forms/Fields/DropdownField';
import BirthDatePickerField
  from '../../../components/Forms/Fields/BirthDatePickerField';
import ButtonsGroup from '../../../components/ButtonsGroup';
import Button, { BUTTON_COLOR } from '../../../components/Button';
import Alert from '../../../components/Alert';
import { ALERT_TYPE } from '../../../components/Alert/Alert.helper';
import {
  getConfirmedNewPassword,
  getNewPassword,
  getOldPassword, getUserBirthDate,
  getUserEmail,
  getUserFirstName,
  getUserLanguage,
  getUserLastName,
  getUserSalutation,
} from '../ProfileEditPage.helper';
import { createValidatorInstance } from '../../../utils/SimpleReactValidator';

export class ProfileEditForm extends AbstractForm {
  constructor(props) {
    super(props);
    this.validator = createValidatorInstance({
      autoForceUpdate: this,
      messages: {
        in: i18n.t('confirmation_password_not_match'),
        not_in: i18n.t('new_password_must_not_match_old_password'),
      },
    });
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onSubmitEditForm = this.onSubmitEditForm.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.languages = [
      { label: i18n.t('de_CH'), value: 'de' },
      { label: i18n.t('en_DE'), value: 'en' },
      { label: i18n.t('fr_CH'), value: 'fr' },
    ];
    this.salutations = [
      { label: i18n.t('female'), value: 'female' },
      { label: i18n.t('male'), value: 'male' },
    ];
  }

  onSubmitEditForm(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (this.validator.allValid()) {
      const { onSubmitEditForm } = this.props;
      onSubmitEditForm();
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  onFieldChange(fieldKey, newValue) {
    const { onFieldChange } = this.props;
    onFieldChange(fieldKey, newValue);
  }

  onResetClick() {
    const { onResetEditForm } = this.props;
    onResetEditForm();
  }

  render() {
    const {
      data, error, isLoading, updateSuccessful, isMobileMode,
    } = this.props;
    const language = getUserLanguage(data);
    const salutation = getUserSalutation(data);
    const firstName = getUserFirstName(data);
    const lastName = getUserLastName(data);
    const email = getUserEmail(data);
    const birthDate = getUserBirthDate(data);
    const oldPassword = getOldPassword(data);
    const newPassword = getNewPassword(data);
    const confirmedNewPassword = getConfirmedNewPassword(data);
    return (
      <div className="ProfileEditForm">
        <Row>
          <div className="col">
            <h1>{i18n.t('user_profile_page_title')}</h1>
          </div>
        </Row>
        <Form
          method={this.getFormMethod()}
          onSubmit={this.onSubmitEditForm}
        >
          <Row>
            <div className="col personal-data">
              <DropdownField
                fieldKey="language"
                className="language-select-dropdown"
                items={this.languages}
                placeHolderText={i18n.t('Sprache')}
                value={language}
                onFieldValueChange={this.onFieldChange}
              />
              <h2>{i18n.t('personal')}</h2>
              <RadioField
                onFieldValueChange={this.onFieldChange}
                fieldKey="salutation"
                validatorInstance={this.validator}
                items={this.salutations}
                value={salutation}
                className="salutation"
              />
              <TextField
                onFieldValueChange={this.onFieldChange}
                fieldKey="firstName"
                validatorInstance={this.validator}
                label={`${i18n.t('name')}*`}
                value={firstName}
                validation="required"
              />
              <TextField
                onFieldValueChange={this.onFieldChange}
                fieldKey="lastName"
                validatorInstance={this.validator}
                label={`${i18n.t('lastName')}*`}
                value={lastName}
                validation="required"
              />
              <TextField
                onFieldValueChange={this.onFieldChange}
                fieldKey="email"
                validatorInstance={this.validator}
                label={`${i18n.t('email')}*`}
                value={email}
                validation="required|email"
              />
              <BirthDatePickerField
                onFieldValueChange={this.onFieldChange}
                fieldKey="birthDate"
                value={birthDate}
                validatorInstance={this.validator}
                isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
              />
            </div>
          </Row>
          <Row>
            <div className="col change-password">
              <h2>{i18n.t('password_submit')}</h2>
              <TextField
                onFieldValueChange={this.onFieldChange}
                fieldKey="oldPassword"
                validatorInstance={this.validator}
                label={`${i18n.t('password_old')}*`}
                type="password"
                value={oldPassword}
                className="old-password"
              />
              <Row>
                <div className="col col-sm-12 col-md-6 col-lg-auto new-password-field">
                  <TextField
                    onFieldValueChange={this.onFieldChange}
                    fieldKey="newPassword"
                    validatorInstance={this.validator}
                    label={`${i18n.t('password_new')}*`}
                    type="password"
                    value={newPassword}
                    validation={oldPassword ? `required|not_in:${oldPassword}` : ''}
                    className="new-password"
                  />
                </div>
                <div className="col col-sm-12 col-md-6 col-lg-auto confirm-new-password-field">
                  <TextField
                    onFieldValueChange={this.onFieldChange}
                    fieldKey="confirmNewPassword"
                    validatorInstance={this.validator}
                    label={`${i18n.t('password_new_confirm')}*`}
                    type="password"
                    value={confirmedNewPassword}
                    validation={(oldPassword && newPassword) ? `required|in:${newPassword}` : ''}
                    className="confirm-new-password"
                  />
                </div>
              </Row>
            </div>
          </Row>
          {error && (
          <Row>
            <div className="col">
              <Alert type={ALERT_TYPE.ERROR} className="error-alert">
                <div className="title">
                  {i18n.t('error')}
                </div>
                <div className="message">
                  {error}
                </div>
              </Alert>
            </div>
          </Row>
          )}
          {updateSuccessful && !error && (
            <Row>
              <div className="col">
                <Alert type={ALERT_TYPE.SUCCESS} className="success-alert">
                  <div className="message">
                    {i18n.t('profile_updated_successful')}
                  </div>
                </Alert>
              </div>
            </Row>
          )}
          {isLoading && (
            <div className="is-loading m-2" />
          )}
          {!isLoading && (
          <Row>
            <div className="col">
              <ButtonsGroup>
                <Button
                  type="submit"
                  color={BUTTON_COLOR.OLIVE}
                  className="btn-save"
                >
                  {isMobileMode ? i18n.t('save') : i18n.t('save_changes')}
                </Button>
                <Button
                  type="reset"
                  color={BUTTON_COLOR.STANDARD}
                  onClick={this.onResetClick}
                  className="btn-reset"
                >
                  {i18n.t('reset')}
                </Button>
              </ButtonsGroup>
            </div>
          </Row>
          )}
        </Form>
        <Row>
          <div className="col warning-text">
            <Alert type={ALERT_TYPE.ERROR} withoutCloseIcon>
              <div className="title">
                {i18n.t('warning')}
              </div>
              <div className="message">
                {i18n.t('user_profile_edit_page_warning_text')}
              </div>
            </Alert>
          </div>
        </Row>
      </div>
    );
  }
}

export default ProfileEditForm;
