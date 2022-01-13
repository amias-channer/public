import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputGroup,
  Modal, ModalBody, ModalFooter,
} from 'reactstrap';
import { batch, connect } from 'react-redux';
import Button from '../Button';
import ButtonsGroup from '../ButtonsGroup';
import i18n from '../../utils/i18n';
import './WatchlistAddProductPopup.scss';
import Icon from '../Icon';
import {
  myWatchListAddProduct,
  myWatchListProductPopupCalculateTotalSum,
  myWatchListProductPopupValidateInputField, myWatchListToggleAddProductPopup,
} from './actions';
import { MY_WATCHLIST_API_ADD_PRODUCT_ENDPOINT } from '../UserDashboard/MyWatchList/MyWatchList.helper';
import { ALERT_TYPE } from '../Alert/Alert.helper';
import Alert from '../Alert';
import { formatNumber } from '../../utils/utils';
import HtmlText from '../HtmlText';
import {
  INPUT_FIELD_NAME_POSITION,
  INPUT_FIELD_NAME_PURCHASE_PRICE,
} from './WatchlistAddProductPopup.helper';
import withAuth from '../Authentication/withAuth';
import MessageBoxNonLoggedInUser from '../MessageBoxNonLoggedInUser';
import { authTogglePopup } from '../Authentication/actions';

