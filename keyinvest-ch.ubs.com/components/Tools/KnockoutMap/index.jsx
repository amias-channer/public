import React from 'react';
import PropTypes from 'prop-types';
import './KnockoutMap.scss';
import { Alert, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { produce } from 'immer';
import { equals } from 'ramda';
import i18n from '../../../utils/i18n';
import Logger from '../../../utils/logger';
import {
  knockoutMapFetchData, knockoutMapWillUnmount,
} from './actions';
import {
  create3dMap,
  getCurrentTradingPlaces,
  getKnockoutMapDataURLTemplate,
  getSelectedUnderlyingName,
  getSelectedUnderlyingSin,
  getSelectedUnderlyingValue,
  getTradingPlaceCheckboxChecked,
  getTradingPlaceCheckboxValue,
  getTradingPlaces,
  getUnderlying,
  getUnderlyings,
  TRADING_PLACE_SIX_SP_EXCHANGE_VALUE,
  TRADING_PLACE_SWISS_DOTS_VALUE,
  TURBO_MAP_ELEMENT_ID,
} from './KnockoutMap.helper';
import SearchableDropdownList from '../../SearchableDropdownList';
import {
  isEmptyData,
  searchAndReplaceTextInString,
} from '../../../utils/utils';
import Checkbox from '../../CheckboxInput';
import HtmlText from '../../HtmlText';
import HttpService from '../../../utils/httpService';

export class KnockoutMapComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      failedToRenderTurboMap: null,
    };
    const { dispatch } = this.props;
    this.d3Module = null;
    this.onUnderlyingSelected = this.onUnderlyingSelected.bind(this);
    this.onTradingPlaceCheckboxChanged = this.onTradingPlaceCheckboxChanged.bind(this);
    const knockOutMapInitialDataUrl = HttpService.getBackendUrlByStateName('knockoutMap', false);
    dispatch(knockoutMapFetchData(knockOutMapInitialDataUrl));
  }

  componentDidMount() {
    try {
      import('../../../libs/d3').then((d3) => {
        this.d3Module = d3;
      }).finally(() => {
        this.build3DMap();
      });
    } catch (e) {
      Logger.warn('An error occurred while dynamically importing D3');
    }
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (!equals(prevProps.data, data)) {
      this.build3DMap();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(knockoutMapWillUnmount());
  }

  onUnderlyingSelected(e) {
    const selectedUnderlyingValue = getSelectedUnderlyingValue(e);
    const selectedUnderlyingName = getSelectedUnderlyingName(e);
    const { dispatch, data } = this.props;

    if (selectedUnderlyingName === getUnderlying(data)[0]) {
      return;
    }

    if (selectedUnderlyingValue) {
      const url = searchAndReplaceTextInString('%s', selectedUnderlyingValue, getKnockoutMapDataURLTemplate());
      dispatch(knockoutMapFetchData(url));
    }
  }

  onTradingPlaceCheckboxChanged(e) {
    const { data, dispatch } = this.props;
    const tradingPlaceCheckboxValue = getTradingPlaceCheckboxValue(e);
    const tradingPlaceCheckboxValueChecked = getTradingPlaceCheckboxChecked(e);
    const selectedUnderlyingSin = getSelectedUnderlyingSin(data);

    if (!selectedUnderlyingSin) {
      Logger.error('Selected underlying sin not found in backend response. It is required to perform checkbox change!');
      return;
    }

    let url = searchAndReplaceTextInString('%s', selectedUnderlyingSin, getKnockoutMapDataURLTemplate());
    if (
      tradingPlaceCheckboxValue === TRADING_PLACE_SIX_SP_EXCHANGE_VALUE
         && tradingPlaceCheckboxValueChecked === false
    ) {
      url += `&tradingPlace=["${TRADING_PLACE_SWISS_DOTS_VALUE}"]`;
    }
    if (
      tradingPlaceCheckboxValue === TRADING_PLACE_SWISS_DOTS_VALUE
      && tradingPlaceCheckboxValueChecked === false
    ) {
      url += `&tradingPlace=["${TRADING_PLACE_SIX_SP_EXCHANGE_VALUE}"]`;
    }
    dispatch(knockoutMapFetchData(url));
  }

  getTradingPlacesCheckboxes(tradingPlaces) {
    const { data } = this.props;
    if (tradingPlaces) {
      return Object.keys(tradingPlaces).map(
        (tradingPlace) => (
          <Checkbox
            key={tradingPlace}
            value={tradingPlace}
            name={tradingPlace}
            label={tradingPlaces[tradingPlace].label}
            checked={getCurrentTradingPlaces(data).indexOf(tradingPlace) > -1}
            onChange={this.onTradingPlaceCheckboxChanged}
          />
        ),
      );
    }
    return null;
  }

  build3DMap() {
    const { dispatch, data } = this.props;

    if (!data || Object.keys(data).length === 0) {
      return;
    }

    if (!this.d3Module || !this.d3Module.d3) {
      this.setState(produce((draft) => {
        draft.failedToRenderTurboMap = true;
      }));
      Logger.error('D3 Module not available, not building the 3DMap.');
      return;
    }

    create3dMap(this.d3Module.d3, data, dispatch);
  }

  render() {
    const { data, isLoading } = this.props;
    const { failedToRenderTurboMap } = this.state;
    const tradingPlaces = getTradingPlaces(data);
    const underlyingsList = getUnderlyings(data);
    return (
      <div className="KnockoutMap">
        <Row>
          <Col className="col-12 col-lg-5">
            <h1>{i18n.t('turbo_map')}</h1>
          </Col>
          {underlyingsList && !isEmptyData(underlyingsList) && (
            <Col className="col-sm-12 col-md-5 col-lg-3">
              <SearchableDropdownList
                list={underlyingsList}
                selectedDropdownItem={getUnderlying(data)[0]}
                textInputPlaceHolder={i18n.t('type_underlying_name')}
                onItemSelect={this.onUnderlyingSelected}
              />
            </Col>
          )}
          {tradingPlaces && (
            <Col className="trading-place col-sm-12 col-md-7 col-lg-4">
              <h4>{i18n.t('trading_place')}</h4>
              <div className="checkboxes-container">
                {this.getTradingPlacesCheckboxes(tradingPlaces)}
              </div>
            </Col>
          )}
        </Row>
        {failedToRenderTurboMap !== true && !isLoading && (
          <>
            <Row>
              <Col>

                <div className="turbo-map-wrapper">
                  <div className="label label-long">
                    Long
                  </div>

                  <div className="label label-short">
                    Short
                  </div>
                  <div id={TURBO_MAP_ELEMENT_ID} />
                  <div className="hint-text">
                    <HtmlText data={{ text: i18n.t('turbo_map_hint') }} />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
        {failedToRenderTurboMap && (
          <Alert color="danger">Failed to render the Knockout map</Alert>
        )}
        {isLoading && (
        <div className="is-loading" />
        )}

      </div>
    );
  }
}

KnockoutMapComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  isLoading: PropTypes.bool,
  dispatch: PropTypes.func,
};

KnockoutMapComponent.defaultProps = {
  data: {},
  isLoading: false,
  dispatch: () => {},
};

const mapStateToProps = (state) => ({
  data: state && state.knockoutMap && state.knockoutMap.data,
  isLoading: state && state.knockoutMap && state.knockoutMap.isLoading,
});

const KnockoutMap = connect(mapStateToProps)(KnockoutMapComponent);
export default KnockoutMap;
