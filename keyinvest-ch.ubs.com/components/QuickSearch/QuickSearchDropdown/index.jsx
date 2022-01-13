import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathOr } from 'ramda';
import i18n from '../../../utils/i18n';
import PushableTimestamp from '../../PushManager/PushableTimestamp';
import SearchableDropdownList from '../../SearchableDropdownList';
import { searchAndReplaceTextInString } from '../../../utils/utils';

function QuickSearchDropdown(props) {
  const {
    className, field, list, onItemSelect, selectedDropdownItem,
    isLoading,
  } = props;

  return (
    <div className={classNames('QuickSearchDropdown', className)}>
      <h3 className="select-underlying-heading">{i18n.t('Select an underlying')}</h3>
      <SearchableDropdownList
        list={list}
        field={field}
        onItemSelect={onItemSelect}
        selectedDropdownItem={selectedDropdownItem}
        textInputPlaceHolder={i18n.t('type_underlying_name')}
        isLoading={isLoading}
      />
      <div className="small-text">
        <p>
          {searchAndReplaceTextInString('%s', pathOr('', ['currency'], field), i18n.t('last_update') || '')}
          {' '}
          <PushableTimestamp field={field} className="pushable-field" showInitialValue />
        </p>
      </div>
    </div>
  );
}

QuickSearchDropdown.propTypes = {
  className: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.any),
  field: PropTypes.objectOf(PropTypes.any),
  onItemSelect: PropTypes.func,
  selectedDropdownItem: PropTypes.string,
  isLoading: PropTypes.bool,
};

QuickSearchDropdown.defaultProps = {
  className: '',
  list: [],
  field: {},
  onItemSelect: null,
  selectedDropdownItem: 'DAX',
  isLoading: false,
};
export default React.memo(QuickSearchDropdown);
