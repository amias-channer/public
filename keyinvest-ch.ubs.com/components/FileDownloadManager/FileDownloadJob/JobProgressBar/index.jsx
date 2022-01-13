import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  FILE_DOWNLOAD_COMPLETED,
  FILE_DOWNLOAD_ERROR,
  FILE_DOWNLOAD_RUNNING,
} from '../../FileDownloadManager.helper';
import './JobProgressBar.scss';

const JobProgressBar = ({ className, value, status }) => {
  let widthPercent = value;
  if (!widthPercent || widthPercent < 0) {
    widthPercent = 0;
  }
  if (widthPercent > 100) {
    widthPercent = 100;
  }

  return (
    <div className={classNames('JobProgressBar', className)}>
      <span className={`bar ${status}`} style={{ width: `${widthPercent}%` }} />
    </div>
  );
};

JobProgressBar.propTypes = {
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.oneOf([
    FILE_DOWNLOAD_ERROR, FILE_DOWNLOAD_RUNNING, FILE_DOWNLOAD_COMPLETED,
  ]),
};

JobProgressBar.defaultProps = {
  className: '',
  value: 0,
  status: FILE_DOWNLOAD_RUNNING,
};

export default React.memo(JobProgressBar);
