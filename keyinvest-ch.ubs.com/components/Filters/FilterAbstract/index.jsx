import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { has } from 'ramda';
import classNames from 'classnames';
import Logger from '../../../utils/logger';
import { generateUniqId, isEmptyData } from '../../../utils/utils';
import { BUTTON_SIZE } from '../../Button';

export class FilterAbstractComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.filterRef = React.createRef();
    this.state = {
      isActive: false,
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    const {
      uniqId, level, filterKey, type, data,
    } = props;
    Logger.debug('FILTER_ABSTRACT', 'constructor', uniqId, level, filterKey, type, data);
    this.onChange = this.onChange.bind(this);
  }

  // eslint-disable-next-line react/sort-comp
  onChange(event) {
    const {
      uniqId, level, filterKey, type, data,
    } = this.props;
    Logger.debug('FILTER_ABSTRACT', 'onChange', uniqId, level, filterKey, type, data, event);
  }

  handleClickOutside(event) {
    if (this.filterRef
            && this.filterRef.current
            && !this.filterRef.current.contains(event.target)) {
      this.setState({
        isActive: false,
      });
    }
  }

  registerEventListener() {
    this.unregisterEventListener();
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleClickOutside);
  }

  unregisterEventListener() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  }

  shouldDisplayFilterOutline() {
    const { data } = this.props;
    const FILTER_DATA_ACTIVE_KEY = 'active';
    const hasActive = has(FILTER_DATA_ACTIVE_KEY);
    return data && hasActive(data) && !isEmptyData(Object.keys(data[FILTER_DATA_ACTIVE_KEY]));
  }

  render() {
    const {
      className, uniqId, level, filterKey, type,
    } = this.props;

    const { isActive } = this.state;

    return (
      <div className={classNames('Filter', 'col', filterKey, className)}>
        This is an abstract filter
        {' '}
        {uniqId}
        {' '}
        {level}
        {' '}
        {filterKey}
        {' '}
        {type}
        {' '}
        Current active state:
        {' '}
        {isActive}
      </div>
    );
  }
}

FilterAbstractComponent.propTypes = {
  level: PropTypes.string.isRequired,
  uniqId: PropTypes.string,
  filterKey: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  buttonsSize: PropTypes.string,
};
FilterAbstractComponent.defaultProps = {
  uniqId: generateUniqId(),
  className: '',
  buttonsSize: BUTTON_SIZE.MEDIUM,
};

const FilterAbstract = connect()(FilterAbstractComponent);
export default FilterAbstract;
