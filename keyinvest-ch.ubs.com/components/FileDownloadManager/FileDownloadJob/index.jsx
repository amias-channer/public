import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import { pathOr } from 'ramda';
import { fileDownloadManagerCancelJob } from '../actions';
import JobProgressBar from './JobProgressBar';
import './FileDownloadJob.scss';
import {
  FILE_DOWNLOAD_COMPLETED,
  getMappedJobStatus,
} from '../FileDownloadManager.helper';
import Icon from '../../Icon';
import { searchAndReplaceTextInString } from '../../../utils/utils';

const FileDownloadJob = ({ className, job, dispatch }) => {
  const jobData = pathOr({}, ['jobData'])(job);

  const cancelJob = () => {
    dispatch(fileDownloadManagerCancelJob({
      jobId: jobData.id,
      ...job,
    }));
  };

  const jobStatus = getMappedJobStatus(jobData.status);

  return (
    <div className={classNames('FileDownloadJob container', className)}>
      <div className="row">
        <div className="col-11">

          <div className="row">
            <div className="col-auto">
              <Icon className="file-icon" type={job.fileType} />
            </div>
            <div className="col-auto">
              {jobStatus !== FILE_DOWNLOAD_COMPLETED && (
                <span className="message">{searchAndReplaceTextInString('%s', String(jobData.value || '0'), jobData.message)}</span>
              )}
              {jobStatus === FILE_DOWNLOAD_COMPLETED && (
                <a
                  className="message"
                  href={jobData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  {jobData.message}
                </a>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col">
              <JobProgressBar
                value={jobData.value}
                status={jobStatus}
              />
            </div>
          </div>

        </div>
        <div className="col-1">
          <Button className="close-button" color="outline" onClick={cancelJob}>
            <Icon type="close-bold" />
          </Button>
        </div>
      </div>
    </div>
  );
};

FileDownloadJob.propTypes = {
  className: PropTypes.string,
  job: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
};

FileDownloadJob.defaultProps = {
  className: '',
  job: {
    jobData: {},
  },
  dispatch: () => {},
};

export default React.memo(FileDownloadJob);
