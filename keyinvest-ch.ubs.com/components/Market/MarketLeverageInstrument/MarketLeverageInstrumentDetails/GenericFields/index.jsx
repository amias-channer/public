import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getFieldLabel } from '../../MarketLeverageInstrument.helper';
import ValueRender from '../../../../ValueRender';
import './GenericFields.scss';

const GenericFields = ({ fields, fieldClassName }) => fields.map((field) => (
  <div key={getFieldLabel(field)} className={classNames('generic-field field', fieldClassName)}>
    <div className="field-key">{getFieldLabel(field)}</div>
    <div className="field-value">
      <ValueRender field={field} />
    </div>
  </div>
));

GenericFields.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  fieldClassName: PropTypes.string,
};
GenericFields.defaultProps = {
  fields: [],
  fieldClassName: '',
};

export default React.memo(GenericFields);
