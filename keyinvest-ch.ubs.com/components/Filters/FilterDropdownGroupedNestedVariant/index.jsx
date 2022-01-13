import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import TextInput from '../../TextInput';
import i18n from '../../../utils/i18n';
import ButtonsGroup from '../../ButtonsGroup';
import Button, { BUTTON_COLOR } from '../../Button';
import './FilterDropdownGroupedNestedVariant.scss';
import {
  getListData, getLabel, getData,
  FILTER_COLUMNS_LAYOUT_CONFIG,
} from '../FilterDropdownGroupedNested/FilterDropdownGroupedNested.helper';
import {
  FILTER_TYPE_DROPDOWN,
} from '../Filters.helper';
import ArrowKeysListNavigation from '../../ArrowKeysListNavigation';
import { nestedListFilterDataSelector } from '../selectors';
import NestableListItems from '../../NestableListItems';
import { FilterDropdownGroupedNestedCmp } from '../FilterDropdownGroupedNested';

export class FilterDropdownGroupedNestedVariantCmp extends FilterDropdownGroupedNestedCmp {
  render() {
    const {
      filterKey,
      data,
      className,
      buttonsSize,
    } = this.props;
    const { isActive, listItemRefs } = this.state;
    return (
      <div
        ref={this.filterRef}
        className={classNames(
          'Filter', 'FilterDropdown FilterDropdownGroupedNested FilterDropdownGroupedNestedVariant',
          filterKey, className, isActive ? 'active' : '',
        )}
      >
        <ArrowKeysListNavigation listItemRefs={listItemRefs}>
          <TextInput
            displayOutline={this.shouldDisplayFilterOutline()}
            placeholder={getLabel(data) || filterKey}
            id={filterKey}
            name={filterKey}
            title={getLabel(data)}
            onChange={this.onInputTextChange}
            onClick={this.openFilterMenu}
            showIcon
            isActive={isActive}
            textInputElementRef={this.textInputElementRef}
            onKeyDown={this.onTextInputKeyDown}
          />
          {isActive && (
          <div className="menu">
            <NestableListItems
              uniqId={getLabel(data)}
              list={getListData(data)}
              onChange={this.onItemSelect}
              displayStyle="columns"
              setListItemRef={this.setListItemRef}
              breakpointColumnsConfigByNestingLevel={FILTER_COLUMNS_LAYOUT_CONFIG}
            />

            <div className="row">
              <div className="col-4 col-sm-12 col-lg-4 mx-auto">
                <ButtonsGroup className="buttons">
                  <Button className="button-apply" color={BUTTON_COLOR.OLIVE} size={buttonsSize} onClick={this.applyFilters}>{i18n.t('Apply')}</Button>
                  <Button className="button-cancel" color={BUTTON_COLOR.STANDARD} size={buttonsSize} onClick={this.cancelFilters}>{i18n.t('Cancel')}</Button>
                </ButtonsGroup>
              </div>
            </div>
          </div>
          )}
        </ArrowKeysListNavigation>
      </div>

    );
  }
}
FilterDropdownGroupedNestedVariantCmp.defaultProps = {
  className: 'col-md-4 col-12',
  type: FILTER_TYPE_DROPDOWN,
};
const mapStateToProps = (state, ownProps) => ({
  data: nestedListFilterDataSelector(state, ownProps),
  syncedData: getData(state, ownProps),
});
export default connect(mapStateToProps)(FilterDropdownGroupedNestedVariantCmp);
