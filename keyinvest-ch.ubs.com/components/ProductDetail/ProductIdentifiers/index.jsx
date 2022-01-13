import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CopyableText from '../../CopyableText';
import CopyableISIN from '../../CopyableISIN';
import {
  getIsin,
  getSymbol,
  getValor,
  getWkn,
} from '../../../pages/ProductDetailPage/ProductDetailPage.helper';
import {
  adformTrackEventClick,
} from '../../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../../adformTracking/AdformTrackingVars';

const ProductIdentifiers = ({
  productData, dispatch, className,
}) => {
  const wkn = getWkn(productData);
  const symbol = getSymbol(productData);
  const valor = getValor(productData);
  const isin = getIsin(productData);
  const onTextCopy = (e) => {
    adformTrackEventClick(
      e,
      'ISIN-copy-click',
      new AdformTrackingVars().setIsin(isin.value),
    );
  };

  return (
    <div className={classNames('ProductIdentifiers', className)}>
      {wkn && wkn.value && (
        <>
          <span>
            <b>
              {wkn.label}
              {': '}
            </b>
          </span>
          <CopyableText
            onCopy={onTextCopy}
            dispatch={dispatch}
            text={wkn.value}
            uniqId="wkn"
          />
          <span><b> /</b></span>
        </>
      )}
      {symbol && symbol.value && (
        <>
          <span>
            <b>
              {symbol.label}
              {': '}
            </b>
          </span>
          <CopyableText
            onCopy={onTextCopy}
            dispatch={dispatch}
            text={symbol.value}
            uniqId="symbol"
          />
          <span><b> /</b></span>
        </>
      )}
      {isin && isin.value && (
        <>
          <span>
            <b>
              {isin.label}
              {': '}
            </b>
          </span>
          <CopyableISIN
            onCopy={onTextCopy}
            dispatch={dispatch}
            text={isin.value}
          />
        </>
      )}
      {valor.value && (
        <>
          <span><b> /</b></span>
          <span>
            <b>
              {valor.label}
              {': '}
            </b>
          </span>
          <CopyableText
            onCopy={onTextCopy}
            dispatch={dispatch}
            text={valor.value}
            uniqId="valor"
          />
        </>
      )}
    </div>
  );
};

ProductIdentifiers.propTypes = {
  dispatch: PropTypes.func,
  productData: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};
ProductIdentifiers.defaultProps = {
  dispatch: () => {},
  productData: {},
  className: '',
};
export default ProductIdentifiers;
