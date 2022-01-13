import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  getFieldLabel,
  getLastUpdateField,
  getPriceColumns,
} from '../../MarketLeverageInstrument.helper';
import ValueRender from '../../../../ValueRender';
import './PriceTiles.scss';
import GenericFields from '../GenericFields';

const PriceTiles = ({ data, className }) => {
  const lastUpdateField = getLastUpdateField(data);
  return (
    <div className={classNames('PriceTiles', className)}>
      <div className="row">
        <GenericFields fields={getPriceColumns(data)} fieldClassName="price-field col-6" />
      </div>
      <div className="row">
        <div className="col last-update-field">
          <span className="field-key">{getFieldLabel(lastUpdateField)}</span>
          <ValueRender field={lastUpdateField} />
        </div>
      </div>
    </div>
  );
};

PriceTiles.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};
PriceTiles.defaultProps = {
  data: {},
  className: '',
};

export default React.memo(PriceTiles);
