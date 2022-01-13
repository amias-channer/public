import React from 'react';
import './NewsStoriesBox.scss';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import { Col, Row } from 'reactstrap';
import classNames from 'classnames';
import { produce } from 'immer';
import { pathOr } from 'ramda';
import HttpService, {
  REQUEST_HEADER_KEY_X_REQUESTED_WITH,
  REQUEST_HEADER_VALUE_XML_HTTP_REQUEST,
} from '../../utils/httpService';
import NewsStoryLink from './NewsStoryLink';
import HtmlText from '../HtmlText';
import NewsStoryIcon from './NewsStoryIcon';
import Logger from '../../utils/logger';
import {
  getAuthorImage, getAuthorImageAlt,
  getAuthorName,
  getAuthors,
  getDateTime,
  getImage,
  getImageAlt,
  getImageLink,
  getImageSrc,
  getInvestmentIdeasHeading,
  getSpan,
  getSpanLink,
  getTrackingDate,
} from './NewsStoriesBox.helper';
import NewsStoryIdeasList from './NewsStoryIdeasList';
import NewsStoryImage from './NewsStoryImage';
import { dispatchAnalyticsContentClickTrack } from '../../analytics/Analytics.helper';
import Alert from '../Alert';
import { ALERT_TYPE } from '../Alert/Alert.helper';
import i18n from '../../utils/i18n';

const INITIAL_LIGHT_BOX_DATA = {};

const getNewsStoryAuthor = (authors) => {
  if (Array.isArray(authors) && authors.length) {
    return authors[0].name;
  }
  return null;
};

