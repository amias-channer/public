import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { splitEvery } from 'ramda';
import { MOBILE_MODE } from '../../../../../utils/responsive';
import GenericFields
  from '../../../../Market/MarketLeverageInstrument/MarketLeverageInstrumentDetails/GenericFields';
import { getSignalGenericFields } from '../TrendRadarSignal.helper';
import './TrendRadarSignalGenericFields.scss';

const TrendRadarSignalGenericFields = ({ data, responsiveMode, className }) => {
  let signalColumnsFieldsData;
  if (responsiveMode === MOBILE_MODE) {
    signalColumnsFieldsData = splitEvery(2, getSignalGenericFields(data));
  } else {
    signalColumnsFieldsData = getSignalGenericFields(data);
  }

  return (
    <div className={classNames('TrendRadarSignalGenericFields', className)}>
      {responsiveMode === MOBILE_MODE && signalColumnsFieldsData.map((chunk, i) => (
        <div className="row bordered" key={(chunk[0] && chunk[0].label) || i}>
          <GenericFields fields={chunk} fieldClassName="col-6" />
        </div>
      ))}
      {responsiveMode !== MOBILE_MODE && (
        <div className="row">
          <GenericFields fields={signalColumnsFieldsData} fieldClassName="col-3" />
        </div>
      )}
    </div>
  );
};

TrendRadarSignalGenericFields.propTypes = {
  responsiveMode: PropTypes.string.isRequired,
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
};
TrendRadarSignalGenericFields.defaultProps = {
  className: '',
  data: {},
};

export default React.memo(TrendRadarSignalGenericFields);
