import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ValueRenderWithIcons from '../../ValueRenderWithIcons';
import HtmlText from '../../HtmlText';
import './KeyValueFields.scss';

const KeyValueFields = ({ fields, className }) => (
  <div className={classNames('KeyValueFields', className)}>
    {fields.map((field) => (
      <div className="row field" key={field.label}>
        <div className="col col-lg-8 label">
          <HtmlText tag="span" data={{ text: field.label ? field.label : '' }} />
        </div>
        <div className="col col-lg-4 col-auto text-right value d-inline-flex">
          <ValueRenderWithIcons data={field} />
        </div>
      </div>
    ))}
  </div>
);

KeyValueFields.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.any),
  className: PropTypes.string,
};

KeyValueFields.defaultProps = {
  fields: [],
  className: '',
};
export default React.memo(KeyValueFields);
