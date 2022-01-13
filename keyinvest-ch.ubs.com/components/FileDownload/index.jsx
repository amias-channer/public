import React from 'react';
import PropTypes from 'prop-types';
import { getHref, getTitle } from './FileDownload.helper';

function FileDownload(props) {
  const { data } = props;
  return (
    <div className="FileDownload">
      <a
        href={getHref(data)}
        target="_blank"
        rel="noreferrer noopener"
        download
      >
        {getTitle(data)}
      </a>
    </div>
  );
}

FileDownload.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
};

FileDownload.defaultProps = {
  data: {},
};

export default React.memo(FileDownload);
