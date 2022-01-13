import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import {
  addDocumentClickEventListeners,
  removeDocumentClickEventListeners,
  KEYBOARD_KEY_ENTER, KEYBOARD_KEY_ESCAPE,
} from '../../utils/utils';
import './EditableText.scss';

const EditableText = ({
  text, onSubmitTextUpdate, onCancelTextUpdate, onTextChange, iconType, prependText, appendText,
}) => {
  const [isEditMode, setEditMode] = useState(false);
  const editableTextRef = useRef(null);
  const inputTextRef = useRef(null);

  const isClickedOutsideEditableText = (event) => !editableTextRef.current
    || !editableTextRef.current.contains(event.target);
  const isEnterKeyPressed = (event) => event && event.key === KEYBOARD_KEY_ENTER;
  const isEscapeKeyPressed = (event) => event && event.key === KEYBOARD_KEY_ESCAPE;

  const handleClickOutside = (event) => {
    if (editableTextRef && isClickedOutsideEditableText(event) && inputTextRef.current) {
      const currentInputText = inputTextRef.current.value;
      setEditMode(false);
      removeDocumentClickEventListeners(handleClickOutside);
      if (currentInputText === text) {
        return;
      }
      onSubmitTextUpdate(currentInputText);
    }
  };

  const onKeyDown = (event) => {
    if (isEnterKeyPressed(event)) {
      removeDocumentClickEventListeners(handleClickOutside);
      setEditMode(false);
      onSubmitTextUpdate(text);
    }

    if (isEscapeKeyPressed(event)) {
      removeDocumentClickEventListeners(handleClickOutside);
      setEditMode(false);
      onCancelTextUpdate();
    }
  };

  const onEditableTextClick = () => {
    setEditMode(true);
    addDocumentClickEventListeners(handleClickOutside);
  };

  // useEffect to focus the text input only after
  // the isEditMode state is set to TRUE and inputTextRef is set
  useEffect(() => {
    if (isEditMode && inputTextRef && inputTextRef.current) {
      inputTextRef.current.focus();
    }
  }, [isEditMode]);

  const onInputTextChange = (e) => {
    onTextChange(e);
  };

  return (
    <span ref={editableTextRef} className="EditableText">
      {prependText && <span className="prepend-text">{prependText}</span>}
      {isEditMode && (<input ref={inputTextRef} type="text" value={text} onChange={onInputTextChange} onKeyDown={onKeyDown} />)}
      {!isEditMode && <span role="presentation" onClick={onEditableTextClick}>{ text }</span>}
      {appendText && <span className="append-text">{appendText}</span>}
      {iconType && (<Icon type={iconType} onClick={onEditableTextClick} />)}
    </span>
  );
};

EditableText.propTypes = {
  text: PropTypes.string,
  onSubmitTextUpdate: PropTypes.func,
  onTextChange: PropTypes.func,
  onCancelTextUpdate: PropTypes.func,
  iconType: PropTypes.string,
  prependText: PropTypes.string,
  appendText: PropTypes.string,
};

EditableText.defaultProps = {
  text: '',
  onSubmitTextUpdate: () => {},
  onTextChange: () => {},
  onCancelTextUpdate: () => {},
  iconType: '',
  prependText: '',
  appendText: '',
};

export default React.memo(EditableText);
