import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import Logger from '../../../../utils/logger';
import PercentageBar from '../../../PercentageBar';
import {
  SIN_COLUMN,
  DISTANCE2BARRIER_COLUMN,
  DISTANCE2BARRIER_RAW_COLUMN,
  DISTANCE2STRIKE_COLUMN,
  DISTANCE2STRIKE_RAW_COLUMN,
} from '../../../../pages/ProductDetailPage/ProductDetailPage.helper';
import ValueRender from '../../../ValueRender';
import ColoredShape from '../../../ColoredShape';

const UnderlyingChartTableValueCmp = ({
  rowData, columnKey, className,
}) => {
  let value = null;
  try {
    if (columnKey === SIN_COLUMN) {
      const color = pathOr('', ['color', 'value'])(rowData);
      value = (
        <ColoredShape
          color={color}
          width="24px"
          height="24px"
        />
      );
    } else if (columnKey === DISTANCE2BARRIER_COLUMN) {
      value = (
        <PercentageBar
          rawValue={pathOr(null, [DISTANCE2BARRIER_RAW_COLUMN, 'value'])(rowData)}
          value={pathOr(null, [DISTANCE2BARRIER_COLUMN, 'value'])(rowData)}
        />
      );
    } else if (columnKey === DISTANCE2STRIKE_COLUMN) {
      value = (
        <PercentageBar
          rawValue={pathOr(null, [DISTANCE2STRIKE_RAW_COLUMN, 'value'])(rowData)}
          value={pathOr(null, [DISTANCE2STRIKE_COLUMN, 'value'])(rowData)}
        />
      );
    } else {
      value = <ValueRender field={rowData[columnKey]} extraProps={{ displayCurrency: true }} />;
    }
  } catch (e) {
    Logger.error('UnderlyingChartTableValue', rowData, columnKey);
  }

  return (
    <div className={classNames('UnderlyingChartTableValue', className)}>
      {value}
    </div>
  );
};

UnderlyingChartTableValueCmp.propTypes = {
  rowData: PropTypes.objectOf(PropTypes.any),
  columnKey: PropTypes.string,
  className: PropTypes.string,
};
UnderlyingChartTableValueCmp.defaultProps = {
  rowData: {},
  columnKey: '',
  className: '',
};

const UnderlyingChartTableValue = React.memo(UnderlyingChartTableValueCmp);
export default UnderlyingChartTableValue;
