import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { cmsPageFetchContent, cmsPageWillUnmount } from './actions';
import AbstractPage from '../AbstractPage';
import ErrorPage from '../ErrorPage';
import { generateCmsLayout } from './CmsPage.helper';

export class CmsPageComponent extends AbstractPage {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(cmsPageFetchContent());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(cmsPageWillUnmount());
  }

  render() {
    const { content, isLoading, failed } = this.props;
    const layoutRender = generateCmsLayout(content);
    return (
      <div className="CmsPage">
        {this.getHelmetData()}
        {isLoading && (
          <div className="is-loading" />
        )}
        {!isLoading && content && content.length && layoutRender}

        {failed && (
          <>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ErrorPage {...this.props} />
          </>
        )}
      </div>
    );
  }
}

CmsPageComponent.propTypes = {
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
  failed: PropTypes.bool,
  content: PropTypes.arrayOf(PropTypes.any),
};

CmsPageComponent.defaultProps = {
  dispatch: () => {},
  isLoading: true,
  failed: false,
  content: [],
};

function mapStateToProps(state) {
  return {
    content: state.cms.content,
    isLoading: state.cms.isLoading,
    failed: state.cms.failed,
    responsiveMode: state.global.responsiveMode,
  };
}
const CmsPage = connect(mapStateToProps)(CmsPageComponent);
export default CmsPage;
