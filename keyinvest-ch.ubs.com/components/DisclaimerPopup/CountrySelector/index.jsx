import React from 'react';
import {
  DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown,
} from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './CountrySelector.scss';
import { getDisclaimerCountries } from '../DisclaimerPopup.helper';
import Logger from '../../../utils/logger';

const CountrySelectorComponent = ({
  selectedCountry,
  setSelectedCountry,
  setExtraText,
  className,
}) => {
  const onChangeCountry = (country) => () => {
    try {
      setSelectedCountry(country);
      setExtraText(country.extraText);
    } catch (ex) {
      Logger.warn(ex);
    }
  };

  const items = getDisclaimerCountries().map(
    (country) => (
      <DropdownItem
        key={country.label}
        tag="a"
        onClick={onChangeCountry(country)}
        href={country.link}
        data-extra={country.extraText}
        active={country.link === selectedCountry.link}
      >
        <span>{country.label}</span>
      </DropdownItem>
    ),
  );

  if (items && items.length > 1) {
    return (
      <UncontrolledDropdown
        tag="span"
        className={classNames('CountrySelector d-print-none desktop', className)}
      >
        <DropdownToggle
          tag="span"
          className="toggle-btn nav-link btn"
          caret
        >
          {selectedCountry.label}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-styled">
          {items}
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
  return null;
};

const EMPTY_OBJ = {};
CountrySelectorComponent.propTypes = {
  className: PropTypes.string,
  setSelectedCountry: PropTypes.func,
  setExtraText: PropTypes.func,
  selectedCountry: PropTypes.objectOf(PropTypes.any),
};

CountrySelectorComponent.defaultProps = {
  className: '',
  selectedCountry: EMPTY_OBJ,
  setSelectedCountry: () => {},
  setExtraText: () => {},
};

const CountrySelector = React.memo(CountrySelectorComponent);
export default CountrySelector;
