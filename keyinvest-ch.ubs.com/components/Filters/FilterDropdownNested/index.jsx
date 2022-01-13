import React from 'react';
import classNames from 'classnames';
import { produce } from 'immer';
import { clone, equals, pathOr } from 'ramda';
import FilterAbstractDropdown from '../FilterAbstract/FilterAbstractDropdown';
import TextInput from '../../TextInput';
import FilterListItems from '../../NestableListItems';
import i18n from '../../../utils/i18n';
import './FilterDropdownNested.scss';
import ButtonsGroup from '../../ButtonsGroup';
import Button, { BUTTON_COLOR } from '../../Button';

const EMPTY_LIST = {};
const LIST_PATH = ['data', 'list'];

class FilterDropdownNested extends FilterAbstractDropdown {
  constructor(props) {
    super(props);
    this.textInputElementRef = React.createRef();
    this.state = {
      list: pathOr(EMPTY_LIST, LIST_PATH, props),
    };
  }

  componentDidUpdate(prevProps) {
    const propList = pathOr(EMPTY_LIST, LIST_PATH, this.props);
    if (!equals(propList, pathOr(EMPTY_LIST, LIST_PATH, prevProps))) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(produce((draft) => {
        draft.list = pathOr(EMPTY_LIST, LIST_PATH, this.props);
      }));
    }
  }

  handleClickOutside(event) {
    if (this.filterRef
        && this.filterRef.current
        && !this.filterRef.current.contains(event.target)) {
      this.applyFilters();
    }
  }

  onChange(event) {
    const { value } = event.currentTarget;
    const { checked } = event.currentTarget;
    const { childof } = event.target.dataset;
    const { list } = this.state;
    const clonedList = clone(list);
    let updatedList = this.searchAndUpdateStateByValue(clonedList, value, checked);
    updatedList = this.updateStateForParentList(updatedList, childof);
    this.setState(produce((draft) => {
      draft.list = updatedList;
    }));
  }

  setSelectedForAllChildren(list, checked) {
    Object.keys(list).forEach(
      (childItem) => {
        list[childItem].selected = checked;

        if (list[childItem] && list[childItem].list && Object.keys(list[childItem]).length > 0) {
          this.setSelectedForAllChildren(list[childItem].list, checked);
        }
      },
    );
    return list;
  }

  updateStateForParentList(list, parent) {
    Object.keys(list).forEach((item) => {
      if (item === parent && list[item].hasChildren) {
        let allChildrenSelected = true;
        Object.keys(list[item].list).forEach((childItem) => {
          if (list[item].list[childItem].selected === false) {
            allChildrenSelected = false;
          }
        });

        list[item].selected = allChildrenSelected;
        return;
      }

      if (list[item] && list[item].list && Object.keys(list[item].list).length > 0) {
        this.updateStateForParentList(list[item].list, parent);
      }
    });

    return list;
  }

  searchAndUpdateStateByValue(list, value, checked) {
    Object.keys(list).forEach((item) => {
      if (list[item] && list[item].value && list[item].value === value) {
        list[item].selected = checked;

        if (list[item].hasChildren) {
          this.setSelectedForAllChildren(list[item].list, checked);
        }
        return;
      }

      if (list[item] && list[item].list && Object.keys(list[item].list).length > 0) {
        this.searchAndUpdateStateByValue(list[item].list, value, checked);
      }
    });
    return list;
  }

  applyFilters() {
    const { list } = this.state;
    const { onFilterChange, filterKey, level } = this.props;
    const selectedOptions = [];
    const selections = this.getAllSelectedOptions(list, selectedOptions);
    onFilterChange(filterKey, selections, level);
    this.closeFilterMenu();
  }

  getAllSelectedOptions(list, selectedOptions) {
    Object.keys(list).forEach((item) => {
      if (list[item] && list[item].selected) {
        if (!list[item].hasChildren) {
          selectedOptions.push(list[item].value);
        }
      }

      if (list[item] && list[item].list && Object.keys(list[item].list).length > 0) {
        this.getAllSelectedOptions(list[item].list, selectedOptions);
      }
    });

    return selectedOptions;
  }

  render() {
    const {
      filterKey,
      data,
      className,
      buttonsSize,
    } = this.props;
    const { isActive, list, searchText } = this.state;
    return (
      <div
        ref={this.filterRef}
        className={classNames('Filter', 'FilterDropdown FilterDropdownNested', filterKey, className, isActive ? 'active' : '')}
      >
        <TextInput
          placeholder={data.label || filterKey}
          id={filterKey}
          name={filterKey}
          title={data.label || filterKey}
          onChange={this.onInputTextChange}
          onClick={this.openFilterMenu}
          value={searchText}
          showIcon
          isActive={isActive}
          textInputElementRef={this.textInputElementRef}
        />
        <div className="menu">
          <FilterListItems list={list} onChange={this.onChange} />
          <div className="row">
            <div className="col">
              <ButtonsGroup className="buttons">
                <Button className="button-apply" color={BUTTON_COLOR.OLIVE} size={buttonsSize} onClick={this.applyFilters}>{i18n.t('Apply')}</Button>
                <Button className="button-cancel" color={BUTTON_COLOR.STANDARD} size={buttonsSize} onClick={this.cancelFilters}>{i18n.t('Cancel')}</Button>
              </ButtonsGroup>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
FilterDropdownNested.defaultProps = {
  className: 'col-md-4 col-12',
};
export default FilterDropdownNested;
