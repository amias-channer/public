import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './ExpandableProductTile.scss';
import HtmlText from '../../HtmlText';

const ExpandableProductTile = ({
  title, fields, fieldsTranslations, fieldsContentConfig, children,
}) => {
  const [isTileExpanded, setTileExpanded] = useState(false);
  const toggleTileExpand = () => (isTileExpanded ? setTileExpanded(false) : setTileExpanded(true));
  const getFields = (fieldsData) => Object.keys(fieldsData).map((field) => {
    if (fieldsContentConfig[field]) {
      return fieldsContentConfig[field];
    }
    return (
      <div className="field row" key={field}>
        <div className="field-name col-auto">{fieldsTranslations[field]}</div>
        <div className="field-value col-auto ml-auto">
          <HtmlText data={{ text: fieldsData[field].value }} />
        </div>
      </div>
    );
  });
  return (
    <div className="ExpandableProductTile">
      <div className="title">
        <HtmlText data={{ text: title }} />
      </div>
      <div className="fields">
        {getFields(fields)}
      </div>
      <div>
        <button
          type="button"
          onClick={toggleTileExpand}
          className={classNames('btn btn-outline clickable', (isTileExpanded ? 'expanded' : ''))}
        >
          <i className={classNames(isTileExpanded ? 'icon-arrow_02_up' : 'icon-arrow_02_down')} />
        </button>
        {isTileExpanded && (
          <div>{children}</div>
        )}
      </div>
    </div>
  );
};
ExpandableProductTile.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.objectOf(PropTypes.any),
  fieldsTranslations: PropTypes.objectOf(PropTypes.any),
  fieldsContentConfig: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node,
};

ExpandableProductTile.defaultProps = {
  title: '',
  fields: {},
  fieldsTranslations: {},
  fieldsContentConfig: {},
  children: '',
};

export default React.memo(ExpandableProductTile);