class NewsStoriesBox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lightBoxActive: false,
      lightBoxData: INITIAL_LIGHT_BOX_DATA,
      isLoading: false,
      failedMessage: null,
    };
    this.fetchStoryDetails = this.fetchStoryDetails.bind(this);
    this.closeNewsDetail = this.closeNewsDetail.bind(this);
    this.trackNewsContentClick = this.trackNewsContentClick.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getLightBoxIconImage(data) {
    const authorImageLink = getAuthorImage(data);
    if (authorImageLink) {
      return (<NewsStoryImage src={authorImageLink} alt={getAuthorImageAlt(data)} />);
    }
    return (<span><i className={data.contentType ? `icon-${data.contentType}` : 'icon-news'} /></span>);
  }

  getLightBox(lBoxData) {
    return (
      <div className={classNames('light-box-wrapper')}>
        <div className="light-box">
          <Row className="header">
            <div className="col-2 col-lg-1 news-story-icon">
              {this.getLightBoxIconImage(lBoxData)}
            </div>
            <div className="col-8 col-lg-10 author-info">
              <div className="author-date">
                {getNewsStoryAuthor(getAuthors(lBoxData))}
                &nbsp;|&nbsp;
                {getDateTime(lBoxData)}
              </div>
            </div>

            <div className="col-2 col-lg-1 close-button-container">
              <button type="button" onClick={this.closeNewsDetail}>
                <i className="icon-close" />
              </button>
            </div>
          </Row>
          <Row className="content">
            <Col>
              <Scrollbars className="scrollable-content">
                <div className="inner-container">
                  <h1>{lBoxData.title}</h1>
                  <HtmlText data={{ text: lBoxData.content }} />
                  {lBoxData.investmentIdeas && lBoxData.investmentIdeas.length > 0 && (
                    <>
                      <h3>{getInvestmentIdeasHeading(lBoxData)}</h3>
                      <NewsStoryIdeasList data={lBoxData.investmentIdeas} />
                    </>
                  )}
                </div>
              </Scrollbars>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  getNewsStoryImage(newsStory) {
    if (getImage(newsStory)) {
      return (
        <NewsStoryImage
          newsStory={newsStory}
          alt={getImageAlt(newsStory)}
          src={getImageSrc(newsStory)}
          onImageClick={this.fetchStoryDetails}
          link={getImageLink(newsStory)}
        />
      );
    }

    return (getSpan(newsStory) && (
      <NewsStoryIcon
        onIconClickFunc={this.fetchStoryDetails}
        newsStory={newsStory}
        link={getSpanLink(newsStory)}
        icon={newsStory.contentType}
      />
    ));
  }

  closeNewsDetail(e) {
    e.preventDefault();
    this.setState(produce((draft) => {
      draft.lightBoxActive = false;
      draft.lightBoxData = INITIAL_LIGHT_BOX_DATA;
    }));
  }

  showLoader(status) {
    this.setState(produce((draft) => {
      draft.isLoading = status;
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  trackNewsContentClick(endPoint, newsStory) {
    try {
      if (newsStory && newsStory.id) {
        const url = HttpService.generateUrl(endPoint);
        dispatchAnalyticsContentClickTrack(
          newsStory.title, // CTAText
          url, // CTAURL
          'News Story Link', // CTAType
          'NewsStoriesBox',
          newsStory.contentType, // ContentType
          newsStory.id, // ContentID
          newsStory.title, // ContentTitle
          url, // ContentURL
          getTrackingDate(newsStory.date), // PublishingDate
          getAuthorName(newsStory), // ContentAuthor
        );
      }
    } catch (e) {
      Logger.warn('NewsStoriesBox::trackNewsContentClick', e);
    }
  }

  fetchStoryDetails(endPoint, newsStory) {
    this.setState(produce((draft) => {
      draft.isLoading = true;
      draft.failedMessage = null;
    }));
    try {
      HttpService.fetch(HttpService.generateUrl(endPoint), {
        headers: {
          [REQUEST_HEADER_KEY_X_REQUESTED_WITH]: REQUEST_HEADER_VALUE_XML_HTTP_REQUEST,
        },
      }).then((response) => {
        this.setState(produce((draft) => {
          draft.lightBoxActive = true;
          draft.lightBoxData = response;
          draft.isLoading = false;
          draft.failedMessage = null;
        }));
      }).catch((e) => {
        Logger.error('NewsStoriesBox component fetchStoryDetails() fetch error: ', e);
        this.setState(produce((draft) => {
          draft.isLoading = false;
          draft.failedMessage = pathOr(i18n.t('error_message_technical_problem'), ['message'], e);
        }));
      });
    } catch (e) {
      Logger.error('NewsStoriesBox component fetchStoryDetails() fetch error: ', e);
      this.setState(produce((draft) => {
        draft.isLoading = false;
        draft.failedMessage = pathOr(i18n.t('error_message_technical_problem'), ['message'], e);
      }));
    }
    this.trackNewsContentClick(endPoint, newsStory);
  }

  render() {
    const { data, className } = this.props;
    const {
      lightBoxActive, lightBoxData, isLoading, failedMessage,
    } = this.state;

    return (
      <>
        {failedMessage && (
          <Alert className="mt-4" type={ALERT_TYPE.ERROR} dismissible>
            { failedMessage }
          </Alert>
        )}
        <div className={classNames('NewsStoriesBox', className)}>
          {isLoading && (
          <div className="is-loading" />
          )}
          <ul>
            {data && Array.isArray(data) && data.length > 0 && data.map((newsStory) => (
              <li key={newsStory.id}>
                <Row>
                  <div className="col-auto news-story-icon">
                    {this.getNewsStoryImage(newsStory)}
                  </div>
                  <div className="col news-story-text">
                    <div className="row">
                      <div className="author-date col-lg-auto">
                        <span className="story-source-name">{getAuthorName(newsStory)}</span>
                        {' '}
                      &nbsp;&nbsp;
                        {' '}
                        <span className="story-publish-date">{newsStory.date}</span>
                      </div>
                      <div className="story-link col-lg-12">
                        <NewsStoryLink
                          newsStory={newsStory}
                          fetchStoryDetails={this.fetchStoryDetails}
                        />
                      </div>
                    </div>
                  </div>
                </Row>
              </li>
            ))}
          </ul>
          {lightBoxActive && Object.keys(lightBoxData).length && this.getLightBox(lightBoxData)}
        </div>
      </>
    );
  }
}

NewsStoriesBox.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.any),
};

NewsStoriesBox.defaultProps = {
  className: '',
  data: [],
};
export default NewsStoriesBox;
