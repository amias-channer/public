import React from 'react';
import PropTypes from 'prop-types';
import KeyValueGroupComp from './KeyValueGroup';
import './KeyValueGroups.scss';
import { generateUniqId } from '../../../utils/utils';

export const KeyValueGroups = ({
  groups, fetchProductTileData, urlToUpdateProductField, onEditableFieldChangeAction,
}) => (
  <div className="KeyValueGroups">
    {groups.map((group) => (
      <KeyValueGroupComp
        key={generateUniqId()}
        group={group}
        fetchProductTileData={fetchProductTileData}
        urlToUpdateProductField={urlToUpdateProductField}
        onEditableFieldChangeAction={onEditableFieldChangeAction}
      />
    ))}
  </div>
);

KeyValueGroups.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.any),
  urlToUpdateProductField: PropTypes.string,
  fetchProductTileData: PropTypes.func,
  onEditableFieldChangeAction: PropTypes.func,
};

KeyValueGroups.defaultProps = {
  groups: [],
  urlToUpdateProductField: '',
  fetchProductTileData: () => {},
  onEditableFieldChangeAction: () => {},
};

export default React.memo(KeyValueGroups);
