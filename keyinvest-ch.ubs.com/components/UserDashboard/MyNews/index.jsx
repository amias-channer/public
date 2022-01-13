import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { myNewsFetchData, myNewsWillUnmount } from './actions';
import { MY_NEWS_API_GET_ENDPOINT } from './MyNews.helper';
import NewsStoriesBox from '../../NewsStoriesBox';
import i18n from '../../../utils/i18n';
import { isEmptyData } from '../../../utils/utils';

export class MyNewsCmp extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    dispatch(myNewsFetchData(MY_NEWS_API_GET_ENDPOINT));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(myNewsWillUnmount());
  }

  render() {
    const { data, isLoading } = this.props;
    return (
      <div className="MyNews">
        {!isLoading && data && data.newsList && !isEmptyData(data.newsList) && (
          <h2 className="section-title">{i18n.t('Neueste Nachrichten zu meinen Werten')}</h2>
        )}
        <div className="section-content">
          {isLoading && (
          <div className="is-loading" />
          )}
          {!isLoading && data && data.newsList && (
            <NewsStoriesBox data={data.newsList} />
          )}
        </div>
      </div>
    );
  }
}

MyNewsCmp.propTypes = {
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
};

MyNewsCmp.defaultProps = {
  data: {},
  isLoading: false,
  dispatch: () => {},
};

const mapStateToProps = (state) => ({
  data: state.userDashboardPageMyNews && state.userDashboardPageMyNews.data,
  isLoading: state.userDashboardPageMyNews && state.userDashboardPageMyNews.isLoading,
});
export default connect(mapStateToProps)(MyNewsCmp);
