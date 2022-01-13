import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import AbstractPage from '../AbstractPage';
import { dispatchAnalyticsPageLoadTrack } from '../../analytics/Analytics.helper';
import ErrorPageContent from '../../components/ErrorPageContent';
import { globalErrorClear } from '../../main/actions';

export class ErrorPageComp extends AbstractPage {
  trackPageChange() {
    const { location, errorCode } = this.props;
    const pathname = pathOr('', ['pathname'])(location);
    const search = pathOr('', ['search'])(location);
    dispatchAnalyticsPageLoadTrack(
      pathname + search,
      pathname,
      '',
      '',
      errorCode,
    );
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(globalErrorClear());
  }

  render() {
    const { errorCode } = this.props;
    return (
      <div className="ErrorPage">
        <ErrorPageContent errorCode={errorCode} />
      </div>
    );
  }
}

ErrorPageComp.propTypes = {
  errorCode: PropTypes.number,
  dispatch: PropTypes.func,
};

ErrorPageComp.defaultProps = {
  errorCode: 404,
  dispatch: () => {},
};

const mapStateToProps = (state) => ({
  errorCode: state.global.errorCode || 404,
  message: state.global.message,
  responsiveMode: state.global.responsiveMode,
});
export default connect(mapStateToProps)(ErrorPageComp);
