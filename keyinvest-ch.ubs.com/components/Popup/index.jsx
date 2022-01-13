import React, { createRef } from 'react';
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import './Popup.scss';

class PopupComp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.node = createRef();
    this.scrollbarRef = createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  handleClickOutside(e) {
    const { togglePopup } = this.props;
    if (this.node
      && this.node.current
      && this.node.current.contains
      && this.node.current.contains(e.target)) {
      return;
    }
    togglePopup();
  }

  scrollTo(topPositionOfElement) {
    if (this.scrollbarRef && this.scrollbarRef.current) {
      this.scrollbarRef.current.scrollTop(topPositionOfElement);
    }
  }

  render() {
    const {
      className, children, togglePopup,
    } = this.props;
    return (
      <div className={classNames('Popup container p-0', className)} ref={this.node}>
        <div className="popup-container">
          <Scrollbars
            autoHeight
            autoHeightMin={100}
            autoHeightMax="calc(100vh - 100px)"
            ref={this.scrollbarRef}
          >
            <div className="inner-container">
              <Button className="close-button" color="outline" onClick={togglePopup}>
                <Icon type="close" />
              </Button>
              {children}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

PopupComp.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType(
    [
      PropTypes.objectOf(PropTypes.any),
      PropTypes.arrayOf(PropTypes.any),
      PropTypes.node,
    ],
  ),
  togglePopup: PropTypes.func,
};

PopupComp.defaultProps = {
  className: '',
  children: {},
  togglePopup: () => {},
};

const Popup = (PopupComp);
export default Popup;
