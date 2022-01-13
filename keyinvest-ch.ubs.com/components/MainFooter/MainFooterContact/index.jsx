import React from 'react';
import { Form } from 'reactstrap';
import { connect } from 'react-redux';
import { path, pathOr } from 'ramda';
import { produce } from 'immer';
import PropTypes from 'prop-types';
import i18n from '../../../utils/i18n';
import HttpService from '../../../utils/httpService';
import ButtonsGroup from '../../ButtonsGroup';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../../Button';
import { createValidatorInstance } from '../../../utils/SimpleReactValidator';
import TextField from '../../Forms/Fields/TextField';
import './MainFooterContact.scss';
import {
  dispatchAnalyticsFormTrack,
  NETCENTRIC_FORM_TRACK_CONTACT,
  NETCENTRIC_FORM_TRACK_EVENT_NAME_ERROR,
  NETCENTRIC_FORM_TRACK_EVENT_NAME_SUCCESS,
} from '../../../analytics/Analytics.helper';
import { analyticsFormTrackStart } from '../../../analytics/actions';
import { adformTrackEventClick } from '../../../adformTracking/AdformTracking.helper';

export class MainFooterContactCmp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.contactFormRef = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.postContactForm = this.postContactForm.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onFieldClick = this.onFieldClick.bind(this);
    this.setState = this.setState.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.trackFormStart = this.trackFormStart.bind(this);
    this.trackFormSuccess = this.trackFormSuccess.bind(this);
    this.trackFormError = this.trackFormError.bind(this);
    this.registerEventListener();
    this.state = {
      email: '',
      question: '',
      submitted: false,
      message: '',
    };
    this.validator = createValidatorInstance();
  }

  onFieldClick() {
    this.trackFormStart();
  }

  onFieldChange(fieldKey, value) {
    this.setState(produce((draft) => {
      draft[fieldKey] = value;
    }));
  }

  onSubmit(event) {
    event.preventDefault();
    const { email, question } = this.state;
    adformTrackEventClick(
      event,
      'contact-form-submit-click',
    );
    this.trackFormStart();
    if (this.validator.allValid()) {
      this.postContactForm({
        email,
        question,
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
      const errorMessages = this.validator.getErrorMessages();
      const serializedMessages = Object.keys(errorMessages).map((fieldKey) => errorMessages[fieldKey]).join('|');
      this.trackFormError(serializedMessages);
    }
  }

  trackFormStart() {
    const { formStarted, dispatch } = this.props;
    if (!formStarted) {
      dispatch(analyticsFormTrackStart(
        NETCENTRIC_FORM_TRACK_CONTACT,
        '',
        '',
      ));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  trackFormSuccess() {
    dispatchAnalyticsFormTrack(
      NETCENTRIC_FORM_TRACK_CONTACT,
      NETCENTRIC_FORM_TRACK_EVENT_NAME_SUCCESS,
      '',
      '',
    );
  }

  // eslint-disable-next-line class-methods-use-this
  trackFormError(errorMessage) {
    dispatchAnalyticsFormTrack(
      NETCENTRIC_FORM_TRACK_CONTACT,
      NETCENTRIC_FORM_TRACK_EVENT_NAME_ERROR,
      errorMessage,
      '',
    );
  }

  // eslint-disable-next-line react/sort-comp
  handleClickOutside(event) {
    if (this.contactFormRef
        && this.contactFormRef.current
        && !this.contactFormRef.current.contains(event.target)) {
      const { toggle } = this.props;
      toggle();
    }
  }

  registerEventListener() {
    this.unregisterEventListener();
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleClickOutside);
  }

  unregisterEventListener() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  }

  postContactForm(props) {
    const { email, question } = props;
    const { data } = this.props;
    const body = `email=${email}&question=${question}&${data.tokenName}=${data.tokenValue}`;

    HttpService.postFormData(`${HttpService.getPageApiUrl()}/contact`, {
      data: body,
    }).then((response) => {
      const success = response.state === 'OK';
      if (success) {
        this.trackFormSuccess();
      } else {
        this.trackFormError(response.message);
      }
      this.setState({
        submitted: success,
        message: response.message,
      });
    });
  }

  formGroup() {
    const { data } = this.props;
    const { email, question } = this.state;
    return (
      <div>
        <Form
          onSubmit={this.onSubmit}
        >
          <input type="hidden" name={data && data.tokenName} value={data && data.tokenValue} />
          <h2 className="sub-title">{i18n.t('Your message or question')}</h2>

          <TextField
            onFieldValueChange={this.onFieldChange}
            fieldKey="email"
            label={i18n.t('Your email')}
            value={email}
            validatorInstance={this.validator}
            type="email"
            validation="required|email"
            onClick={this.onFieldClick}
          />

          <TextField
            onFieldValueChange={this.onFieldChange}
            label={i18n.t('Your message')}
            fieldKey="question"
            value={question}
            validatorInstance={this.validator}
            type="textarea"
            validation="required"
            onClick={this.onFieldClick}
          />
        </Form>
      </div>
    );
  }

  render() {
    const { toggle, data } = this.props;
    const { submitted, message, token } = this.state;
    const hotline = path(['contactData', 'hotline'])(data);
    const email = path(['contactData', 'email'])(data);
    return (
      <div className="MainFooterContact" ref={this.contactFormRef}>
        <header>
          <Button
            className="close"
            color="outline"
            onClick={toggle}
          >
            <i className="icon-close-bold" />
          </Button>
        </header>

        <div className="content">
          <h2 className="sub-title">{i18n.t('email')}</h2>
          <a className="info" href={`mailto:${email}`}>
            <i className="icon-mail" />
            {email}
          </a>
          <h2 className="sub-title">{i18n.t('hotline')}</h2>
          <a className="info" href={`tel:${hotline}`}>
            <i className="icon-phone" />
            {hotline}
          </a>
          { !submitted ? this.formGroup(token)
            : <h3 className="message">{message}</h3>}
        </div>
        { !submitted
          ? (
            <ButtonsGroup className="btn-group">
              <Button
                color={BUTTON_COLOR.OLIVE}
                size={BUTTON_SIZE.MEDIUM}
                onClick={this.onSubmit}
              >
                {i18n.t('submit')}
              </Button>
              <Button
                color={BUTTON_COLOR.STANDARD}
                size={BUTTON_SIZE.MEDIUM}
                onClick={toggle}
              >
                {i18n.t('close')}
              </Button>
            </ButtonsGroup>
          )
          : null }
      </div>
    );
  }
}

MainFooterContactCmp.propTypes = {
  dispatch: PropTypes.func,
  toggle: PropTypes.func,
  formStarted: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
};

MainFooterContactCmp.defaultProps = {
  toggle: null,
  data: null,
  formStarted: false,
  dispatch: () => { },
};
const mapStateToProps = (state) => ({
  formStarted: pathOr(false, ['analytics', NETCENTRIC_FORM_TRACK_CONTACT, 'started'], state),
});
const MainFooterContact = connect(mapStateToProps)(MainFooterContactCmp);
export default MainFooterContact;
