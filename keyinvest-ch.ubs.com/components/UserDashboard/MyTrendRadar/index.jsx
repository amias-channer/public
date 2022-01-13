import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import i18n from '../../../utils/i18n';
import Alert from '../../Alert';
import { ALERT_TYPE } from '../../Alert/Alert.helper';
import HtmlText from '../../HtmlText';
import {
  mySavedItemsListFetchFullData,
} from './MySavedItemsList/actions';
import MySavedItemsList from './MySavedItemsList';
import {
  areAllTrendRadarSubItemsEmpty,
  MY_TRENDRADAR_API_GET_ALL_URL,
} from './MyTrendRadar.helper';

export class MyTrendRadarCmp extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    dispatch(mySavedItemsListFetchFullData({ url: MY_TRENDRADAR_API_GET_ALL_URL }));
  }

  render() {
    const { data, isLoading, failure } = this.props;
    return (
      <div className="MyTrendRadar">
        <h2 className="section-title">{i18n.t('my_trendradar')}</h2>
        <div className="section-content">
          {isLoading && (<div className="is-loading" />)}
          {((
            !isLoading
            && !failure
            && (areAllTrendRadarSubItemsEmpty(data)))
            && (
              <div className="no_items">
                <Alert withoutCloseIcon>{i18n.t('no_items_my_trendradar')}</Alert>
              </div>
            ))}
          {!isLoading && failure && (
            <div className="failure">
              <Alert type={ALERT_TYPE.ERROR} withoutCloseIcon>
                <div className="title">
                  <HtmlText
                    tag="span"
                    data={{ text: failure.message || i18n.t('error_message_technical_problem') }}
                  />
                </div>
              </Alert>
            </div>
          )}
          <div>
            {data && data.items && Object.keys(data.items).map((container) => (
              <MySavedItemsList
                key={container}
                uniqId={container}
                hiddenWhenNoItems
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
MyTrendRadarCmp.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  failure: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
};
MyTrendRadarCmp.defaultProps = {
  data: null,
  failure: null,
  isLoading: false,
  dispatch: () => {},
};
const EMPTY_OBJ = {};
const mapStateToProps = (state) => ({
  data: pathOr(EMPTY_OBJ, ['mySavedItemsList'], state),
  isLoading: pathOr(false, ['mySavedItemsList', 'isLoading'], state),
  failure: pathOr(null, ['mySavedItemsList', 'failure'], state),
});
const MyTrendRadar = connect(mapStateToProps)(MyTrendRadarCmp);
export default MyTrendRadar;
