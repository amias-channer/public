import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NavigationMenu.scss';
import {
  Button, Container, Nav, Row,
} from 'reactstrap';

import { connect } from 'react-redux';
import { createLocation } from 'history';
import {
  closeOtherSubMenusAction,
  openSideMenuAction,
  toggleSubMenuAction,
  closeAllSubMenusAction,
  closeSideMenuAction,
  gotNavigationItems,
} from './actions';
import ListItems from './ListItems';
import LanguageSelector from '../../LanguageSelector';
import getAppConfig from '../../../main/AppConfig';
import { oneOrMoreVisibleNavigationItem, isModeFlatex } from '../../../utils/utils';
import NavLinkItem from './NavLinkItem';
import {
  hasSubNavMenuItems,
  MENU_TYPE_MAIN_MENU,
  MENU_TYPE_TOOLS_MENU,
} from './NavigationMenu.helper';

export class NavigationMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.openSideMenu = this.openSideMenu.bind(this);
    this.closeSideMenu = this.closeSideMenu.bind(this);
    this.toggleSubMenu = this.toggleSubMenu.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.closeAll = this.closeAll.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      const appConfig = getAppConfig();
      const { main, tools, flatex } = appConfig.navigation;
      if (isModeFlatex()) {
        dispatch(gotNavigationItems(flatex, []));
      } else {
        dispatch(gotNavigationItems(main, tools));
      }
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  getItemWithSubNavItems(item, type) {
    if (item && item.isHidden !== true) {
      return (
        <li key={item.id} className={`nav-item dropdown has-submenu ${type} ${item.submenuActive ? 'show' : ''}`}>
          <NavLink
            className="nav-link dropdown-toggle"
            data-toggle="dropdown"
            to={createLocation(item.url)}
            onClick={(event) => this.toggleSubMenu(event, item)}
            exact={item.url === '/'}
          >
            {item.pageTitle}
          </NavLink>
          <ListItems items={item.submenu} hrefKey="url" hrefText="pageTitle" closeAll={this.closeAll} />
        </li>
      );
    }
    return null;
  }

  getParentNavigationItems(list, type, onlyShowParentNavItems = false) {
    if (list) {
      return list.map((item) => {
        if (item && item.isHidden !== true) {
          if (
            hasSubNavMenuItems(item)
            && oneOrMoreVisibleNavigationItem(item.submenu)
            && !onlyShowParentNavItems
          ) {
            return this.getItemWithSubNavItems(item, type);
          }

          return (
            <NavLinkItem
              key={item.id}
              item={item}
              type={type}
              onlyShowParentNavItems={onlyShowParentNavItems}
              closeAll={this.closeAll}
            />
          );
        }
        return null;
      });
    }
    return null;
  }

  registerEventListener() {
    this.unregisterEventListener();
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleClickOutside);
  }

  unregisterEventListener() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  }

  toggleSubMenu(e, item) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(closeOtherSubMenusAction(item));
    dispatch(toggleSubMenuAction(item));
    this.registerEventListener();
  }

  // eslint-disable-next-line react/sort-comp
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.closeAll();
    }
  }

  closeAll() {
    const { dispatch } = this.props;
    dispatch(closeAllSubMenusAction());
    dispatch(closeSideMenuAction());
    this.unregisterEventListener();
  }

  closeSideMenu() {
    const { dispatch } = this.props;
    dispatch(closeSideMenuAction());
    this.unregisterEventListener();
  }

  openSideMenu() {
    const { dispatch } = this.props;
    dispatch(openSideMenuAction());
    this.registerEventListener();
  }

  render() {
    const {
      mode, isOpen, items, tools, onlyShowParentNavItems,
    } = this.props;
    const mainNavItems = this.getParentNavigationItems(
      items,
      MENU_TYPE_MAIN_MENU,
      onlyShowParentNavItems,
    );
    const toolsNavItems = this.getParentNavigationItems(tools, MENU_TYPE_TOOLS_MENU);
    return (
      <div ref={this.setWrapperRef} className={`NavigationMenu ${mode}`}>
        {mode === 'desktop' && (
        <Container>
          <Row>
            <Nav pills>
              {' '}
              {mainNavItems}
              {toolsNavItems}
              {' '}
            </Nav>
          </Row>
        </Container>
        )}
        {mode !== 'desktop' && (
        <nav>
          <Button type="button" color="outline" className="toggler open-side-menu" onClick={this.openSideMenu}><i className="icon-menu" /></Button>
          {isOpen && (
            <div className="overlay" onClick={this.closeSideMenu} onKeyDown={() => {}} tabIndex={0} role="button" aria-label="Close" onTouchEnd={this.closeSideMenu} />
          )}
          <div className={isOpen ? 'show nav-side-menu' : 'nav-side-menu'}>
            <div>
              <Button type="button" color="outline" className="float-right sticky-top close-side-menu" onClick={this.closeSideMenu}><i className="icon-close" /></Button>
            </div>
            <Nav className="" navbar>
              {' '}
              {mainNavItems}
              {toolsNavItems}
              <LanguageSelector mode={mode} />
            </Nav>
          </div>
        </nav>
        )}
      </div>
    );
  }
}

NavigationMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.oneOfType(
    [PropTypes.string, PropTypes.any],
  )),
  tools: PropTypes.arrayOf(PropTypes.oneOfType(
    [PropTypes.string, PropTypes.any],
  )),
  dispatch: PropTypes.func,
  isOpen: PropTypes.bool,
  mode: PropTypes.string,
  onlyShowParentNavItems: PropTypes.bool,
};

NavigationMenu.defaultProps = {
  items: [],
  tools: [],
  dispatch: null,
  isOpen: false,
  mode: 'desktop',
  onlyShowParentNavItems: false,
};

function mapStateToProps(state) {
  return {
    isOpen: state.navigation.isOpen,
    items: state.navigation.items,
    tools: state.navigation.tools,
  };
}

export default connect(mapStateToProps)(NavigationMenu);
