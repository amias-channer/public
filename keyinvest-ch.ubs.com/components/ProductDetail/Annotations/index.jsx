import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './Annotations.scss';

const AnnotationsCmp = ({
  className, annotations,
}) => (
  <div className={classNames('Annotations', className)}>
    {annotations
    && !Array.isArray(annotations)
    && Object.keys(annotations).length
    && Object.keys(annotations).map((annotationKey) => (
      <span key={annotationKey} className={classNames('annotation', `annotation-${annotationKey}`)}>
        <sup>{`${annotationKey})`}</sup>
        <span>{annotations[annotationKey]}</span>
      </span>
    ))}
  </div>
);
AnnotationsCmp.propTypes = {
  className: PropTypes.string,
  annotations: PropTypes.oneOfType(
    [PropTypes.arrayOf(PropTypes.any), PropTypes.objectOf(PropTypes.any)],
  ).isRequired,
};
AnnotationsCmp.defaultProps = {
  className: '',
};

const Annotations = React.memo(AnnotationsCmp);
export default Annotations;
