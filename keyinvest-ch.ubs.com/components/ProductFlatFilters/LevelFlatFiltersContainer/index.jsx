import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './LevelFlatFiltersContainer.scss';
import { getProductFilterComponentByKey } from '../../Filters/productFiltersConfig';
import { FILTER_LEVEL_SECOND } from '../../DefaultListFilterable/ProductFilters/ProductFilters.helper';
import { BUTTON_SIZE } from '../../Button';

export class LevelFiltersContainerComponent extends React.PureComponent {
  getFilterComponentsFromData() {
    const {
      data, onUpdateFunc, level, uniqDefaultListId, dataSource,
    } = this.props;
    let filterClassNames = 'col-12 col-md-6 col-lg-auto';
    if (level === FILTER_LEVEL_SECOND) {
      filterClassNames = 'col-12 col-md-6 col-lg-2';
    }
    if (data && Object.keys(data).length > 0) {
      return Object.keys(data).map((filterKey) => {
        const FilterComp = getProductFilterComponentByKey(filterKey);
        if (FilterComp) {
          return (
            <FilterComp
              uniqDefaultListId={uniqDefaultListId}
              className={filterClassNames}
              key={filterKey}
              data={data[filterKey]}
              dataSource={dataSource}
              filterKey={filterKey}
              level={level}
              onFilterChange={onUpdateFunc}
              buttonsSize={BUTTON_SIZE.SMALL}
            />
          );
        }
        return (
          <Alert
            key={filterKey}
            color="danger"
            className="Filter col-auto"
          >
            {`The Filter "${filterKey}" is not mapped in productFiltersConfig.js`}
          </Alert>
        );
      });
    }
    return null;
  }

  render() {
    const {
      level,
    } = this.props;
    return (
      <div className={classNames('LevelFlatFiltersContainer', level)}>
        <div className="row filters-wrapper">
          {this.getFilterComponentsFromData()}
        </div>
      </div>
    );
  }
}
LevelFiltersContainerComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onUpdateFunc: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  dataSource: PropTypes.arrayOf(PropTypes.string).isRequired,
  uniqDefaultListId: PropTypes.string.isRequired,
};
LevelFiltersContainerComponent.defaultProps = {
  data: {},
};
const LevelFiltersContainer = connect()(LevelFiltersContainerComponent);
export default LevelFiltersContainer;
