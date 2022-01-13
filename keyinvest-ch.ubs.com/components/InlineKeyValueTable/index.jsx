import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './InlineKeyValueTable.scss';
import { pathOr, includes } from 'ramda';
import HtmlText from '../HtmlText';
import ValueRender from '../ValueRender';

const getFieldLabel = pathOr('', ['label']);

const shouldDisplaySeparator = (
  responsiveMode,
  hideSeparatorInModes,
) => !(responsiveMode && includes(responsiveMode, hideSeparatorInModes));

const InlineKeyValueTable = ({
  className, fields, fieldsSeparator, itemsClassName, responsiveMode, hideSeparatorInModes,
}) => (
  <div className={classNames('InlineKeyValueTable', className)}>
    {fields.map((field) => (
      <Fragment key={getFieldLabel(field)}>
        <div className={classNames('key-value-field', itemsClassName)}>
          <HtmlText tag="span" className="label" data={{ text: getFieldLabel(field) }} />
          <ValueRender className="ml-1 value" field={field} />
        </div>
        {fieldsSeparator && shouldDisplaySeparator(responsiveMode, hideSeparatorInModes) && (
          <span className="separator">{fieldsSeparator}</span>
        )}
      </Fragment>
    ))}
  </div>
);
InlineKeyValueTable.propTypes = {
  className: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.any),
  fieldsSeparator: PropTypes.string,
  itemsClassName: PropTypes.string,
  responsiveMode: PropTypes.string,
  hideSeparatorInModes: PropTypes.arrayOf(PropTypes.any),
};
InlineKeyValueTable.defaultProps = {
  className: '',
  fields: [],
  fieldsSeparator: null,
  itemsClassName: 'd-block d-md-inline-block',
  responsiveMode: '',
  hideSeparatorInModes: [],
};

export default React.memo(InlineKeyValueTable);
