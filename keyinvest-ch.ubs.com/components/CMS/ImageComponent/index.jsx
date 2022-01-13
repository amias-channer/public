import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import Image from '../../Image';

const getImageAltText = (data) => pathOr('', ['imageData', 'alt'])(data);
const getImageSource = (data) => pathOr('', ['imageData', 'href'])(data);
const getImageCssClassName = (data) => pathOr('', ['imageData', 'cssClass'])(data);
const getImageHeight = (data) => pathOr('', ['imageData', 'height'])(data);
const getImageWidth = (data) => pathOr('', ['imageData', 'width'])(data);

function ImageComponent(props) {
  const { data, className } = props;
  return (
    <Image
      altText={getImageAltText(data)}
      source={getImageSource(data)}
      className={classNames('ImageComponent', className)}
      imageClassName={getImageCssClassName(data)}
      height={getImageHeight(data)}
      width={getImageWidth(data)}
    />
  );
}

ImageComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};

ImageComponent.defaultProps = {
  data: {},
  className: '',
};

export default React.memo(ImageComponent);
