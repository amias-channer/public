/* eslint import/prefer-default-export: "off" */
/* eslint react/jsx-props-no-spreading: "off" */
import React from 'react';
import PropTypes from 'prop-types';

export const Handle = ({
  handle: { id, percent },
  getHandleProps,
}) => (
  <div
    className="ct-scrollbar-handle"
    style={{
      left: `${percent}%`,
    }}
    {...getHandleProps(id)}
  />
);

Handle.propTypes = {
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
};

Handle.defaultProps = {};

export function Track({
  source, target, getTrackProps,
}) {
  return (
    <div
      className="ct-scrollbar-track"
      style={{
        position: 'absolute',
        zIndex: 1,
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  );
}

Track.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  target: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getTrackProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Track.defaultProps = {
  disabled: false,
};
