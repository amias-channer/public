import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Image(props) {
  const {
    source, altText, className, imageClassName, height, width,
  } = props;
  return source && (
    <div className={classNames('Image', className)}>
      <img
        src={source}
        alt={altText}
        className={imageClassName}
        height={height}
        width={width}
      />
    </div>
  );
}

Image.propTypes = {
  source: PropTypes.string,
  altText: PropTypes.string,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
};
Image.defaultProps = {
  source: '',
  altText: '',
  className: '',
  imageClassName: '',
  height: null,
  width: null,
};
export default React.memo(Image);
