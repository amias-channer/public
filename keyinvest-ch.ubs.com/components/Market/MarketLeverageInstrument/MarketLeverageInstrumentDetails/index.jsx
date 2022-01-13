import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import LeverageDetailsKeyValueTable from '../../../InlineKeyValueTable';
import i18n from '../../../../utils/i18n';
import {
  getSplittedColumns,
  getIsin, getFilteredInfoColumns,
} from '../MarketLeverageInstrument.helper';
import { getProductLink } from '../../../../utils/utils';
import {
  DESKTOP_MODE,
  MOBILE_MODE,
  TABLET_MODE,
} from '../../../../utils/responsive';
import PriceTiles from './PriceTiles';
import './MarketLeverageInstrumentDetails.scss';
import GenericFields from './GenericFields';
import ProductNavLink from '../../../ProductNavLink';

function MarketLeverageInstrumentDetails(props) {
  const {
    data, responsiveMode, className, parentTrackingComponentName,
  } = props;

  const getProductLinkButton = () => (
    <ProductNavLink
      to={getProductLink('isin', getIsin(data))}
      className="btn btn-atlantic product-details-button"
      isin={getIsin(data)}
      parentComponentName={parentTrackingComponentName}
    >
      {i18n.t('Show product details')}
    </ProductNavLink>
  );

  const { fieldsPart1, fieldsPart2 } = getSplittedColumns(data);

  const layout = {
    default: (
      <>
        <div className="row">
          <GenericFields fields={fieldsPart1} fieldClassName="col bold-field" />
          <GenericFields fields={fieldsPart2} fieldClassName="col" />
          <PriceTiles data={data} className="col-4 bold-field" />
        </div>
        <div className="row">
          <LeverageDetailsKeyValueTable className="col-lg" fields={getFilteredInfoColumns(data)} />
          <div className="col-lg-4 text-lg-right pt-2">
            {getProductLinkButton()}
          </div>
        </div>
      </>
    ),
    [TABLET_MODE]: (
      <>
        <div className="row mb-2">
          <GenericFields fields={fieldsPart1} fieldClassName="col-4 bold-field" />
          <PriceTiles data={data} className="col bold-field" />
        </div>
        <div className="row mb-2">
          <GenericFields fields={fieldsPart2} fieldClassName="col col-md-4 col-lg" />
        </div>
        <div className="row mb-2">
          <LeverageDetailsKeyValueTable className="col-auto" fields={getFilteredInfoColumns(data)} />
          <div className="col-lg-4 text-lg-right">
            {getProductLinkButton()}
          </div>
        </div>
      </>
    ),
    [MOBILE_MODE]: (
      <>
        <div className="row">
          <PriceTiles data={data} className="col bold-field" />
        </div>
        <GenericFields fields={fieldsPart1} mobileMode fieldClassName="mobile-mode bold-field" />
        <GenericFields fields={fieldsPart2} mobileMode fieldClassName="mobile-mode" />
        <div className="row other-fields-row">
          <LeverageDetailsKeyValueTable className="col-auto" fields={getFilteredInfoColumns(data)} />
          <div className="col-lg-4 text-lg-right">
            {getProductLinkButton()}
          </div>
        </div>
      </>
    ),
  };

  return (
    <div className={classNames('MarketLeverageInstrumentDetails', className)}>
      {layout[responsiveMode] ? layout[responsiveMode] : layout.default}
    </div>
  );
}
MarketLeverageInstrumentDetails.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  responsiveMode: PropTypes.string,
  className: PropTypes.string,
  parentTrackingComponentName: PropTypes.string,
};

MarketLeverageInstrumentDetails.defaultProps = {
  data: {},
  responsiveMode: DESKTOP_MODE,
  className: '',
  parentTrackingComponentName: 'Markets Instrument Details',
};

export default React.memo(MarketLeverageInstrumentDetails);
