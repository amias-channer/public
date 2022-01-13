import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import InlineKeyValueTable from '../../../InlineKeyValueTable';
import Image from '../../../Image';
import {
  getSignalBottomFields,
  getSignalLeverageProducts,
  getSignalTopFields,
  getSignalPatternId,
  getSignalChartPreviewByResponsiveMode,
  getSignalDirectionOrientation,
} from './TrendRadarSignal.helper';
import MarketLeverageInstrument from '../../../Market/MarketLeverageInstrument';
import i18n from '../../../../utils/i18n';
import TrendRadarSignalHeader from './TrendRadarSignalHeader';
import {
  DESKTOP_MODE,
  NOTEBOOK_MODE,
} from '../../../../utils/responsive';
import TrendRadarSignalGenericFields from './TrendRadarSignalGenericFields';
import {
  getRelatedProductType,
  getTrendRadarSignalDetailLink,
} from '../../../../utils/utils';
import './TrendRadarSignal.scss';
import Button, { BUTTON_COLOR } from '../../../Button';
import MessageBoxNonLoggedInUser from '../../../MessageBoxNonLoggedInUser';
import {
  getPatternTypeName,
  getSaveSignalUrl,
  getUnderlyingName,
} from '../TrendRadarListFilterable.helper';

const TrendRadarSignal = (props) => {
  const {
    className, data, responsiveMode, onShowCreateAlertFormPopup, isUserAuthenticated, onSaveSignal,
  } = props;

  const isNoteOrDesk = responsiveMode === DESKTOP_MODE || responsiveMode === NOTEBOOK_MODE;
  const signalPatternId = getSignalPatternId(data);
  const signalDetailsPageLink = getTrendRadarSignalDetailLink(signalPatternId);
  const [showLoginRegisterMessageBox, setShowLoginRegisterMessageBox] = useState(false);
  const detailsButton = signalDetailsPageLink && (
    <div className="signal-footer">
      <Button
        color={BUTTON_COLOR.ATLANTIC_DARK}
        RenderAs={NavLink}
        to={signalDetailsPageLink}
        className="details-button"
      >
        {i18n.t('to_details')}
      </Button>
    </div>
  );

  const signalLeverageProducts = getSignalLeverageProducts(data);

  const onCloseLoginRegisterMessage = () => {
    setShowLoginRegisterMessageBox(false);
  };

  const onShowCreateAlertForm = (signalAddAlertUrl) => {
    if (!isUserAuthenticated) {
      setShowLoginRegisterMessageBox(true);
      return;
    }
    onShowCreateAlertFormPopup(signalAddAlertUrl);
  };

  const onSaveSignalPopup = () => {
    if (!isUserAuthenticated) {
      setShowLoginRegisterMessageBox(true);
      return;
    }
    const signalData = {
      saveSignalUrl: getSaveSignalUrl(data),
      underlyingName: getUnderlyingName(data),
      patternTypeName: getPatternTypeName(data),
    };
    onSaveSignal(signalData);
  };

  return (
    <div className={classNames('TrendRadarSignal', className)}>
      {!isUserAuthenticated && showLoginRegisterMessageBox && (
        <MessageBoxNonLoggedInUser
          message={i18n.t('trend_radar_list_signal_login_required')}
          title={i18n.t('please_login')}
          onCloseMessageButtonClick={onCloseLoginRegisterMessage}
        />
      )}
      <TrendRadarSignalHeader
        className="signal-header"
        data={data}
        responsiveMode={responsiveMode}
        onShowCreateAlertFormPopup={onShowCreateAlertForm}
        onSaveSignal={onSaveSignalPopup}
      />

      <div className="signal-top-inline-fields">
        <InlineKeyValueTable fieldsSeparator="|" fields={getSignalTopFields(data)} />
      </div>

      {!isNoteOrDesk && (
        <TrendRadarSignalGenericFields
          className="signal-columns-fields"
          data={data}
          responsiveMode={responsiveMode}
        />
      )}

      <div className="signal-body row">
        <div className="left-side col-lg-auto">
          <div className="signal-chart-preview">
            <Image
              source={getSignalChartPreviewByResponsiveMode(data, responsiveMode)}
            />
          </div>
          <div className="signal-bottom-fields">
            <InlineKeyValueTable fieldsSeparator="|" itemsClassName="d-inline-block" fields={getSignalBottomFields(data)} />
          </div>
          {isNoteOrDesk && (
            detailsButton
          )}
        </div>
        <div className="right-side col-lg">
          {isNoteOrDesk && (
            <TrendRadarSignalGenericFields
              className="signal-columns-fields"
              data={data}
              responsiveMode={responsiveMode}
            />
          )}
          <div className="signal-leverage-products">
            <div className="col">
              <h3 className="sub-title">{i18n.t('Passende Produkte')}</h3>

              {!signalLeverageProducts && (
                <div className="notice-message pb-4">
                  {i18n.t('trend_radar_loading_related_products')}
                  ...
                </div>
              )}
              {signalLeverageProducts && signalLeverageProducts.length === 0 && (
                <div className="notice-message pb-4">{i18n.t('trend_radar_no_related_products')}</div>
              )}
              {signalLeverageProducts
              && signalLeverageProducts.length > 0
              && signalLeverageProducts.map((product) => (
                <MarketLeverageInstrument
                  responsiveMode={responsiveMode}
                  type={getRelatedProductType(product, getSignalDirectionOrientation(data))}
                  key={product.sin || product.isin || product.name}
                  data={product}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {!isNoteOrDesk && (
        detailsButton
      )}
    </div>
  );
};

TrendRadarSignal.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  responsiveMode: PropTypes.string.isRequired,
  onShowCreateAlertFormPopup: PropTypes.func,
  isUserAuthenticated: PropTypes.bool,
  onSaveSignal: PropTypes.func,
};
TrendRadarSignal.defaultProps = {
  className: '',
  data: {},
  onShowCreateAlertFormPopup: () => {},
  isUserAuthenticated: false,
  onSaveSignal: () => {},
};

export default React.memo(TrendRadarSignal);
