import React from 'react';
import Proptypes from 'prop-types';
import {
  getImage,
  getImageLink,
  getNewsStoryDownloadLink,
  getSpanLink, isNewsStoryDownloadable,
} from '../NewsStoriesBox.helper';

function NewsStoryLink(props) {
  const { newsStory, fetchStoryDetails } = props;
  const getLink = (data) => {
    if (data) {
      if (getImage(newsStory)) {
        return getImageLink(newsStory);
      }
      return getSpanLink(newsStory);
    }
    return '';
  };
  const getStoryDetails = (e) => {
    e.preventDefault();
    fetchStoryDetails(getLink(newsStory), newsStory);
  };

  if (isNewsStoryDownloadable(newsStory)) {
    return (
      <a
        className="NewsStoryLink"
        href={getNewsStoryDownloadLink(newsStory)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {newsStory.title}
      </a>
    );
  }

  return (
    <a
      className="NewsStoryLink"
      href={getLink(newsStory)}
      onClick={getStoryDetails}
    >
      {newsStory.title}
    </a>
  );
}

NewsStoryLink.propTypes = {
  newsStory: Proptypes.objectOf(Proptypes.any),
  fetchStoryDetails: Proptypes.func,
};

NewsStoryLink.defaultProps = {
  newsStory: {},
  fetchStoryDetails: () => {},
};

export default React.memo(NewsStoryLink);
