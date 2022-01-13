import React from 'react';
import PropTypes from 'prop-types';
import './NoteText.scss';

function NoteText(props) {
  const { superScriptText, text } = props;
  return (
    <div className="NoteText">
      {superScriptText && (
      <sup>{`${superScriptText}) `}</sup>
      )}
      {text}
    </div>
  );
}

NoteText.propTypes = {
  text: PropTypes.string,
  superScriptText: PropTypes.string,
};

NoteText.defaultProps = {
  text: '',
  superScriptText: '',
};

export default React.memo(NoteText);
