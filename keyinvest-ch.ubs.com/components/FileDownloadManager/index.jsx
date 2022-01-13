import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import FileDownloadJob from './FileDownloadJob';
import './FileDownloadManager.scss';

export const FileDownloadManagerComponent = ({
  className,
  jobsList,
  dispatch,
}) => (
  Object.keys(jobsList).length > 0 && (
  <div className={classNames('FileDownloadManager', className)}>
    {Object.keys(jobsList).map((jobId) => (
      <FileDownloadJob dispatch={dispatch} key={jobId} job={jobsList[jobId]} />
    ))}
  </div>
  )
);

FileDownloadManagerComponent.propTypes = {
  className: PropTypes.string,
  jobsList: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
};

FileDownloadManagerComponent.defaultProps = {
  className: '',
  jobsList: {},
  dispatch: () => {},
};

const mapStateToProps = (state) => ({
  jobsList: state.fileDownloadManager,
});

const FileDownloadManager = connect(mapStateToProps)(React.memo(FileDownloadManagerComponent));
export default FileDownloadManager;
