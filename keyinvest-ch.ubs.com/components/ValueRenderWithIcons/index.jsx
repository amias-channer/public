import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ValueRender from '../ValueRender';
import FieldTooltips from '../ProductDetail/FieldTooltips';
import { isEmptyData } from '../../utils/utils';

const ValueRenderWithIcons = ({ data, extraProps, className }) => (
  <div className={classNames('ValueRenderWithIcons', className)}>
    <ValueRender field={data} extraProps={extraProps} />
    {data.fieldNotifications && !isEmptyData(data.fieldNotifications) && (
      <FieldTooltips list={data.fieldNotifications} />
    )}
  </div>
);

ValueRenderWithIcons.propTypes = {
  data: PropTypes.objectOf(PropTypes.object),
  extraProps: PropTypes.objectOf(PropTypes.object),
  className: PropTypes.string,
};

ValueRenderWithIcons.defaultProps = {
  data: {
    fieldNotifications: [],
  },
  extraProps: {},
  className: '',
};

export default React.memo(ValueRenderWithIcons);
