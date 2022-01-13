import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './KeyValueTable.scss';
import ValueRender from '../ValueRender';
import HtmlText from '../HtmlText';
import FieldTooltips from '../ProductDetail/FieldTooltips';

const isFieldsDataAvailable = (fields) => !!(fields
  && fields.data
  && Object.keys(fields.data).length > 0);

const KeyValueTableCmp = ({
  className, fields,
}) => {
  const fieldsDataExists = isFieldsDataAvailable(fields);
  return (
    <div className={classNames('KeyValueTable', className)}>
      {fieldsDataExists && (
        <h2 className="title">{fields.label}</h2>
      )}
      {fieldsDataExists
      && Object.keys(fields.data).map((fieldKey) => (
        <div className="row field" key={fieldKey}>
          <div className="col-8 label">
            <HtmlText tag="span" data={{ text: fields.data[fieldKey] && fields.data[fieldKey].label ? fields.data[fieldKey].label : '' }} />
            <FieldTooltips list={fields.data[fieldKey].fieldNotifications} />
          </div>
          <div className="col-4 text-right value">
            <ValueRender field={fields.data[fieldKey]} extraProps={{ displayCurrency: true }} />
          </div>
        </div>
      ))}
    </div>
  );
};
KeyValueTableCmp.propTypes = {
  className: PropTypes.string,
  fields: PropTypes.objectOf(PropTypes.any),
};
KeyValueTableCmp.defaultProps = {
  className: '',
  fields: {
    label: null,
    data: {},
  },
};

const KeyValueTable = React.memo(KeyValueTableCmp);
export default KeyValueTable;
