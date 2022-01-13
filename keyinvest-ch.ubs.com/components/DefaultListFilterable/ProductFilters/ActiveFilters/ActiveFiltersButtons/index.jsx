import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import CustomButton, { BUTTON_COLOR, BUTTON_SIZE } from '../../../../Button';
import i18n from '../../../../../utils/i18n';
import { toggleSaveSearchPopup } from '../../../../UserDashboard/MySearches/actions';

const ActiveFiltersButtons = ({
  filtersData,
  displaySaveButton,
  onResetFunc,
  displayResetButton,
  dispatch,
}) => {
  const onSaveClicked = () => {
    dispatch(toggleSaveSearchPopup(true, filtersData));
  };
  return (
    <>
      {displaySaveButton && (
        <CustomButton
          onClick={onSaveClicked}
          color={BUTTON_COLOR.ATLANTIC_DARK}
          size={BUTTON_SIZE.SMALL}
          className="save-filters mr-2"
        >
          {i18n.t('save_filters')}
        </CustomButton>
      )}
      {displayResetButton && (
        <Button
          onClick={onResetFunc}
          color="outline"
          className="reset-filters"
        >
          {i18n.t('reset_all_filters')}
        </Button>
      )}
    </>
  );
};

ActiveFiltersButtons.propTypes = {
  filtersData: PropTypes.objectOf(PropTypes.any),
  displaySaveButton: PropTypes.bool,
  displayResetButton: PropTypes.bool,
  onResetFunc: PropTypes.func,
  dispatch: PropTypes.func,
};

ActiveFiltersButtons.defaultProps = {
  filtersData: null,
  displaySaveButton: false,
  displayResetButton: false,
  onResetFunc: () => {},
  dispatch: () => {},
};

export default connect()(React.memo(ActiveFiltersButtons));
