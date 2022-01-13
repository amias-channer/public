import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row, Button as ReactstrapButton } from 'reactstrap';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import Icon from '../../../Icon';
import './EditableSavedSearch.scss';
import EditableText from '../../../EditableText';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../../../Button';
import i18n from '../../../../utils/i18n';
import ActiveFilterItem
  from '../../../DefaultListFilterable/ProductFilters/ActiveFilters/ActiveFilterItem';
import { mySearchesRemove, mySearchesUpdateName } from '../actions';
import {
  getSavedItemIconFromType,
  SAVED_SEARCH_TYPES,
} from './EditableSavedSearch.helper';
import { isOfTypeFunction } from '../../../../utils/utils';

export const EditableSavedSearchCmp = ({
  data, dispatch, className, isLoading,
  type, disableEdit,
  onRenameFunc, onRemoveFunc, linkButtonText,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [itemName, setItemName] = useState((data && data.name) || '');
  const onArrowClicked = () => (isExpanded ? setIsExpanded(false) : setIsExpanded(true));
  const onRemoveClicked = () => {
    if (isOfTypeFunction(onRemoveFunc)) {
      onRemoveFunc(data);
      return;
    }
    dispatch(mySearchesRemove(data));
  };
  const onSubmitTextUpdate = (newText) => {
    if (isOfTypeFunction(onRenameFunc)) {
      onRenameFunc(data);
      return;
    }
    dispatch(mySearchesUpdateName(data, newText));
  };
  const onCancelTextUpdate = () => setItemName((data && data.name) || '');
  const getTagsList = pathOr([], ['tags']);
  const tags = getTagsList(data);
  const onNameChange = (e) => {
    if (e && e.target) {
      setItemName(e.target.value);
    }
  };

  return (
    <div className={classNames('EditableSavedSearch', className)}>
      <Row className="editable-saved-search-row">
        <div className="col-auto">
          <Icon className="type" type={getSavedItemIconFromType(type, data.isTriggered)} />
        </div>
        <div className="col editable-text-col">
          {disableEdit ? (<span className="NonEditableText">{itemName}</span>) : (
            <EditableText
              text={itemName}
              onSubmitTextUpdate={onSubmitTextUpdate}
              onCancelTextUpdate={onCancelTextUpdate}
              onTextChange={onNameChange}
            />
          )}
        </div>
        {isExpanded && !isLoading && (
          <div className="col-auto">
            <ReactstrapButton color="outline" onClick={onRemoveClicked}>
              <Icon type="trash" />
            </ReactstrapButton>
          </div>
        )}
        <div role="presentation" className="col-auto ml-auto arrow-icon-col" onClick={onArrowClicked}>
          <Icon type={isExpanded ? 'arrow_02_up' : 'arrow_02_down'} />
        </div>
      </Row>
      {isExpanded && (
        <>
          <Row>
            <div className="col">
              {tags && tags.map((item) => (
                <ActiveFilterItem
                  filterKey={item.label}
                  key={item.label}
                  data={item}
                  clickable={false}
                  color={item.isHighlighted ? BUTTON_COLOR.HIGHLIGHTED : undefined}
                />
              ))}
            </div>
          </Row>
          {data && data.link && (
            <Row>
              <div className="col">
                <Button
                  className="open-search-link pl-2 pr-2 mb-2"
                  RenderAs="a"
                  href={data.link}
                  size={BUTTON_SIZE.SMALL}
                  color={BUTTON_COLOR.ATLANTIC}
                >
                  {linkButtonText || i18n.t('show_search')}
                </Button>
              </div>
            </Row>
          )}
        </>
      )}
    </div>
  );
};
EditableSavedSearchCmp.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  isLoading: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func,
  onRemoveFunc: PropTypes.func,
  onRenameFunc: PropTypes.func,
  disableEdit: PropTypes.bool,
  linkButtonText: PropTypes.string,
};
EditableSavedSearchCmp.defaultProps = {
  className: '',
  type: SAVED_SEARCH_TYPES.FILTER,
  isLoading: false,
  data: null,
  dispatch: () => {},
  disableEdit: false,
  onRenameFunc: null,
  onRemoveFunc: null,
  linkButtonText: null,
};
const EditableSavedSearch = connect()(React.memo(EditableSavedSearchCmp));
export default EditableSavedSearch;
