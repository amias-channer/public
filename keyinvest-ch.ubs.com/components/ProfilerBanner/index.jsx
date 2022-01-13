import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './ProfilerBanner.scss';
import { Button } from 'reactstrap';
import { globalClearProfilerBanner } from '../../main/actions';
import getAppConfig from '../../main/AppConfig';

const ProfilerBannerComponent = ({ dispatch, profilerData }) => {
  const appConfig = getAppConfig();
  const clearAll = () => {
    window.profilerDisabled = true;
    dispatch(globalClearProfilerBanner());
  };
  if (!window.profilerDisabled && profilerData && profilerData.length > 0) {
    return (
      <div className="ProfilerBanner d-print-none">
        <Button
          className="close"
          color="outline"
          onClick={clearAll}
        >
          <i className="icon-close-bold" />
        </Button>
        <div className="container">
          {profilerData.map((profilerInstance) => (
            <a
              key={profilerInstance.timestamp}
              title={profilerInstance.apiLink}
              className="profiler-link"
              rel="noopener noreferrer"
              target="_blank"
              href={`//${appConfig.hostname}/debug/profiler/key/${profilerInstance.key}`}
            >
              {profilerInstance.apiLink
                ? `${profilerInstance.duration} ms : ${profilerInstance.apiLink
                  .replace(appConfig.hostname, '')
                  .replace(appConfig.hostname, '')
                  .replace(appConfig.pageApiPath, '')
                  .replace('//', '')
                  .substr(0, 40)}`
                : 'Open profiler'}
            </a>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const EMPTY_ARRAY = [];
ProfilerBannerComponent.propTypes = {
  profilerData: PropTypes.arrayOf(PropTypes.any),
  dispatch: PropTypes.func,
};
ProfilerBannerComponent.defaultProps = {
  profilerData: EMPTY_ARRAY,
  dispatch: () => {},
};
const mapStateToProps = (state) => ({
  profilerData: state.global && state.global.profilerData ? state.global.profilerData : EMPTY_ARRAY,
});

const ProfilerBanner = connect(mapStateToProps)(ProfilerBannerComponent);
export default ProfilerBanner;
