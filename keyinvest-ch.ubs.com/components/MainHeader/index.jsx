import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Col, Container, Row,
} from 'reactstrap';
import { connect } from 'react-redux';
import { produce } from 'immer';
import MediaQuery from 'react-responsive';
import logo from '../../assets/images/logo.png';
import './MainHeader.scss';
import LoginButton from './LoginButton';
import LanguageSelector from '../LanguageSelector';
import SearchBarComponent from './SearchBar';
import mediaQueries from '../../utils/mediaQueries';
import getAppConfig from '../../main/AppConfig';
import NavigationMenuComponent from './NavigationMenu';
import HeaderContext from './HeaderContext';
import { isModeFlatex } from '../../utils/utils';
import AuthPopup from '../Authentication/AuthPopup';
import Icon from '../Icon';
import { authTogglePopup } from '../Authentication/actions';
import { searchBarSetFocus } from './SearchBar/actions';

export class MainHeaderCmp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bodyScrolled: false,
    };
    this.onFocusChange = this.onFocusChange.bind(this);
    this.setSearchFocus = this.setSearchFocus.bind(this);
    this.showAuthPopup = this.showAuthPopup.bind(this);
    this.onScroll = this.onScroll.bind(this);
    const appConfig = getAppConfig();
    this.mainNavigationItems = appConfig.navigation.main;
    this.toolsNavigationItems = appConfig.navigation.tools;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, { passive: true });
  }

  onScroll() {
    let scrolled = false;
    if (window.pageYOffset > 20) {
      scrolled = true;
    }

    const { bodyScrolled } = this.state;
    if (scrolled !== bodyScrolled) {
      this.setState(produce((draft) => {
        draft.bodyScrolled = scrolled;
      }));
    }
  }

  onFocusChange(status) {
    const { dispatch } = this.props;
    dispatch(searchBarSetFocus(status));
  }

  setSearchFocus() {
    const { dispatch } = this.props;
    dispatch(searchBarSetFocus(true));
  }

  showAuthPopup() {
    const { dispatch } = this.props;
    dispatch(authTogglePopup(true));
  }

  render() {
    const { bodyScrolled } = this.state;
    const { showTopAuthPopup, searchIsFocused } = this.props;
    const rating = (
      <>
        <span>Rating:</span>
        <span>S&P A+</span>
        <span className="separator">|</span>
        <span>Moody’s Aa3</span>
        <span className="separator">|</span>
        <span>Fitch AA-</span>
      </>
    );
    if (!isModeFlatex()) {
      return (
        <div className={`MainHeader d-print-none fixed-top ${bodyScrolled ? 'scrolled' : ''}`}>
          {showTopAuthPopup && (
            <AuthPopup />
          )}
          <Container>
            <Row className="align-items-center">
              <Col xs="3" className={`logo ${bodyScrolled ? 'col-lg-auto' : ''}`}>
                <Row className="align-items-center">
                  {bodyScrolled === true && (
                    <MediaQuery query={mediaQueries.notebook}>
                      <div className="col-auto">
                        <NavigationMenuComponent
                          mode="mobile"
                          items={this.mainNavigationItems}
                          tools={this.toolsNavigationItems}
                        />
                      </div>
                    </MediaQuery>
                  )}
                  <div className="col-auto">
                    <a className="logo-link" href="/">
                      <img src={logo} alt="UBS KeyInvest" />
                      <span>KeyInvest</span>
                    </a>
                    {bodyScrolled === true && (
                      <MediaQuery query={mediaQueries.notebook}>
                        <HeaderContext showSeparator />
                      </MediaQuery>
                    )}
                  </div>
                </Row>
              </Col>

              <MediaQuery query={mediaQueries.mobileTabletOnly}>
                <Col xs="9" className="tools text-right">
                  <Button color="outline" onClick={this.setSearchFocus}><Icon type="glass" /></Button>
                  <Button color="outline" onClick={this.showAuthPopup}>
                    <Icon type="logout" />
                  </Button>
                  <NavigationMenuComponent
                    mode="mobile"
                    items={this.mainNavigationItems}
                    tools={this.toolsNavigationItems}
                  />
                  { searchIsFocused && (
                    <SearchBarComponent
                      isFocused={searchIsFocused}
                      onFocusChange={this.onFocusChange}
                    />
                  )}
                </Col>
              </MediaQuery>

              <MediaQuery query={mediaQueries.notebook}>
                <div className="rating col-auto ml-auto pr-3 rating-column">
                  {rating}
                </div>
                <div className="tools col-auto">
                  <div className="row align-items-center">
                    <div className="col-auto language-selector-column">
                      <LanguageSelector />
                    </div>
                    <div className="col-auto header-search-column">
                      <SearchBarComponent
                        isFocused={searchIsFocused}
                        onFocusChange={this.onFocusChange}
                      />
                    </div>
                    <div className="col-auto">
                      <LoginButton />
                    </div>
                  </div>
                </div>
              </MediaQuery>
            </Row>
          </Container>
          {bodyScrolled !== true && (
            <MediaQuery query={mediaQueries.notebook}>
              <NavigationMenuComponent
                mode="desktop"
                items={this.mainNavigationItems}
                tools={this.toolsNavigationItems}
                onlyShowParentNavItems
              />
            </MediaQuery>
          )}
          <MediaQuery query={mediaQueries.tabletOnly}>
            <div className="rating">
              <Container>
                <Row>
                  {rating}
                </Row>
              </Container>
            </div>
          </MediaQuery>
        </div>
      );
    }
    return (
      <div className="MainHeader d-print-none is-flatex-header">
        <NavigationMenuComponent
          mode="desktop"
          items={this.mainNavigationItems}
          tools={this.toolsNavigationItems}
        />
      </div>
    );
  }
}

MainHeaderCmp.propTypes = {
  dispatch: PropTypes.func,
  searchIsFocused: PropTypes.bool,
  showTopAuthPopup: PropTypes.bool,
};
MainHeaderCmp.defaultProps = {
  dispatch: () => {},
  showTopAuthPopup: false,
  searchIsFocused: false,
};
const mapStateToProps = (state) => ({
  searchIsFocused: state.searchBar.searchIsFocused,
  showTopAuthPopup: state.auth.showTopAuthPopup,
});

const MainHeader = connect(mapStateToProps)(MainHeaderCmp);
export default MainHeader;
