import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import i18n from '../../../../../utils/i18n';
import './ToggleableTab.scss';
import { DESKTOP_MODE, MOBILE_MODE } from '../../../../../utils/responsive';

const ToggleableTab = ({
  tabKey, className, toggleTabFunc, isActive, responsiveMode,
}) => {
  const toggleTab = () => {
    if (toggleTabFunc && tabKey) {
      toggleTabFunc(tabKey);
    }
  };

  const translatedTabName = i18n.t(responsiveMode === MOBILE_MODE ? `${tabKey}_small` : tabKey);
  return (
    <div
      className={classNames('ToggleableTab col', className, isActive ? 'active' : '')}
    >
      <div
        className="inner-toggleable"
        onClick={toggleTab}
        onKeyUp={toggleTab}
        role="button"
        tabIndex="-1"
      >
        <span>{translatedTabName}</span>
        <i className={isActive ? 'icon-arrow_02_up' : 'icon-arrow_02_down'} />
      </div>
    </div>
  );
};
ToggleableTab.propTypes = {
  tabKey: PropTypes.string.isRequired,
  toggleTabFunc: PropTypes.func.isRequired,
  responsiveMode: PropTypes.string,
  className: PropTypes.string,
  isActive: PropTypes.bool,
};
ToggleableTab.defaultProps = {
  isActive: false,
  className: '',
  responsiveMode: DESKTOP_MODE,
};
export default React.memo(ToggleableTab);
