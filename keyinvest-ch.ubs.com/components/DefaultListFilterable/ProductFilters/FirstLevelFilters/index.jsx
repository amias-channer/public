import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { batch, connect } from 'react-redux';
import Logger from '../../../../utils/logger';
import ToggleableTab from './ToggleableTab';
import './FirstLevelFilters.scss';
import { DESKTOP_MODE } from '../../../../utils/responsive';
import {
  FILTER_TAB_IN_SUBSCRIPTION,
  FIRST_LEVEL_FILTER_KEY,
  GET_FILTER_TAB_INVESTMENT_PRODUCTS,
  GET_FILTER_TAB_LEVERAGE_PRODUCTS,
  GET_FIRST_LEVEL_FILTER_TAB_MAPPING, isInSubscriptionFilterEnabled,
} from '../ProductFilters.helper';
import { defaultListFilterableFiltersFirstLevelToggleTab } from '../../actions';
import { filterAbstractResetAllListFilters } from '../../../Filters/FilterAbstract/actions';

export class FirstLevelFiltersComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    Logger.debug('FIRST_LEVEL_FILTERS', 'constructor');
    this.toggleTab = this.toggleTab.bind(this);
  }

  getTab(tabKey) {
    const {
      activeTab,
      responsiveMode,
      isLoading,
    } = this.props;
    return (
      <ToggleableTab
        tabKey={tabKey}
        isActive={activeTab === tabKey}
        toggleTabFunc={this.toggleTab}
        responsiveMode={responsiveMode}
        className={isLoading ? 'loading' : ''}
      />
    );
  }

  toggleTab(tabKey) {
    const {
      dispatch, uniqDefaultListId, activeTab, onUpdateFunc,
    } = this.props;
    if (tabKey !== activeTab) {
      Logger.debug('FIRST_LEVEL_FILTERS', 'OPENING the tab', tabKey);
      batch(() => {
        dispatch(filterAbstractResetAllListFilters(uniqDefaultListId));
        dispatch(defaultListFilterableFiltersFirstLevelToggleTab(uniqDefaultListId, tabKey));
      });
      if (
        GET_FIRST_LEVEL_FILTER_TAB_MAPPING()[tabKey]
        !== GET_FIRST_LEVEL_FILTER_TAB_MAPPING()[activeTab]
      ) {
        onUpdateFunc(FIRST_LEVEL_FILTER_KEY, GET_FIRST_LEVEL_FILTER_TAB_MAPPING()[tabKey]);
      }
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div className={classNames('FirstLevelFilters row', className)}>
        {isInSubscriptionFilterEnabled() && (
          this.getTab(FILTER_TAB_IN_SUBSCRIPTION)
        )}
        {this.getTab(GET_FILTER_TAB_LEVERAGE_PRODUCTS())}
        {this.getTab(GET_FILTER_TAB_INVESTMENT_PRODUCTS())}
      </div>
    );
  }
}
FirstLevelFiltersComponent.propTypes = {
  activeTab: PropTypes.string,
  responsiveMode: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  dispatch: PropTypes.func,
  uniqDefaultListId: PropTypes.string.isRequired,
  onUpdateFunc: PropTypes.func.isRequired,
};
FirstLevelFiltersComponent.defaultProps = {
  className: '',
  activeTab: null,
  isLoading: false,
  responsiveMode: DESKTOP_MODE,
  dispatch: () => {},
};
const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});
const FirstLevelFilters = connect(mapStateToProps)(FirstLevelFiltersComponent);
export default FirstLevelFilters;
