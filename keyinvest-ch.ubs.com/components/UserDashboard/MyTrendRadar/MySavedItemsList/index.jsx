import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { pathOr, path } from 'ramda';
import {
  mySavedItemsListFetchData, mySavedItemsListRemoveItem,
  mySavedItemsListWillUnmount,
} from './actions';
import EditableSavedSearch from '../../MySearches/EditableSavedSearch';
import DefaultListPaginator from '../../../DefaultListPaginator';
import Alert from '../../../Alert';
import i18n from '../../../../utils/i18n';
import { ALERT_TYPE } from '../../../Alert/Alert.helper';
import HtmlText from '../../../HtmlText';
import './MySavedItemsList.scss';

export const MySavedItemsListCmp = ({
  dispatch, uniqId, data, isLoading, failure, hiddenWhenNoItems,
}) => {
  useEffect(() => () => {
    dispatch(mySavedItemsListWillUnmount(uniqId));
  }, [dispatch, uniqId]);

  const updatePage = (property, value) => {
    dispatch(mySavedItemsListFetchData(
      uniqId,
      {
        url: path(['url'], data),
        queryParams: { [property]: value },
      },
    ));
  };
  const onRemoveItem = (itemData) => {
    const removeUrl = path(['removeUrl'], itemData);
    const listUrl = path(['url'], data);
    if (removeUrl) {
      dispatch(mySavedItemsListRemoveItem(uniqId, { removeUrl, url: listUrl }));
    }
  };

  const label = pathOr('', ['label'], data);
  const hasNoItems = !data || !data.list || !data.list.length;
  if (hiddenWhenNoItems && hasNoItems) {
    return null;
  }
  return (
    <div className={classNames('MySavedItemsList')}>
      <div className="sub-title">
        <span>{label}</span>
      </div>
      {isLoading && (<div className="is-loading" />)}
      {((!isLoading && !failure && hasNoItems) && (
        <div className="no_items">
          <Alert withoutCloseIcon>{i18n.t('no_items')}</Alert>
        </div>
      ))}
      {!isLoading && failure && (
        <div className="failure">
          <Alert type={ALERT_TYPE.ERROR} withoutCloseIcon>
            <div className="title">
              <HtmlText tag="span" data={{ text: failure.message || i18n.t('error_message_technical_problem') }} />
            </div>
          </Alert>
        </div>
      )}
      {data && data.list && data.list.map((item) => (
        <EditableSavedSearch
          isLoading={isLoading}
          type={item.type || data.type}
          key={item.id}
          data={item}
          disableEdit
          onRemoveFunc={onRemoveItem}
          linkButtonText={i18n.t('go_to_signal')}
        />
      ))}
      {data && data.pagesCount > 1 && (
        <DefaultListPaginator
          data={data}
          onUpdateFunc={updatePage}
          hideRowsPerPageSelector
        />
      )}
    </div>
  );
};

MySavedItemsListCmp.propTypes = {
  dispatch: PropTypes.func,
  uniqId: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any),
  failure: PropTypes.objectOf(PropTypes.any),
  isLoading: PropTypes.bool,
  hiddenWhenNoItems: PropTypes.bool,
};

MySavedItemsListCmp.defaultProps = {
  dispatch: () => {},
  data: null,
  isLoading: false,
  failure: null,
  hiddenWhenNoItems: false,
};

const mapStateToProps = (state, props) => {
  const componentState = pathOr({}, ['mySavedItemsList', 'items', props.uniqId], state);
  return {
    data: componentState,
    isLoading: pathOr(false, ['isLoading'], componentState),
    failure: pathOr(null, ['failure'], componentState),
  };
};
const MySavedItemsList = React.memo(connect(mapStateToProps)(MySavedItemsListCmp));
export default MySavedItemsList;
