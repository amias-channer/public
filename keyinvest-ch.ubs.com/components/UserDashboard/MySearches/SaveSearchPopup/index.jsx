import React from 'react';
import { connect } from 'react-redux';
import {
  Modal, ModalBody, ModalFooter, Form,
} from 'reactstrap';
import { path, pathOr } from 'ramda';
import PropTypes from 'prop-types';
import i18n from '../../../../utils/i18n';
import Button from '../../../Button';
import Icon from '../../../Icon';
import Alert from '../../../Alert';
import { ALERT_TYPE } from '../../../Alert/Alert.helper';
import TextInput from '../../../TextInput';
import ButtonsGroup from '../../../ButtonsGroup';
import {
  mySearchesError,
  mySearchesFailureDismiss,
  mySearchesOnSearchNameChange,
  mySearchesSave,
  toggleSaveSearchPopup,
} from '../actions';
import FilterIcon from './FilterIcon';
import './SaveSearchPopup.scss';
import ActiveFilters
  from '../../../DefaultListFilterable/ProductFilters/ActiveFilters';
import withAuth from '../../../Authentication/withAuth';
import MessageBoxNonLoggedInUser from '../../../MessageBoxNonLoggedInUser';
import { authTogglePopup } from '../../../Authentication/actions';
import {
  getCurrentPageQueryString,
  getSaveSearchEndpointFromFiltersData,
} from '../MySearches.helper';
import { getFiltersActiveTagsToSave } from '../../../DefaultListFilterable/ProductFilters/ActiveFilters/ActiveFilters.helper';
import HtmlText from '../../../HtmlText';

export const SaveSearchPopupCmp = ({
  dispatch, filtersData, failure, success, isLoading,
  isVisible, isUserAuthenticated, searchName, currentStateName,
  translationTexts,
}) => {
  const onSearchNameChange = (e) => {
    if (e && e.target) {
      dispatch(mySearchesOnSearchNameChange(e.target.value));
    }
  };
  const closePopupClick = () => dispatch(toggleSaveSearchPopup(false, null));
  const openLoginForm = () => dispatch(authTogglePopup(true));

  const saveSearchClick = () => {
    if (!searchName) {
      dispatch(mySearchesError({ message: i18n.t('error_filter_name_required') }));
      return;
    }

    dispatch(mySearchesSave(
      getSaveSearchEndpointFromFiltersData(filtersData),
      searchName,
      getCurrentPageQueryString(),
      getFiltersActiveTagsToSave(filtersData),
      currentStateName,
    ));
  };

  const onFailureDismiss = () => {
    dispatch(mySearchesFailureDismiss());
  };

  const { saveFilterSuccessTitle } = translationTexts;

  return isVisible ? (
    <>
      {!isUserAuthenticated && (
        <MessageBoxNonLoggedInUser
          onLoginRegisterButtonClick={openLoginForm}
          onCloseMessageButtonClick={closePopupClick}
        />
      )}
      {isUserAuthenticated && (
        <Modal isOpen toggle={closePopupClick} wrapClassName="SaveSearchPopup">
          <div className="modal-title">
            <div className="row">
              <div className="col-auto pr-3 pt-2"><FilterIcon /></div>
              <div className="col-auto mr-auto"><h1>{i18n.t('save_filter_to_my_searches_title')}</h1></div>
              <div className="col-auto">
                <Button className="close-button" color="outline" onClick={closePopupClick}>
                  <Icon type="close" />
                </Button>
              </div>
            </div>
          </div>
          {isLoading && (
            <ModalBody>
              <div className="is-loading" />
            </ModalBody>
          )}
          {!isLoading && (
            <>
              <ModalBody>
                {failure && (
                  <Alert type={ALERT_TYPE.ERROR} onDismiss={onFailureDismiss}>
                    <div className="title">{i18n.t('save_filter_to_my_searches_error_title')}</div>
                    <div className="message">
                      <HtmlText tag="span" data={{ text: failure.message || i18n.t('error_message_technical_problem') }} />
                    </div>
                  </Alert>
                )}
                {success && (
                  <Alert withoutCloseIcon type={ALERT_TYPE.SUCCESS}>
                    <div className="title">{saveFilterSuccessTitle}</div>
                    <div className="message">
                      <HtmlText tag="span" data={{ text: success.message }} />
                    </div>
                  </Alert>
                )}

                {!success && (
                  <div className="save-container">
                    <div className="row pb-3">
                      <div className="col-auto">
                        <FilterIcon className="small" />
                      </div>
                      <div className="col">
                        <Form onSubmit={saveSearchClick}>
                          <TextInput
                            className="search-name-input"
                            onChange={onSearchNameChange}
                            value={searchName}
                            placeholder={i18n.t('enter_filter_name')}
                          />
                        </Form>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <ActiveFilters
                          data={filtersData}
                          displayResetButton={false}
                          displaySaveButton={false}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              {!success && (
              <ModalFooter>
                <ButtonsGroup>
                  <Button className="apply-button" type="submit" color="olive" onClick={saveSearchClick}>{i18n.t('Apply')}</Button>
                  <Button className="cancel-button" type="reset" color="standard" onClick={closePopupClick}>{i18n.t('Cancel')}</Button>
                </ButtonsGroup>
              </ModalFooter>
              )}
            </>
          )}
        </Modal>
      )}
    </>
  ) : null;
};

const mapStateToProps = (state) => ({
  isVisible: path(['mySearches', 'savePopup', 'visible'], state),
  filtersData: path(['mySearches', 'savePopup', 'filtersData'], state),
  isLoading: path(['mySearches', 'savePopup', 'isLoading'], state),
  failure: path(['mySearches', 'savePopup', 'failure'], state),
  success: path(['mySearches', 'savePopup', 'success'], state),
  searchName: path(['mySearches', 'savePopup', 'searchName'], state),
  currentStateName: pathOr('', ['global', 'stateName'], state),
});

SaveSearchPopupCmp.propTypes = {
  filtersData: PropTypes.objectOf(PropTypes.any),
  failure: PropTypes.objectOf(PropTypes.any),
  success: PropTypes.objectOf(PropTypes.any),
  isUserAuthenticated: PropTypes.bool,
  isVisible: PropTypes.bool,
  isLoading: PropTypes.bool,
  searchName: PropTypes.string,
  currentStateName: PropTypes.string,
  dispatch: PropTypes.func,
  translationTexts: PropTypes.objectOf(PropTypes.any),
};

SaveSearchPopupCmp.defaultProps = {
  filtersData: null,
  failure: null,
  success: null,
  isUserAuthenticated: false,
  isLoading: false,
  isVisible: false,
  searchName: '',
  currentStateName: '',
  dispatch: () => {},
  translationTexts: {},
};
const SaveSearchPopup = connect(mapStateToProps)(React.memo(withAuth(SaveSearchPopupCmp)));
export default SaveSearchPopup;