export const WatchListAddProductPopup = ({
  togglePopup, data, dispatch, onProductAddSuccessful, productIsin, isUserAuthenticated,
}) => {
  const [failure, setFailure] = useState(null);
  const [success, setSuccess] = useState(null);
  const { isLoading } = data;
  const onInputChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    dispatch(myWatchListProductPopupValidateInputField(fieldName, fieldValue));
    dispatch(myWatchListProductPopupCalculateTotalSum(fieldName, fieldValue));
  };

  const onProductAddSuccess = (response) => {
    if (typeof onProductAddSuccessful === 'function') {
      onProductAddSuccessful(response);
    }
    setSuccess(response);
  };

  const onProductAddFailure = (response) => {
    setFailure(response);
  };

  const onAddProduct = () => {
    if (data.invalidPositionError !== null || data.invalidPurchasePriceError !== null) {
      return;
    }

    dispatch(myWatchListAddProduct(
      MY_WATCHLIST_API_ADD_PRODUCT_ENDPOINT,
      productIsin || data.productIsin,
      {
        position: data.position,
        purchasePrice: data.purchasePrice,
      },
      onProductAddSuccess,
      onProductAddFailure,
    ));
  };

  const onInputKeyDown = (e) => {
    if (e.keyCode && e.keyCode === 13) {
      onAddProduct();
    }
  };

  const onErrorDismiss = () => {
    setFailure(null);
  };

  const onLoginRegisterButtonClick = () => {
    batch(() => {
      dispatch(myWatchListToggleAddProductPopup());
      dispatch(authTogglePopup(true));
    });
  };

  const onCloseMessageButtonClick = () => {
    dispatch(myWatchListToggleAddProductPopup());
  };

  return (
    <Modal isOpen toggle={togglePopup} wrapClassName="WatchlistAddProductPopup">
      <div className="modal-title">
        <h1>{i18n.t('title_add_product_to_watchlist')}</h1>
        <Button className="close-button" color="outline" onClick={togglePopup}>
          <Icon type="close" />
        </Button>
      </div>
      {isLoading && (
        <ModalBody>
          <div className="is-loading" />
        </ModalBody>
      )}

      {!isUserAuthenticated && (
        <ModalBody>
          <MessageBoxNonLoggedInUser
            className="mt-4"
            onLoginRegisterButtonClick={onLoginRegisterButtonClick}
            onCloseMessageButtonClick={onCloseMessageButtonClick}
          />
        </ModalBody>
      )}

      {isUserAuthenticated && !success && !failure && !isLoading && (
        <>
          <ModalBody>
            <div className="product-name"><HtmlText data={{ text: data.productName }} /></div>
            <div>
              <InputGroup>
                <div className="input-holder">
                  <span className="input-label">{i18n.t('amount_in_numbers')}</span>
                  <Input type="text" placeholder="1" name={INPUT_FIELD_NAME_POSITION} onChange={onInputChange} value={data.position || ''} onKeyDown={onInputKeyDown} />
                </div>
                <div className="input-holder">
                  <span className="input-label">{i18n.t('purchase_price')}</span>
                  <Input type="text" placeholder="12345" name={INPUT_FIELD_NAME_PURCHASE_PRICE} onChange={onInputChange} value={data.purchasePrice || ''} onKeyDown={onInputKeyDown} />
                </div>
              </InputGroup>
            </div>
            {data.invalidPositionError && (
            <div>
              <Alert type={ALERT_TYPE.ERROR} withoutCloseIcon>
                <div className="title">{i18n.t('error')}</div>
                <div className="message">
                  {data.invalidPositionError}
                </div>
              </Alert>
            </div>
            )}
            {data.invalidPurchasePriceError && (
              <div>
                <Alert type={ALERT_TYPE.ERROR} withoutCloseIcon>
                  <div className="title">{i18n.t('error')}</div>
                  <div className="message">
                    {data.invalidPurchasePriceError}
                  </div>
                </Alert>
              </div>
            )}
            {data.totalSumCalculationError && (
              <Alert type={ALERT_TYPE.ERROR} onDismiss={onErrorDismiss}>
                <div className="title">{i18n.t('total_sum_calculation_error')}</div>
                <div className="message">
                  {data.totalSumCalculationError}
                </div>
              </Alert>
            )}
            <div className="total-sum">
              <span>
                {i18n.t('total_sum')}
                :
              </span>
              <span>{`${formatNumber(data.totalSum)}`}</span>
            </div>
          </ModalBody>
          <ModalFooter>
            <ButtonsGroup>
              <Button className="apply-button" type="submit" color="olive" onClick={onAddProduct}>{i18n.t('Apply')}</Button>
              <Button className="cancel-button" type="reset" color="standard" onClick={togglePopup}>{i18n.t('Cancel')}</Button>
            </ButtonsGroup>
          </ModalFooter>
        </>
      )}
      {failure && !isLoading && (
        <>
          <ModalBody>
            <div className="product-name mb-4"><HtmlText data={{ text: data.productName }} /></div>
            <Alert type={ALERT_TYPE.ERROR} onDismiss={onErrorDismiss}>
              <div className="title">{i18n.t('product_add_failure')}</div>
              <div className="message">
                <HtmlText tag="span" data={{ text: failure.message || i18n.t('product_add_failure_default') }} />
              </div>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <ButtonsGroup>
              <Button className="apply-button" type="submit" color="olive" onClick={onErrorDismiss}>{i18n.t('Try again')}</Button>
              <Button className="cancel-button" type="reset" color="standard" onClick={togglePopup}>{i18n.t('Cancel')}</Button>
            </ButtonsGroup>
          </ModalFooter>
        </>
      )}
      {success && !isLoading && (
        <>
          <ModalBody>
            <div className="product-name mb-4">{data.productName}</div>
            <Alert type={ALERT_TYPE.SUCCESS}>
              <div className="title">{i18n.t('product_add_success')}</div>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <ButtonsGroup>
              <Button className="cancel-button" type="reset" color="standard" onClick={togglePopup}>{i18n.t('close')}</Button>
            </ButtonsGroup>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
};

WatchListAddProductPopup.propTypes = {
  togglePopup: PropTypes.func,
  dispatch: PropTypes.func,
  onProductAddSuccessful: PropTypes.func,
  productIsin: PropTypes.string,
  productName: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  isUserAuthenticated: PropTypes.bool,
};

WatchListAddProductPopup.defaultProps = {
  togglePopup: () => {},
  dispatch: () => {},
  onProductAddSuccessful: () => {},
  data: {
    position: 1,
    purchasePrice: '',
    totalSum: 0.00,
    isLoading: false,
    totalSumCalculationError: null,
  },
  productIsin: '',
  productName: '',
  isUserAuthenticated: false,
};

const mapStateToProps = (state) => ({
  data: state.watchListAddProductPopup,
});

export default withAuth(connect(mapStateToProps)(React.memo(WatchListAddProductPopup)));
