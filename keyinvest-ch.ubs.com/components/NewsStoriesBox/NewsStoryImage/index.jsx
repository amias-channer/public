import React from 'react';
import PropTypes from 'prop-types';
import {
  getNewsStoryDownloadLink,
  isNewsStoryDownloadable,
} from '../NewsStoriesBox.helper';

function NewsStoryImage(props) {
  const {
    src, alt, onImageClick, link, newsStory,
  } = props;
  const onImageClicked = () => {
    onImageClick(link, newsStory);
  };

  if (isNewsStoryDownloadable(newsStory)) {
    return (
      <a href={getNewsStoryDownloadLink(newsStory)}>
        <img
          className="NewsStoryImage"
          role="presentation"
          alt={alt}
          src={src}
        />
      </a>
    );
  }

  return (
    <img
      className="NewsStoryImage"
      role="presentation"
      alt={alt}
      src={src}
      onClick={onImageClicked}
      onKeyDown={onImageClicked}
    />
  );
}

NewsStoryImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  onImageClick: PropTypes.func,
  link: PropTypes.string,
  newsStory: PropTypes.objectOf(PropTypes.any),
};

NewsStoryImage.defaultProps = {
  src: '',
  alt: '',
  onImageClick: () => {},
  link: '',
  newsStory: {},
};

export default React.memo(NewsStoryImage);
