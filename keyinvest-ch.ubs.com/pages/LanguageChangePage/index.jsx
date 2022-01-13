import { parse } from 'query-string';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { omit } from 'ramda';
import Logger from '../../utils/logger';
import AbstractPage from '../AbstractPage';
import {
  getPathByStateName,
  getProductLink, getTrendRadarSignalDetailLink,
  stringifyParams,
} from '../../utils/utils';
import {
  STATE_NAME_PRODUCT_DETAIL,
  STATE_NAME_TREND_RADAR_DETAILS_PAGE,
  TREND_RADAR_DETAILS_ID_PARAM,
} from '../../main/constants';

export class LanguageChangePageComp extends AbstractPage {
  constructor(props) {
    super(props);
    const { dispatch, location } = props;
    if (location) {
      const url = this.generateTargetUrl();
      dispatch(push(url));
    }
  }

  generateTargetUrl() {
    const { location } = this.props;
    if (location) {
      try {
        const parsedSearchParams = parse(location.search, { arrayFormat: 'bracket' });
        const { stateName } = parsedSearchParams;
        if (stateName) {
          const path = getPathByStateName(stateName);

          if (stateName === STATE_NAME_PRODUCT_DETAIL
            && parsedSearchParams.identifierType
            && parsedSearchParams.identifierValue
          ) {
            return getProductLink(
              parsedSearchParams.identifierType,
              parsedSearchParams.identifierValue,
            );
          }
          if (stateName === STATE_NAME_TREND_RADAR_DETAILS_PAGE
            && parsedSearchParams[TREND_RADAR_DETAILS_ID_PARAM]
          ) {
            return getTrendRadarSignalDetailLink(
              parsedSearchParams[TREND_RADAR_DETAILS_ID_PARAM],
            );
          }

          if (path && path.url) {
            return `${path.url}?${stringifyParams(omit(['stateName'], parsedSearchParams))}`;
          }
        }
      } catch (e) {
        Logger.error('LANGUAGE_CHANGE_PAGE', 'Unable to find stateName in query string', e);
      }
    }
    return '/';
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});

export default connect(mapStateToProps)(LanguageChangePageComp);
