import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import HtmlText from '../../../HtmlText';
import EditableTextField from './EditableTextField/index';
import { getConcatenationValue } from './KeyValueGroup.helper';

export const KeyValueGroup = ({ group, onEditableFieldChangeAction, urlToUpdateProductField }) => (
  <div className="KeyValueGroup">
    {group.map((groupItem) => {
      const concatenationValue = getConcatenationValue(groupItem);
      return (
        <Row key={groupItem.label}>
          <div className="col key-col">
            {groupItem.label}
          </div>
          <div className="col value-col">
            {!groupItem.isEditable && (
            <>
              <HtmlText tag="span" data={{ text: groupItem.value }} />
              {concatenationValue && (
              <span className="append-text">{concatenationValue}</span>
              )}
            </>
            )}
            {groupItem.isEditable && (
            <EditableTextField
              apiUrlToUpdateField={urlToUpdateProductField}
              fieldName={groupItem.name}
              text={groupItem.value}
              iconType="edit"
              onTextChangeAction={onEditableFieldChangeAction}
              appendText={concatenationValue}
            />
            )}
          </div>
        </Row>
      );
    })}
  </div>
);
KeyValueGroup.propTypes = {
  group: PropTypes.arrayOf(PropTypes.any),
  onEditableFieldChangeAction: PropTypes.func,
  urlToUpdateProductField: PropTypes.string,
};

KeyValueGroup.defaultProps = {
  group: [],
  onEditableFieldChangeAction: () => {},
  urlToUpdateProductField: '',
};

export default React.memo(KeyValueGroup);
