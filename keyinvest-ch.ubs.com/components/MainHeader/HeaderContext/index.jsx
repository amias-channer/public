import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';

class HeaderContextComponent extends React.PureComponent {
  render() {
    const { className, headerContext, showSeparator } = this.props;
    if (headerContext) {
      return (
        <span className={classNames('HeaderContext', className)}>
          {showSeparator && (<span className="context-separator">|</span>)}
          <span>{headerContext}</span>
        </span>
      );
    }

    return null;
  }
}

HeaderContextComponent.propTypes = {
  className: PropTypes.string,
  headerContext: PropTypes.string,
  showSeparator: PropTypes.bool,
};
HeaderContextComponent.defaultProps = {
  className: '',
  headerContext: null,
  showSeparator: false,
};

const mapStateToProps = (state) => ({
  headerContext: (
    pathOr(
      pathOr(null, ['global', 'navigationItemData', 'pageTitle'])(state),
      ['global', 'navigationItemData', 'topMenuItemTitle'],
    )(state)
  ),
});

const HeaderContext = connect(mapStateToProps)(HeaderContextComponent);
export default HeaderContext;
