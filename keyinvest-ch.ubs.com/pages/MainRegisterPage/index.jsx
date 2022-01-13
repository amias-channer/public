import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { produce } from 'immer';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col, Row, Alert } from 'reactstrap';
import { stringify } from 'query-string';
import MediaQuery from 'react-responsive';
import mediaQueries from '../../utils/mediaQueries';
import { mainRegisterFetchContent, mainRegisterPostFormData } from './actions';
import './MainRegister.scss';
import SearchBox from './SearchBox';
import {
  getColumnsToRender,
  getDisclaimerAcceptanceText,
  getDisclaimerMessage,
  getInstrumentData,
  getNoInstrumentFoundMessage,
  getTitle,
} from './MainRegisterComponent.helper';
import HtmlText from '../../components/HtmlText';
import KeyValueTable from '../../components/KeyValueTable';
import SimpleTable from '../../components/SimpleTable';
import Checkbox from '../../components/CheckboxInput';
import { dispatchAnalyticsMainRegisterSearchTrack } from '../../analytics/Analytics.helper';
import i18n from '../../utils/i18n';

const KEY_TEXT_ACCEPTANCE = 'acceptanceText';
export class MainRegisterPageComponent extends PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.state = {
      acceptanceCheckboxChecked: false,
      acceptanceError: false,
      inputSearchText: '',
      inputSearchError: false,
    };
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onInputTextChange = this.onInputTextChange.bind(this);
    this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
    dispatch(mainRegisterFetchContent());
  }

  onCheckboxChange(e) {
    const { checked } = e.target;
    this.setState(produce((draft) => {
      draft.acceptanceCheckboxChecked = !!checked;
    }));
  }

  onInputTextChange(e) {
    const { value } = e.target;
    this.setState(produce((draft) => {
      draft.inputSearchText = value;
    }));

    if (e.keyCode === 13) {
      this.onSearchButtonClick(e);
    }
  }

  onSearchButtonClick(e) {
    e.preventDefault();
    const { acceptanceCheckboxChecked, inputSearchText } = this.state;
    const { dispatch } = this.props;
    if (!acceptanceCheckboxChecked) {
      this.setState(produce((draft) => {
        draft.acceptanceError = true;
      }));
      return;
    }

    this.setState(produce((draft) => {
      draft.acceptanceError = false;
    }));

    if (!inputSearchText) {
      this.setState(produce((draft) => {
        draft.inputSearchError = true;
      }));
      return;
    }

    this.setState(produce((draft) => {
      draft.inputSearchError = false;
    }));

    dispatch(mainRegisterPostFormData(stringify({
      mainRegisterDisclaimerAccept: 'on',
      identifier: inputSearchText,
    })));

    // Track Analytics when search triggered
    dispatchAnalyticsMainRegisterSearchTrack(inputSearchText);
  }

  render() {
    const {
      data, isLoading, tableIsLoading, error,
    } = this.props;
    const {
      acceptanceCheckboxChecked, acceptanceError, inputSearchError,
    } = this.state;
    return (
      <>
        {isLoading && (
          <div className="main-register-loader is-loading" />
        )}
        <div className="MainRegister col-lg">
          {!isLoading && (
            <>
              {getTitle(data) && (
              <h1>{getTitle(data)}</h1>
              )}
              {getDisclaimerMessage(data) && (
                <>
                  <HtmlText data={{ text: getDisclaimerMessage(data) }} tag="p" />
                  <Checkbox
                    labelClassName={classNames(acceptanceError ? 'error-text' : '')}
                    label={getDisclaimerAcceptanceText(data)}
                    value={KEY_TEXT_ACCEPTANCE}
                    name={KEY_TEXT_ACCEPTANCE}
                    checked={acceptanceCheckboxChecked}
                    onChange={this.onCheckboxChange}
                  />
                </>
              )}

              <Row>
                <Col className="search-box-container">
                  <SearchBox
                    inputPlaceholder={data.identifierFieldText}
                    searchButtonText={data.searchButtonLabel}
                    onInputTextChange={this.onInputTextChange}
                    onSearchButtonClick={this.onSearchButtonClick}
                    inputSearchError={inputSearchError}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  {!error && !tableIsLoading && getInstrumentData(data) === false && (
                    <Alert color="warning">
                      {getNoInstrumentFoundMessage(data)}
                    </Alert>
                  )}
                  {!tableIsLoading && getInstrumentData(data) === false && error && (
                    <Alert color="danger">{i18n.t('error_message_technical_problem')}</Alert>
                  )}
                  {tableIsLoading && (
                    <div className="is-loading" />
                  )}
                  {getInstrumentData(data) && Object.keys(getInstrumentData(data)).length > 0 && (
                    <>
                      <MediaQuery query={mediaQueries.mobileTabletOnly}>
                        <KeyValueTable fields={{ data: getInstrumentData(data) }} />
                      </MediaQuery>
                      <MediaQuery query={mediaQueries.notebook}>
                        <SimpleTable
                          parentComponentName="Main Register"
                          columnsToRender={getColumnsToRender(data)}
                          rows={[getInstrumentData(data)]}
                        />
                      </MediaQuery>
                    </>
                  )}
                </Col>
              </Row>
            </>
          )}
        </div>
      </>
    );
  }
}

MainRegisterPageComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
  tableIsLoading: PropTypes.bool,

};

MainRegisterPageComponent.defaultProps = {
  dispatch: () => {},
  error: null,
  data: {
    disclaimer: {
      message: '',
      acceptanceText: '',
    },
    identifierFieldText: '',
    searchButtonLabel: '',
  },
  isLoading: false,
  tableIsLoading: false,
};

const mapStateToProps = (state) => ({
  data: state && state.mainRegister && state.mainRegister.data,
  error: state && state.mainRegister && state.mainRegister.error,
  isLoading: state && state.mainRegister && state.mainRegister.isLoading,
  tableIsLoading: state && state.mainRegister && state.mainRegister.tableIsLoading,
});
const MainRegisterPage = connect(mapStateToProps)(MainRegisterPageComponent);
export default MainRegisterPage;
