import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'reactstrap';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { produce } from 'immer';
import Logger from '../../../../utils/logger';
import './LevelFiltersContainer.scss';
import { getProductFilterComponentByKey } from '../../../Filters/productFiltersConfig';
import {
  getFilterClassNames,
  getFilterKeys,
  getFilterKeysForLastRowToRender,
  getFilterKeysWithoutLastRowFilters,
  getFilterSpecificClassNames,
  getLastRowFilterKeys,
} from '../ProductFilters.helper';
import i18n from '../../../../utils/i18n';

const ICON_CLASS_NAME_PLUS = 'icon-plus';
const ICON_CLASS_NAME_MINUS = 'icon-minus';

export class LevelFiltersContainerComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showFilters: true,
    };
    this.toggleShowFilters = this.toggleShowFilters.bind(this);
    Logger.debug('LEVEL_FILTERS_CONTAINER', 'constructor', props.level);
  }

  getFilterComponents = (filtersData, filterKeys) => {
    const {
      onUpdateFunc, level, activeTab, uniqDefaultListId, innerFilterClassNames,
      dataSource,
    } = this.props;
    let filterClassNames = getFilterClassNames(innerFilterClassNames, level);
    return filterKeys.map((filterKey) => {
      const FilterComp = getProductFilterComponentByKey(filterKey);
      filterClassNames = getFilterSpecificClassNames(filterKey, filterClassNames);
      if (FilterComp) {
        return (
          <FilterComp
            className={filterClassNames}
            uniqDefaultListId={uniqDefaultListId}
            key={filterKey}
            data={filtersData[filterKey]}
            dataSource={dataSource}
            filterKey={filterKey}
            level={level}
            onFilterChange={onUpdateFunc}
            onUpdateFunc={onUpdateFunc}
            activeTab={activeTab}
          />
        );
      }
      return (
        <Alert
          key={filterKey}
          color="danger"
          className="Filter col-md-4"
        >
          {`The Filter "${filterKey}" is not mapped in productFiltersConfig.js`}
        </Alert>
      );
    });
  };

  getFilterComponentsFromData() {
    const {
      data,
    } = this.props;

    const filterKeys = getFilterKeys(data);
    if (filterKeys.length > 0) {
      const filterKeysWithoutLastRowFilters = getFilterKeysWithoutLastRowFilters(
        filterKeys,
        getLastRowFilterKeys(),
      );
      return this.getFilterComponents(data, filterKeysWithoutLastRowFilters);
    }
    return null;
  }

  getFiltersForLastRowFromData() {
    const {
      data,
    } = this.props;

    const filterKeys = getFilterKeys(data);
    const filterKeysForLastRow = getFilterKeysForLastRowToRender(
      filterKeys,
      getLastRowFilterKeys(),
    );
    return this.getFilterComponents(data, filterKeysForLastRow);
  }

  // eslint-disable-next-line class-methods-use-this
  getIconClassName(noFiltersAvailable, showFilters) {
    if (noFiltersAvailable) {
      return ICON_CLASS_NAME_PLUS;
    }

    if (showFilters) {
      return ICON_CLASS_NAME_MINUS;
    }

    return ICON_CLASS_NAME_PLUS;
  }

  toggleShowFilters(e) {
    e.preventDefault();
    const { showFilters } = this.state;
    const setShowFiltersState = (state) => {
      this.setState(produce((draft) => {
        draft.showFilters = state;
      }));
    };
    if (showFilters) {
      setShowFiltersState(false);
    } else {
      setShowFiltersState(true);
    }
  }

  render() {
    const {
      activeTab, level, isToggleable, data, className,
    } = this.props;
    const { showFilters } = this.state;
    const noFiltersAvailable = !data || Object.keys(data).length === 0;
    return !noFiltersAvailable && (
      <div className={classNames('LevelFiltersContainer', className, level, isToggleable ? 'toggleable' : '', showFilters ? 'showFilters' : '')}>
        {isToggleable && (

        <Button className="toggle-button" disabled={noFiltersAvailable} color="outline" onClick={this.toggleShowFilters}>
          <i className={classNames('toggle-icon', this.getIconClassName(noFiltersAvailable, showFilters))} />
          <span>
            {' '}
            {i18n.t('Extend Filter')}
          </span>
        </Button>

        )}
        <div className="row filters-wrapper">
          {activeTab && this.getFilterComponentsFromData()}
          <div className="col-12">
            <div className="row">
              {activeTab && this.getFiltersForLastRowFromData()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
LevelFiltersContainerComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  dataSource: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTab: PropTypes.string,
  onUpdateFunc: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  isToggleable: PropTypes.bool,
  uniqDefaultListId: PropTypes.string.isRequired,
  className: PropTypes.string,
  innerFilterClassNames: PropTypes.string,
};
LevelFiltersContainerComponent.defaultProps = {
  data: {},
  activeTab: null,
  isToggleable: false,
  className: '',
  innerFilterClassNames: '',
};
const LevelFiltersContainer = connect()(LevelFiltersContainerComponent);
export default LevelFiltersContainer;
