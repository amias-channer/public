import { pathOr } from 'ramda';
import moment from 'moment';

export const getImage = (data) => pathOr('', ['lightBox', 'img'])(data);
export const getImageLink = (data) => pathOr('', ['lightBox', 'img', 'link'])(data);
export const getImageAlt = (data) => pathOr('', ['lightBox', 'img', 'alt'])(data);
export const getImageSrc = (data) => pathOr('', ['lightBox', 'img', 'src'])(data);
export const getSpan = (data) => pathOr('', ['lightBox', 'span'])(data);
export const getSpanLink = (data) => pathOr('', ['lightBox', 'span', 'link'])(data);
export const getAuthors = (data) => pathOr('', ['authors'])(data);
export const getDateTime = (data) => pathOr('', ['datetime'])(data);
export const getTrackingDate = (inputDate) => {
  if (inputDate && inputDate.length < 10) {
    return moment().format('DD.MM.YYYY');
  }
  return inputDate;
};
export const getAuthorName = (data) => pathOr('', ['author', 'name'])(data);
export const getInvestmentIdeasHeading = (data) => pathOr('', ['translations', 'investmentIdeas'])(data);
export const isStoryContentTypeFile = (data) => data.contentType === 'file';
export const storyHasDownloadLink = (data) => !!data.download;
export const getNewsStoryDownloadLink = (data) => pathOr('', ['download'])(data);
export const isNewsStoryDownloadable = (newsStory) => !!(
  isStoryContentTypeFile(newsStory) && storyHasDownloadLink(newsStory)
);

export const getAuthorImage = (data) => pathOr(null, ['authors', 0, 'picture'], data);
export const getAuthorImageAlt = (data) => pathOr('', ['authors', 0, 'name'], data);
