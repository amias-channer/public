import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import {
  getNewsStoryDownloadLink,
  isNewsStoryDownloadable,
} from '../NewsStoriesBox.helper';

function NewsStoryIcon(props) {
  const {
    onIconClickFunc, link, icon, newsStory,
  } = props;
  const onClick = () => {
    onIconClickFunc(link, newsStory);
  };

  if (isNewsStoryDownloadable(newsStory)) {
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    return (<a className="NewsStoryIcon" href={getNewsStoryDownloadLink(newsStory)}><i className={`icon-${icon}`} /></a>);
  }

  return (
    <Button color="outline" className="NewsStoryIcon" onClick={onClick}><i className={`icon-${icon}`} /></Button>
  );
}

NewsStoryIcon.propTypes = {
  onIconClickFunc: PropTypes.func,
  link: PropTypes.string,
  icon: PropTypes.string,
  newsStory: PropTypes.objectOf(PropTypes.any),
};

NewsStoryIcon.defaultProps = {
  onIconClickFunc: () => {},
  link: '',
  icon: 'news',
  newsStory: {},
};

export default NewsStoryIcon;
