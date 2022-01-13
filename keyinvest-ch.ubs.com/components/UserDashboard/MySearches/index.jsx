import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import EditableSavedSearch from './EditableSavedSearch';
import './MySearches.scss';
import i18n from '../../../utils/i18n';
import { mySearchesFetchData, mySearchesWillUnmount } from './actions';
import Alert from '../../Alert';
import { ALERT_TYPE } from '../../Alert/Alert.helper';
import HtmlText from '../../HtmlText';
import { getProductListLink, getYieldMonitorLink } from '../../../utils/utils';

export class MySearchesCmp extends React.PureComponent {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    dispatch(mySearchesFetchData());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(mySearchesWillUnmount());
  }

  render() {
    const { data, isLoading, failure } = this.props;
    return (
      <div className="MySearches">
        <h2 className="section-title">{i18n.t('my_searches')}</h2>
        <div className="section-content">
          {isLoading && (<div className="is-loading" />)}
          {((!isLoading && !failure && (!data || !Object.keys(data).length)) && (
            <div className="no_items">
              <Alert withoutCloseIcon>
                <HtmlText data={{
                  text: i18n.t('no_items_my_searches', {
                    productListLink: getProductListLink(),
                    yieldMonitorLink: getYieldMonitorLink(),
                  }),
                }}
                />
              </Alert>
            </div>
          ))}
          {!isLoading && failure && (
            <div className="failure">
              <Alert type={ALERT_TYPE.ERROR} dismissable>
                <div className="title">
                  <HtmlText tag="span" data={{ text: failure.message || i18n.t('error_message_technical_problem') }} />
                </div>
              </Alert>
            </div>
          )}
          <Row>
            {data && Object.keys(data).map((sectionName) => (
              <div key={sectionName} className="col-12 col-lg-6 search-section">
                <h2><HtmlText data={{ text: sectionName }} /></h2>
                {data[sectionName] && data[sectionName].map((item) => (
                  <EditableSavedSearch isLoading={isLoading} key={item.id} data={item} />
                ))}
              </div>
            ))}
          </Row>
        </div>
      </div>
    );
  }
}
MySearchesCmp.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  failure: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  isLoading: PropTypes.bool,
};
MySearchesCmp.defaultProps = {
  data: null,
  failure: null,
  isLoading: false,
  dispatch: () => {},
};
const mapStateToProps = (state) => ({
  data: state.mySearches.data,
  isLoading: state.mySearches.isLoading,
  failure: state.mySearches.failure,
});
export default connect(mapStateToProps)(MySearchesCmp);
