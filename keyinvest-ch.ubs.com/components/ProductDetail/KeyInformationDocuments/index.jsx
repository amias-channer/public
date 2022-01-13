import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { Col, Row } from 'reactstrap';
import Logger from '../../../utils/logger';
import StandardDropdown from '../../StandardDropdown';
import Button, { BUTTON_COLOR } from '../../Button';
import i18n from '../../../utils/i18n';
import './KeyInformationDocuments.scss';

const getSelectedItem = (e) => path(['target', 'textContent'], e);
const getKIDLinkByLanguage = (data, language) => path(['languages', language], data);
const getLanguageKeys = (data) => (data && data.languages ? Object.keys(data.languages) : []);

const KeyInformationDocuments = ({ data }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const onDropdownItemSelect = (e) => {
    const selectedItem = getSelectedItem(e);
    if (!selectedItem) {
      return;
    }
    setSelectedLanguage(selectedItem);
  };

  const onGenerateKidClick = (e) => {
    e.preventDefault();
    if (!selectedLanguage) {
      return;
    }
    const KIDLink = getKIDLinkByLanguage(data, selectedLanguage);
    if (KIDLink) {
      try {
        window.open(KIDLink, '_blank');
      } catch (error) {
        Logger.error(error);
      }
    }
  };

  return (
    <div className="KeyInformationDocuments">
      <h2 className="title">{data.title}</h2>
      <Row className="field">
        <Col>
          <StandardDropdown
            onItemSelect={onDropdownItemSelect}
            placeHolderText={data.selectLanguage}
            items={getLanguageKeys(data)}
            activeItem={selectedLanguage}
          />
          <Button
            onClick={onGenerateKidClick}
            isDisabled={!selectedLanguage}
            color={BUTTON_COLOR.STANDARD}
          >
            {i18n.t('generate_kid')}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

KeyInformationDocuments.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
};

KeyInformationDocuments.defaultProps = {
  data: {
    title: '',
    selectLanguage: '',
    languages: {},
  },
};
export default React.memo(KeyInformationDocuments);
