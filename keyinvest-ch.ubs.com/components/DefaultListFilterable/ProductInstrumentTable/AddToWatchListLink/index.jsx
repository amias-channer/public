import React from 'react';
import { batch, connect } from 'react-redux';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import PropTypes from 'prop-types';
import i18n from '../../../../utils/i18n';
import AddProductPopup from '../../../WatchlistAddProductPopup';
import {
  myWatchListGetAskPriceForProduct,
  myWatchListToggleAddProductPopup,
} from '../../../WatchlistAddProductPopup/actions';
import { MY_WATCHLIST_API_GET_PRODUCT_ASK_PRICE_ENDPOINT } from '../../../UserDashboard/MyWatchList/MyWatchList.helper';

const AddToWatchListLink = ({
  className,
  isin,
  addProductPopup,
  dispatch,
}) => {
  const onAddToWatchListClick = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    batch(() => {
      dispatch(myWatchListToggleAddProductPopup());
      dispatch(myWatchListGetAskPriceForProduct(
        MY_WATCHLIST_API_GET_PRODUCT_ASK_PRICE_ENDPOINT,
        { isin },
      ));
    });
  };

  const onToggleAddProductPopup = () => {
    dispatch(myWatchListToggleAddProductPopup());
  };

  return (
    <div className={classNames('AddToWatchListLink', className)}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        href="#"
        tabIndex="-1"
        role="button"
        className="link"
        onClick={onAddToWatchListClick}
      >
        {i18n.t('add_to_watchlist')}
      </a>
      {addProductPopup.shouldDisplay && isin === addProductPopup.productIsin && (
        <AddProductPopup togglePopup={onToggleAddProductPopup} />
      )}
    </div>
  );
};

AddToWatchListLink.propTypes = {
  className: PropTypes.string,
  dispatch: PropTypes.func,
  isin: PropTypes.string,
  addProductPopup: PropTypes.objectOf(PropTypes.any),
};
AddToWatchListLink.defaultProps = {
  className: '',
  dispatch: () => {},
  isin: null,
  addProductPopup: {},
};

const EMPTY_OBJ = {};
const mapStateToProps = (state) => ({
  addProductPopup: pathOr(EMPTY_OBJ, ['watchListAddProductPopup'], state),
});

export default React.memo(connect(mapStateToProps)(AddToWatchListLink));
