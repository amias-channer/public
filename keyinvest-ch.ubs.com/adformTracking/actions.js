export const ADFORM_TRACKING_POINTS_TRACK_EVENT = 'Adform/ADFORM_TRACKING_POINTS_TRACK_EVENT';
export const ADFORM_RESET_FAILED_TRACKING_ATTEMPTS_COUNTER = 'Adform/ADFORM_RESET_FAILED_TRACKING_ATTEMPTS_COUNTER';

export const adformTrackingPointsTrackEvent = (
  trackingFunctionName,
  adformTrackingId,
  divider,
  params,
  trackingPointPathSegment = '',
  trackingPointPath = '',
) => ({
  type: ADFORM_TRACKING_POINTS_TRACK_EVENT,
  trackingFunctionName,
  adformTrackingId,
  divider,
  params,
  trackingPointPathSegment,
  trackingPointPath,
});
