import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, FormGroup } from 'reactstrap';
import i18n from '../../../../utils/i18n';
import Button, { BUTTON_COLOR } from '../../../Button';
import ButtonsGroup from '../../../ButtonsGroup';
import AbstractForm from '../../../Forms/AbstractForm';
import HttpService from '../../../../utils/httpService';
import { authTogglePopup } from '../../actions';

export class ResendRegisterVerificationEmailFormCmp extends AbstractForm {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.onSubmitResend = this.onSubmitResend.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getFormEndpoint() {
    return `${HttpService.getPageApiUrl()}/user/resend-verification-mail`;
  }

  getFormFieldsToSubmit() {
    const { email } = this.props;
    return { email };
  }

  // eslint-disable-next-line class-methods-use-this
  onSubmitResend(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.submitForm().then(() => {});
  }

  onCloseClick(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    const { dispatch } = this.props;
    dispatch(authTogglePopup(false));
  }

  render() {
    const { className } = this.props;
    return (
      <div className={classNames('ResendRegisterVerificationEmailForm', className)}>
        <Form
          method={this.getFormMethod()}
          onSubmit={this.onSubmitResend}
        >

          {!this.isFormSuccess() && (
            <>{this.getFormStatusContent()}</>
          )}

          {!this.isFormLoading() && (
            <FormGroup>
              <ButtonsGroup>
                <Button
                  type="submit"
                  color={BUTTON_COLOR.OLIVE}
                >
                  {i18n.t('Resend E-mail')}
                </Button>
                <Button
                  type="reset"
                  color={BUTTON_COLOR.STANDARD}
                  onClick={this.onCloseClick}
                >
                  {i18n.t('cancel')}
                </Button>
              </ButtonsGroup>
            </FormGroup>
          )}

        </Form>
      </div>
    );
  }
}

ResendRegisterVerificationEmailFormCmp.propTypes = {
  className: PropTypes.string,
  email: PropTypes.string,
};

ResendRegisterVerificationEmailFormCmp.defaultProps = {
  className: '',
  email: '',
};
const ResendRegisterVerificationEmailForm = connect()(ResendRegisterVerificationEmailFormCmp);
export default ResendRegisterVerificationEmailForm;
