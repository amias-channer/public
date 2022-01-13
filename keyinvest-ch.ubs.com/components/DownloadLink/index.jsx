import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { dispatchAnalyticsDocDownloadTrack } from '../../analytics/Analytics.helper';
import {
  getFileNameFromUrl,
  getTrackingPointNameByContentType,
} from '../../utils/utils';
import Icon from '../Icon';
import './DownloadLink.scss';
import { adformTrackEventClick } from '../../adformTracking/AdformTracking.helper';
import AdformTrackingVars from '../../adformTracking/AdformTrackingVars';

const DownloadLink = ({
  label, url, className, type, isin, contentType,
  target, rel,
}) => {
  const trackAdformClickEventByContentType = (fileContentType, event) => {
    const trackingPointName = getTrackingPointNameByContentType(fileContentType);
    adformTrackEventClick(
      event,
      trackingPointName,
      new AdformTrackingVars().setIsin(isin),
    );
  };

  const onDownloadClick = (e) => {
    if (!url && e && e.preventDefault) {
      e.preventDefault();
    }
    trackAdformClickEventByContentType(contentType, e);
    dispatchAnalyticsDocDownloadTrack(label, getFileNameFromUrl(url));
  };

  return (
    <a
      href={url}
      className={classNames('DownloadLink', className, type)}
      onClick={onDownloadClick}
      target={target}
      rel={rel}
      download
    >
      <Icon type={type} />
      <span>{label}</span>
    </a>
  );
};

DownloadLink.propTypes = {
  label: PropTypes.string,
  url: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  isin: PropTypes.string,
  contentType: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
};
DownloadLink.defaultProps = {
  label: '',
  url: '',
  className: '',
  type: 'upload',
  isin: '',
  contentType: '',
  target: '_blank',
  rel: 'noopener noreferrer',
};
export default React.memo(DownloadLink);
