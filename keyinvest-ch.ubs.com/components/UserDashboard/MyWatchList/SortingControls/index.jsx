import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import SortingControlItem from './SortingControlItem';
import {
  MY_WATCHLIST_MATURITY_DATE_SORT_KEY,
  MY_WATCHLIST_PRODUCT_TYPE_SORT_KEY,
  MY_WATCHLIST_RETURN_SORT_KEY, MY_WATCHLIST_TOTAL_SORT_KEY,
} from '../MyWatchList.helper';
import './SortingControls.scss';
import i18n from '../../../../utils/i18n';

const SortingControls = ({
  onWatchListSort, currentSortedBy, currentSortDirection, isMobileMode,
}) => (
  <div className="col SortingControls">
    <Row>
      {isMobileMode && (
      <div className="col col-lg-4 col-sorting-mobile-mode">
        Sortieren:
        {'  '}
        <SortingControlItem
          onSortItemClick={onWatchListSort}
          label={i18n.t('total_value')}
          sortByKey={MY_WATCHLIST_TOTAL_SORT_KEY}
          currentSortedBy={currentSortedBy}
          currentSortDirection={currentSortDirection}
        />
      </div>
      )}

      {!isMobileMode && (
      <>
        <div className="col col-auto col-sort-control col-sort-control-first">
          Sortieren nach:
          {'  '}
          <SortingControlItem
            onSortItemClick={onWatchListSort}
            label={i18n.t('product_type')}
            sortByKey={MY_WATCHLIST_PRODUCT_TYPE_SORT_KEY}
            currentSortedBy={currentSortedBy}
            currentSortDirection={currentSortDirection}
          />
        </div>
        <div className="col col-auto col-sort-control">
          <SortingControlItem
            onSortItemClick={onWatchListSort}
            label={i18n.t('watchlist_maturity')}
            sortByKey={MY_WATCHLIST_MATURITY_DATE_SORT_KEY}
            currentSortedBy={currentSortedBy}
            currentSortDirection={currentSortDirection}
          />
        </div>
        <div className="col col-auto col-sort-control">
          <SortingControlItem
            onSortItemClick={onWatchListSort}
            label={i18n.t('total_value')}
            sortByKey={MY_WATCHLIST_TOTAL_SORT_KEY}
            currentSortedBy={currentSortedBy}
            currentSortDirection={currentSortDirection}
          />
        </div>
        <div className="col col-auto col-sort-control col-sort-control-last">
          <SortingControlItem
            onSortItemClick={onWatchListSort}
            label={i18n.t('yield')}
            sortByKey={MY_WATCHLIST_RETURN_SORT_KEY}
            currentSortedBy={currentSortedBy}
            currentSortDirection={currentSortDirection}
          />
        </div>
      </>
      )}
    </Row>
  </div>
);

SortingControls.propTypes = {
  onWatchListSort: PropTypes.func,
  currentSortedBy: PropTypes.string,
  currentSortDirection: PropTypes.string,
  isMobileMode: PropTypes.bool,
};

SortingControls.defaultProps = {
  onWatchListSort: () => {},
  currentSortedBy: '',
  currentSortDirection: '',
  isMobileMode: false,
};

export default React.memo(SortingControls);
