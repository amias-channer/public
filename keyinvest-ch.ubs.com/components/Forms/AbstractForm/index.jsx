import React from 'react';
import produce from 'immer';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import {
  isNil, mergeRight, pathOr, reject,
} from 'ramda';
import HttpService from '../../../utils/httpService';
import {
  DEFAULT_GENERATE_TOKEN_PATH,
  FORM_CONTENT_TYPE_APPLICATION_X_FORM,
  FORM_METHOD_POST,
  FORM_STATUS_ERROR,
  FORM_STATUS_LOADING,
  FORM_STATUS_READY,
  FORM_STATUS_SUCCESS,
} from '../Forms.helper';
import i18n from '../../../utils/i18n';
import HtmlText from '../../HtmlText';
import { analyticsFormTrackStart } from '../../../analytics/actions';
import {
  dispatchAnalyticsFormTrack,
  NETCENTRIC_FORM_TRACK_EVENT_NAME_ERROR,
  NETCENTRIC_FORM_TRACK_EVENT_NAME_SUCCESS,
} from '../../../analytics/Analytics.helper';

class AbstractForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fetchToken = this.fetchToken.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      formStatus: 'form-loading',
      formErrorMessage: null,
      formSuccessMessage: null,
    };
  }

  componentDidMount() {
    this.setState(produce((draft) => {
      draft.formStatus = FORM_STATUS_READY;
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  getFormStatusLoadingContent() {
    return <div className="pb-5 pt-5 form-loading-icon"><div className="is-loading" /></div>;
  }

  getFormStatusErrorContent() {
    return <Alert color="danger"><HtmlText data={{ text: this.getFormErrorMessage() }} /></Alert>;
  }

  getFormStatusSuccessContent() {
    return <Alert color="success"><HtmlText data={{ text: this.getFormSuccessMessage() }} /></Alert>;
  }

  getFormStatusContent() {
    const { formStatus } = this.state;
    switch (formStatus) {
      case FORM_STATUS_LOADING:
        return this.getFormStatusLoadingContent();
      case FORM_STATUS_SUCCESS:
        return this.getFormStatusSuccessContent();
      case FORM_STATUS_ERROR:
        return this.getFormStatusErrorContent();
      default:
        return null;
    }
  }

  getSerializedValidationMessagesForAnalytics() {
    if (this.validator && typeof this.validator.getErrorMessages === 'function') {
      const errorMessages = this.validator.getErrorMessages();
      return reject(isNil, Object.keys(errorMessages).map(
        (fieldKey) => errorMessages[fieldKey],
      )).join('|');
    }
    return null;
  }

  getFormSuccessMessage() {
    const { formSuccessMessage } = this.state;
    return formSuccessMessage;
  }

  getFormErrorMessage() {
    const { formErrorMessage } = this.state;
    return formErrorMessage;
  }

  // eslint-disable-next-line class-methods-use-this
  getAnalyticsFormName() {
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  getFormEndpoint() {
    return HttpService.getPageApiUrl();
  }

  // eslint-disable-next-line class-methods-use-this
  getFormMethod() {
    return FORM_METHOD_POST;
  }

  // eslint-disable-next-line class-methods-use-this
  getFormContentType() {
    return FORM_CONTENT_TYPE_APPLICATION_X_FORM;
  }

  getTokenEndpoint() {
    return this.getFormEndpoint() + DEFAULT_GENERATE_TOKEN_PATH;
  }

  // eslint-disable-next-line class-methods-use-this
  getFormFieldsToSubmit() {
    return {};
  }

  // eslint-disable-next-line class-methods-use-this
  getFormRequestHeaders() {
    return {};
  }

  isFormLoading() {
    const { formStatus } = this.state;
    return formStatus === FORM_STATUS_LOADING;
  }

  isFormSuccess() {
    const { formStatus } = this.state;
    return formStatus === FORM_STATUS_SUCCESS;
  }

  // eslint-disable-next-line class-methods-use-this
  shouldBeAnalyticsTracked() {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  isTokenRequired() {
    return true;
  }

  submitForm() {
    return new Promise((resolve, rjct) => {
      this.setState(produce((draft) => {
        draft.formStatus = FORM_STATUS_LOADING;
      }), () => {
        if (this.isTokenRequired()) {
          this.fetchToken().then(() => {
            this.submitFinalForm().then(resolve, rjct);
          }, rjct);
        } else {
          this.submitFinalForm().then(resolve, rjct);
        }
      });
    });
  }

  submitFinalForm() {
    return new Promise((resolve, rjct) => {
      const fields = this.getFormFieldsToSubmit();
      const data = JSON.stringify(fields);
      const params = {
        method: this.getFormMethod(),
        headers: mergeRight({
          'Content-type': this.getFormContentType(),
        }, this.getFormRequestHeaders()),
        data,
        withCredentials: true,
      };

      HttpService.fetch(
        this.getFormEndpoint(), params,
      )
        .then((response) => {
          this.setState(produce((draft) => {
            draft.formStatus = FORM_STATUS_SUCCESS;
            draft.formErrorMessage = null;
            draft.formSuccessMessage = pathOr('Success', ['message'], response);
          }), () => {
            resolve(response);
          });
        }, (response) => {
          this.setState(produce((draft) => {
            draft.formStatus = FORM_STATUS_ERROR;
            draft.formSuccessMessage = null;
            draft.formErrorMessage = pathOr(i18n.t('error_message_technical_problem'), ['message'], response);
          }), () => {
            rjct(response);
          });
        });
    });
  }

  fetchToken() {
    return new Promise((resolve, rjct) => {
      this.setState(produce((draft) => {
        draft.formStatus = FORM_STATUS_LOADING;
      }), () => {
        HttpService.fetch(
          this.getTokenEndpoint(),
        ).then((response) => {
          resolve(response);
        }, (response) => {
          this.setState(produce((draft) => {
            draft.formStatus = FORM_STATUS_ERROR;
            draft.formErrorMessage = pathOr(i18n.t('error_message_technical_problem'), ['message'], response);
          }), () => {
            rjct(response);
          });
        });
      });
    });
  }

  trackFormStart() {
    if (this.shouldBeAnalyticsTracked() && this.getAnalyticsFormName()) {
      const { formStarted, dispatch } = this.props;
      if (!formStarted) {
        dispatch(analyticsFormTrackStart(
          this.getAnalyticsFormName(),
          '',
          '',
        ));
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  trackFormSuccess() {
    if (this.shouldBeAnalyticsTracked() && this.getAnalyticsFormName()) {
      dispatchAnalyticsFormTrack(
        this.getAnalyticsFormName(),
        NETCENTRIC_FORM_TRACK_EVENT_NAME_SUCCESS,
        '',
        '',
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  trackFormError(errorMessage) {
    if (this.shouldBeAnalyticsTracked() && this.getAnalyticsFormName()) {
      dispatchAnalyticsFormTrack(
        this.getAnalyticsFormName(),
        NETCENTRIC_FORM_TRACK_EVENT_NAME_ERROR,
        errorMessage,
        '',
      );
    }
  }

  render() {
    return null;
  }
}
AbstractForm.propTypes = {
  formStarted: PropTypes.bool,
  dispatch: PropTypes.func,
};

AbstractForm.defaultProps = {
  formStarted: false,
  dispatch: () => {},
};

export default AbstractForm;
