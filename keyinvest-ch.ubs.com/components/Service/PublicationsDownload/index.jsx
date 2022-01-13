import React from 'react';
import { connect } from 'react-redux';
import { produce } from 'immer';
import { pathOr } from 'ramda';
import PropTypes from 'prop-types';
import { Alert, Col, Row } from 'reactstrap';
import i18n from '../../../utils/i18n';
import Logger from '../../../utils/logger';
import {
  publicationsDownloadFetchContent,
  publicationsDownloadPostFormData,
} from './actions';
import './PublicationsDownload.scss';
import { getEmailValidationRegex } from '../../../utils/utils';
import PublicationsForm from './PublicationsForm';
import PublicationDownloadableItem from './PublicationDownloadbleItem';
import { preparePostData } from './PublicationsDownloadComponent.helper';
import {
  dispatchAnalyticsFormTrack,
  NETCENTRIC_FORM_TRACK_DOCUMENT_ORDER,
  NETCENTRIC_FORM_TRACK_EVENT_NAME_ERROR,
  NETCENTRIC_FORM_TRACK_EVENT_NAME_SUCCESS,
} from '../../../analytics/Analytics.helper';
import { analyticsFormTrackStart } from '../../../analytics/actions';

export class PublicationsDownloadComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      selectedPublicationsCheckboxes: {},
      publicationsForm: {
        salutation: {
          isRequired: true,
          value: i18n.t('male'),
          isValidated: null,
        },
        firstName: {
          isRequired: true,
          value: '',
          isValidated: null,
        },
        lastName: {
          isRequired: true,
          value: '',
          isValidated: null,
        },
        company: {
          isRequired: false,
          value: '',
          isValidated: null,
        },
        department: {
          isRequired: false,
          value: '',
          isValidated: null,
        },
        iAm: {
          isRequired: false,
          value: i18n.t('private_investor'),
          isValidated: null,
        },
        street: {
          isRequired: true,
          value: '',
          isValidated: null,
        },
        postalCode: {
          isRequired: true,
          value: '',
          isValidated: null,
        },
        city: {
          isRequired: true,
          value: '',
          isValidated: null,
        },
        country: {
          isRequired: true,
          value: 'DE',
          isValidated: null,
        },
        email: {
          isRequired: true,
          value: '',
          isValidated: null,
        },
      },
    };
    this.onOrderCheckboxChange = this.onOrderCheckboxChange.bind(this);
    this.onFormInputChange = this.onFormInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);

    this.trackFormStart = this.trackFormStart.bind(this);
    this.onFieldClicked = this.onFieldClicked.bind(this);
    this.trackFormSuccess = this.trackFormSuccess.bind(this);
    this.trackFormError = this.trackFormError.bind(this);

    dispatch(publicationsDownloadFetchContent());
  }

  onOrderCheckboxChange(id) {
    const { selectedPublicationsCheckboxes } = this.state;
    if (selectedPublicationsCheckboxes[id]) {
      this.setState(produce((draft) => {
        draft.selectedPublicationsCheckboxes[id] = false;
      }));
    } else {
      this.setState(produce((draft) => {
        draft.selectedPublicationsCheckboxes[id] = true;
      }));
    }
  }

  onFormInputChange(e) {
    this.trackFormStart();

    const { value } = e.target;
    const { name } = e.target;

    if (value) {
      this.setState(produce((draft) => {
        draft.publicationsForm[name].value = value;
      }));
    } else {
      this.setState(produce((draft) => {
        draft.publicationsForm[name].value = '';
        draft.publicationsForm[name].isValidated = null;
      }));
    }
  }

  onFormSubmit(e) {
    this.trackFormStart();
    e.preventDefault();
    const { publicationsForm } = this.state;
    const { dispatch, data } = this.props;
    const { token } = data;
    let formValidated = true;
    const errorMessage = [];
    Object.keys(publicationsForm).forEach((formInput) => {
      if (publicationsForm[formInput].isRequired
          && !this.isValidFormInput(formInput, publicationsForm[formInput].value)) {
        formValidated = false;
        Logger.warn('PUBLICATION FORM VALIDATION FAILED!, Please check field', formInput, publicationsForm[formInput].value);
        errorMessage.push(`The ${formInput} field is not valid`);
      }
    });

    if (errorMessage.length > 0) {
      this.trackFormError(errorMessage.join('|'));
    }
    if (formValidated) {
      dispatch(publicationsDownloadPostFormData(preparePostData(this.state, token)));
      this.trackFormSuccess();
    }
  }

  onFieldClicked() {
    this.trackFormStart();
  }

  getSelectedPublicationNames() {
    const { selectedPublicationsCheckboxes } = this.state;
    const { data } = this.props;
    const publications = pathOr({}, ['publication'])(data);
    const selectedPublicationNames = [];
    Object.keys(publications).forEach((item) => {
      if (selectedPublicationsCheckboxes[item]) {
        selectedPublicationNames.push(publications[item].name);
      }
    });
    return selectedPublicationNames;
  }

  getPublicationsDownloadableItems() {
    const { data } = this.props;
    const publications = pathOr({}, ['publication'])(data);
    const { selectedPublicationsCheckboxes } = this.state;
    return Object.keys(publications).map((item) => (
      <Col className="publication-item-col" key={item} sm={12} lg={6}>
        <PublicationDownloadableItem
          data={publications[item]}
          id={item}
          isChecked={selectedPublicationsCheckboxes[item]}
          onCheckboxChange={this.onOrderCheckboxChange}
        />
      </Col>
    ));
  }

  trackFormStart() {
    const { formStarted, dispatch } = this.props;
    if (!formStarted) {
      dispatch(analyticsFormTrackStart(
        NETCENTRIC_FORM_TRACK_DOCUMENT_ORDER,
        '',
        '',
      ));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  trackFormSuccess() {
    dispatchAnalyticsFormTrack(
      NETCENTRIC_FORM_TRACK_DOCUMENT_ORDER,
      NETCENTRIC_FORM_TRACK_EVENT_NAME_SUCCESS,
      '',
      this.getSelectedPublicationNames().join(),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  trackFormError(errorMessage) {
    dispatchAnalyticsFormTrack(
      NETCENTRIC_FORM_TRACK_DOCUMENT_ORDER,
      NETCENTRIC_FORM_TRACK_EVENT_NAME_ERROR,
      errorMessage,
      this.getSelectedPublicationNames().join(),
    );
  }

  isValidFormInput(inputName, inputValue) {
    if (inputName === 'email' && inputValue.match(getEmailValidationRegex()) === null) {
      this.setState(produce((draft) => {
        draft.publicationsForm[inputName].value = inputValue;
        draft.publicationsForm[inputName].isValidated = false;
      }));
      return false;
    }

    if (!inputValue) {
      this.setState(produce((draft) => {
        draft.publicationsForm[inputName].value = inputValue;
        draft.publicationsForm[inputName].isValidated = false;
      }));
      return false;
    }

    this.setState(produce((draft) => {
      draft.publicationsForm[inputName].value = inputValue;
      draft.publicationsForm[inputName].isValidated = true;
    }));
    return true;
  }

  render() {
    const {
      data, isLoading, formSubmitSuccess, formSubmitSuccessMessage,
    } = this.props;
    const { publicationsForm } = this.state;
    const {
      salutations, countries, userTypes, showOrderForm,
    } = data;
    return (
      <>
        {isLoading && (
          <div className="publications-download-loader is-loading" />
        )}
        <div className="PublicationsDownload col">
          {!isLoading && data && Object.keys(data).length > 0 && (
            <>
              <h1>{i18n.t('factsheets_and_brouchures')}</h1>
              <p>{i18n.t('factsheets_and_brouchures_description')}</p>
              <div className="PublicationsDownloadableItems">
                <Row className="publication-items-row">
                  {this.getPublicationsDownloadableItems()}
                </Row>
              </div>
              {showOrderForm && (
              <PublicationsForm
                salutations={salutations}
                countriesList={countries}
                userTypes={userTypes}
                data={publicationsForm}
                onFormInputChange={this.onFormInputChange}
                onFormSubmit={this.onFormSubmit}
                onFieldClicked={this.onFieldClicked}
              />
              )}

              {formSubmitSuccess && (
              <Alert className="mt-4" color="success">
                {formSubmitSuccessMessage}
              </Alert>
              )}
            </>
          )}
        </div>
      </>
    );
  }
}

PublicationsDownloadComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
  formStarted: PropTypes.bool,
  formSubmitSuccess: PropTypes.bool,
  formSubmitSuccessMessage: PropTypes.string,
};

PublicationsDownloadComponent.defaultProps = {
  data: {},
  formSubmitSuccess: false,
  formSubmitSuccessMessage: '',
  isLoading: false,
  formStarted: false,
  dispatch: () => {},
};

function mapStateToProps(state) {
  return {
    data: state.publicationsDownload.data,
    isLoading: state.publicationsDownload.isLoading,
    formSubmitSuccess: state.publicationsDownload.formSubmitSuccess,
    formSubmitSuccessMessage: state.publicationsDownload.formSubmitSuccessMessage,
    formStarted: pathOr(false, ['analytics', NETCENTRIC_FORM_TRACK_DOCUMENT_ORDER, 'started'], state),
  };
}

const PublicationsDownload = connect(mapStateToProps)(PublicationsDownloadComponent);
export default PublicationsDownload;
