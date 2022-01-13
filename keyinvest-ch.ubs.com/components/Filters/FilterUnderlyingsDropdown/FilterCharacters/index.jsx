import React from 'react';
import PropTypes from 'prop-types';
import i18n from '../../../../utils/i18n';
import { getAlphabets } from '../../../../utils/utils';

function FilterCharacters(props) {
  const { onCharacterClick, selectedCharacter } = props;
  return (
    <div className="FilterCharacters">
      <ul>
        <li
          data-letter="all"
          onClick={onCharacterClick}
          className={selectedCharacter === 'all' ? 'selected' : ''}
          role="presentation"
          key="all"
        >
          {i18n.t('all')}
        </li>
        {getAlphabets().split('').map((letter) => (
          <li
            className={selectedCharacter === letter ? 'selected' : ''}
            onClick={onCharacterClick}
            data-letter={letter}
            role="presentation"
            key={letter}
          >
            {letter.toUpperCase()}
          </li>
        ))}
        <li
          data-letter="numeric"
          onClick={onCharacterClick}
          className={selectedCharacter === 'numeric' ? 'selected' : ''}
          role="presentation"
          key="numeric"
        >
          0-9
        </li>
      </ul>
    </div>
  );
}

FilterCharacters.propTypes = {
  onCharacterClick: PropTypes.func,
  selectedCharacter: PropTypes.string,
};

FilterCharacters.defaultProps = {
  onCharacterClick: () => {},
  selectedCharacter: '',
};

export default React.memo(FilterCharacters);
