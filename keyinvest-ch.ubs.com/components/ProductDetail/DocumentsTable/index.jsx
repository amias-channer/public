import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './DocumentsTable.scss';
import DownloadLink from '../../DownloadLink';

const DocumentsTableCmp = ({
  className, fields, isin,
}) => (
  <div className={classNames('DocumentsTable', className)}>
    {fields && fields.data && fields.data.length > 0 && (
      <h2 className="title">{fields.label}</h2>
    )}
    {fields && fields.data && fields.data.length > 0 && fields.data.map((file) => (
      <div className="row field" key={file.link}>
        <div className="col">
          <DownloadLink
            url={file.link}
            label={file.label}
            isin={isin}
            contentType={file.contentType}
          />
        </div>
      </div>
    ))}
  </div>
);
DocumentsTableCmp.propTypes = {
  className: PropTypes.string,
  fields: PropTypes.objectOf(PropTypes.any),
  isin: PropTypes.string,
};
DocumentsTableCmp.defaultProps = {
  className: '',
  fields: {},
  isin: '',
};

const DocumentsTable = React.memo(DocumentsTableCmp);
export default DocumentsTable;
