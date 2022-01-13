import React from 'react';
import { connect } from 'react-redux';
import {
  DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown,
} from 'reactstrap';
import './LanguageSelector.scss';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import getAppConfig from '../../main/AppConfig';
import i18n from '../../utils/i18n';
import { generateLanguageChangeUrlByLocale } from './LanguageSelector.helper';

export class LanguageSelectorComponent extends React.PureComponent {
  render() {
    const { currentStateName, location, additionalNavigationData } = this.props;
    const { localesToUrl, locale } = getAppConfig();
    const items = Object.keys(localesToUrl).map(
      (localeKey) => (
        <DropdownItem
          key={localeKey}
          tag="a"
          href={generateLanguageChangeUrlByLocale(
            localesToUrl[localeKey], currentStateName, location, additionalNavigationData,
          )}
          active={localeKey === locale}
        >
          <span>{i18n.t(localeKey)}</span>
        </DropdownItem>
      ),
    );
    const { mode, labelAsActiveValue } = this.props;
    if (items && items.length > 1) {
      return (
        <UncontrolledDropdown
          tag={mode === 'mobile' ? 'li' : 'div'}
          className={`LanguageSelector d-print-none ${mode === 'mobile' ? 'mobile nav-item dropdown has-submenu' : mode}`}
        >
          <DropdownToggle
            tag={mode === 'mobile' ? 'a' : 'button'}
            className={`${mode === 'mobile' ? 'nav-link dropdown-toggle' : 'nav-link btn btn-white'}`}
            caret
          >
            {labelAsActiveValue ? i18n.t(locale) : i18n.t('Sprache')}
          </DropdownToggle>
          <DropdownMenu className={mode === 'mobile' ? 'no-bootstrap-style' : 'dropdown-menu-styled'}>
            {items}
          </DropdownMenu>
        </UncontrolledDropdown>
      );
    }
    return null;
  }
}
LanguageSelectorComponent.propTypes = {
  mode: PropTypes.string,
  currentStateName: PropTypes.string,
  location: PropTypes.objectOf(PropTypes.any),
  additionalNavigationData: PropTypes.objectOf(PropTypes.any),
  labelAsActiveValue: PropTypes.bool,
};

LanguageSelectorComponent.defaultProps = {
  mode: 'desktop',
  currentStateName: undefined,
  location: {},
  additionalNavigationData: {},
  labelAsActiveValue: false,
};
const EMPTY_OBJ = {};
const mapStateToProps = (state) => ({
  currentStateName: state.global.stateName,
  location: state.router.location,
  additionalNavigationData: pathOr(EMPTY_OBJ, ['global', 'navigationItemData', 'additionalNavigationData'], state),
});

const LanguageSelector = connect(mapStateToProps)(LanguageSelectorComponent);
export default LanguageSelector;
