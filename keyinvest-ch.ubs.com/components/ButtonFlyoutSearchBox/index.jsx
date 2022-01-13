import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button, { BUTTON_COLOR, BUTTON_SIZE } from '../Button';
import i18n from '../../utils/i18n';
import FlyoutSearchBox from '../FlyoutSearchBox';
import './ButtonFlyoutSearchBox.scss';
import {
  addDocumentClickEventListeners,
  removeDocumentClickEventListeners,
} from '../../utils/utils';
import { SEARCH_LIST_DISPLAY_PRODUCTS } from '../FlyoutSearchBox/SearchList';

const ButtonFlyoutSearchBox = ({
  onSearch, onSearchListItemClick, searchResults,
  shouldDisplayFlyout, setDisplaySearchboxFlyout, displayResultListOf,
  isSearchLoading, className, onClickOutsideFlyoutSearchBox,
}) => {
  const flyoutSearchBoxRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (shouldDisplayFlyout && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [shouldDisplayFlyout]);
  const onClickOutside = (event) => {
    if (flyoutSearchBoxRef
      && flyoutSearchBoxRef.current
      && !flyoutSearchBoxRef.current.contains(event.target)) {
      setDisplaySearchboxFlyout(false);
      removeDocumentClickEventListeners(onClickOutside);
      onClickOutsideFlyoutSearchBox();
    }
  };

  const onButtonClicked = () => {
    if (!shouldDisplayFlyout) {
      setDisplaySearchboxFlyout(true);
      addDocumentClickEventListeners(onClickOutside);
    } else {
      setDisplaySearchboxFlyout(false);
      removeDocumentClickEventListeners(onClickOutside);
    }
  };

  return (
    <div className={classNames('ButtonFlyoutSearchBox', className)}>
      <Button
        onClick={onButtonClicked}
        size={BUTTON_SIZE.STANDARD}
        color={BUTTON_COLOR.STANDARD}
      >
        {i18n.t(`add_${displayResultListOf}`)}
      </Button>
      {shouldDisplayFlyout && (
        <FlyoutSearchBox
          innerRef={flyoutSearchBoxRef}
          searchInputRef={searchInputRef}
          onSearch={onSearch}
          searchResults={searchResults}
          onSearchListItemClick={onSearchListItemClick}
          displayResultListOf={displayResultListOf}
          isSearchLoading={isSearchLoading}
        />
      )}
    </div>
  );
};

ButtonFlyoutSearchBox.propTypes = {
  onSearch: PropTypes.func,
  onClickOutsideFlyoutSearchBox: PropTypes.func,
  searchResults: PropTypes.objectOf(PropTypes.any),
  onSearchListItemClick: PropTypes.func,
  setDisplaySearchboxFlyout: PropTypes.func,
  shouldDisplayFlyout: PropTypes.bool,
  isSearchLoading: PropTypes.bool,
  displayResultListOf: PropTypes.string,
  className: PropTypes.string,
};

ButtonFlyoutSearchBox.defaultProps = {
  onSearch: () => {},
  onClickOutsideFlyoutSearchBox: () => {},
  searchResults: {},
  onSearchListItemClick: () => {},
  setDisplaySearchboxFlyout: () => {},
  shouldDisplayFlyout: false,
  isSearchLoading: false,
  displayResultListOf: SEARCH_LIST_DISPLAY_PRODUCTS,
  className: '',
};

export default React.memo(ButtonFlyoutSearchBox);
