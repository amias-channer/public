import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EditableText from '../../../../EditableText';

const EditableTextField = (props) => {
  const {
    text, fieldName, onTextChangeAction, dispatch,
    apiUrlToUpdateField, prependText, appendText,
  } = props;
  const [inputText, setInputText] = useState(text);

  const onInputTextChange = (e) => {
    const newValue = e.target.value;
    setInputText(newValue);
  };

  const onEditableTextChangeSubmit = (newText) => {
    dispatch(onTextChangeAction(apiUrlToUpdateField, fieldName, newText));
  };

  const onCancelTextUpdate = () => {
    setInputText(text);
  };

  return (
    <div className="EditableTextField">
      {/* eslint-disable react/jsx-props-no-spreading */}
      <EditableText
        {...props}
        text={inputText}
        onTextChange={onInputTextChange}
        onSubmitTextUpdate={onEditableTextChangeSubmit}
        onCancelTextUpdate={onCancelTextUpdate}
        prependText={prependText}
        appendText={appendText}
      />
      {/* eslint-enable react/jsx-props-no-spreading */}
    </div>
  );
};

EditableTextField.propTypes = {
  text: PropTypes.string,
  fieldName: PropTypes.string,
  apiUrlToUpdateField: PropTypes.string,
  onTextChangeAction: PropTypes.func,
  dispatch: PropTypes.func,
  prependText: PropTypes.string,
  appendText: PropTypes.string,
};

EditableTextField.defaultProps = {
  text: '',
  fieldName: '',
  apiUrlToUpdateField: '',
  onTextChangeAction: () => {},
  dispatch: () => {},
  prependText: '',
  appendText: '',
};

export default connect()(React.memo(EditableTextField));
